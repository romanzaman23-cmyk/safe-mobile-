import express from 'express';
import { getDBPool, isDBConnected, memoryStore, sql } from '../config/db.js';
import { sharedStore, findChildById } from '../config/sharedStore.js';

const router = express.Router();

// GET /api/device/telemetry
router.get('/telemetry', async (req, res) => {
  try {
    const activeChild = sharedStore.children.find(c => c.id === sharedStore.activeLoggedInChildId) || sharedStore.children[0] || null;

    res.json({
      success: true,
      telemetry: {
        battery_level: activeChild ? activeChild.battery : 88,
        network_type: 'Wi-Fi 5GHz',
        storage_used_gb: 34.2,
        storage_total_gb: 128.0,
        os_version: activeChild ? activeChild.os : 'Android 14 (One UI 6.1)',
        last_sync: new Date().toISOString(),
        is_locked: activeChild ? activeChild.isLocked : false,
        all_paused: sharedStore.allPaused
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/device/sync (Real-Time Heartbeat from Mobile Companion App)
router.post('/sync', async (req, res) => {
  try {
    const { childId, battery, activeApp, screenTimeMinutes, platform, appState } = req.body;
    const targetId = childId || sharedStore.activeLoggedInChildId || sharedStore.children[0]?.id;
    const child = targetId ? findChildById(targetId) : null;

    if (child) {
      if (battery !== undefined) child.battery = parseInt(battery);
      if (activeApp) child.activeApp = activeApp;
      if (appState) child.appState = appState;
      else if (activeApp && (activeApp.includes('Outside App') || activeApp.includes('Launcher'))) child.appState = 'background';
      else child.appState = 'active';

      if (screenTimeMinutes !== undefined) child.screenTimeUsed = `${screenTimeMinutes}m`;
      child.status = child.isLocked ? 'attention' : 'online';
      child.lastSync = new Date().toISOString();
    }

    const newTimestamp = new Date().toISOString();
    memoryStore.deviceTelemetry.last_sync = newTimestamp;

    res.json({
      success: true,
      message: 'Companion telemetry synced in real-time',
      isLocked: child ? (child.isLocked || sharedStore.allPaused) : sharedStore.allPaused,
      allPaused: sharedStore.allPaused,
      sirenActive: child ? !!child.sirenActive : false,
      last_sync: newTimestamp
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/device/dismiss-siren
router.post('/dismiss-siren', async (req, res) => {
  try {
    const { childId } = req.body;
    const targetId = childId || sharedStore.activeLoggedInChildId || sharedStore.children[0]?.id;
    const child = targetId ? findChildById(targetId) : null;

    if (child) {
      child.sirenActive = false;
    }

    res.json({ success: true, message: 'Emergency Siren dismissed on device' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

import { spawn, exec } from 'child_process';

let latestAppFrameBuffer = null;
let latestAppFrameTime = 0;
let cachedAdbFrame = null;
let cachedAdbTime = 0;
let isAdbCapturing = false;
let cachedAdbDevice = null;
let lastAdbDeviceCheck = 0;

export const wsScreenClients = new Set();

export function getLatestAppFrame() {
  return { buffer: latestAppFrameBuffer, time: latestAppFrameTime };
}

export function broadcastWsScreenFrame(buffer) {
  for (const client of wsScreenClients) {
    if (client.readyState === 1) { // WebSocket.OPEN
      try {
        client.send(buffer, { binary: true });
      } catch (err) {
        wsScreenClients.delete(client);
      }
    }
  }
}

// Set of active MJPEG clients for 0ms push streaming
const mjpegClients = new Set();

// Check if any ADB device is connected (cached for 10s to prevent event-loop freezing)
function getConnectedAdbDevice() {
  const now = Date.now();
  if (now - lastAdbDeviceCheck < 10000 && cachedAdbDevice !== undefined) {
    return Promise.resolve(cachedAdbDevice);
  }
  return new Promise((resolve) => {
    exec('adb devices', { timeout: 1500 }, (err, stdout) => {
      lastAdbDeviceCheck = Date.now();
      if (err || !stdout) {
        cachedAdbDevice = null;
        return resolve(null);
      }
      const lines = stdout.trim().split('\n').slice(1);
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2 && parts[1] === 'device') {
          cachedAdbDevice = parts[0];
          return resolve(cachedAdbDevice);
        }
      }
      cachedAdbDevice = null;
      resolve(null);
    });
  });
}

// Capture frame via ADB
function captureAdbScreen() {
  return new Promise((resolve) => {
    if (isAdbCapturing) {
      return resolve(cachedAdbFrame);
    }
    isAdbCapturing = true;
    const proc = spawn('adb', ['exec-out', 'screencap', '-p'], { timeout: 4000 });
    const chunks = [];
    proc.stdout.on('data', (chunk) => chunks.push(chunk));
    proc.on('close', (code) => {
      isAdbCapturing = false;
      if (code === 0 && chunks.length > 0) {
        const fullBuf = Buffer.concat(chunks);
        resolve(fullBuf);
      } else {
        resolve(null);
      }
    });
    proc.on('error', () => {
      isAdbCapturing = false;
      resolve(null);
    });
  });
}

// GET /api/device/screen-status
router.get('/screen-status', async (req, res) => {
  try {
    const hasAppFeed = latestAppFrameBuffer && (Date.now() - latestAppFrameTime < 25000);
    const adbDevice = hasAppFeed ? null : await getConnectedAdbDevice();
    res.json({
      success: true,
      hasLiveFeed: !!hasAppFeed || !!adbDevice,
      source: hasAppFeed ? 'companion-app' : (adbDevice ? 'adb' : 'none'),
      adbDevice: adbDevice || null,
      lastFrameTime: latestAppFrameTime || cachedAdbTime || null
    });
  } catch (err) {
    res.json({ success: false, hasLiveFeed: false, error: err.message });
  }
});

// GET /api/device/mjpeg-feed (Persistent Zero-Polling Live Video Stream)
router.get('/mjpeg-feed', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=liveframeboundary',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Connection': 'keep-alive',
    'Pragma': 'no-cache'
  });

  const client = res;
  mjpegClients.add(client);

  // Send current frame immediately if available
  if (latestAppFrameBuffer) {
    client.write(`--liveframeboundary\r\nContent-Type: image/jpeg\r\nContent-Length: ${latestAppFrameBuffer.length}\r\n\r\n`);
    client.write(latestAppFrameBuffer);
    client.write('\r\n');
  }

  req.on('close', () => {
    mjpegClients.delete(client);
  });
});

// GET /api/device/live-screen-feed (Single frame getter with 0 delay)
router.get('/live-screen-feed', async (req, res) => {
  try {
    // 1. Companion app uploaded frame (0ms latency fast-path)
    if (latestAppFrameBuffer && (Date.now() - latestAppFrameTime < 25000)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.send(latestAppFrameBuffer);
    }

    // 2. Fallback to ADB physical screen if connected
    const adbDevice = await getConnectedAdbDevice();
    if (adbDevice) {
      const now = Date.now();
      if (cachedAdbFrame && (now - cachedAdbTime < 300)) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.send(cachedAdbFrame);
      }
      const frame = await captureAdbScreen();
      if (frame && frame.length > 2000) {
        cachedAdbFrame = frame;
        cachedAdbTime = now;
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.send(frame);
      }
    }

    // 3. Not connected
    res.status(404).json({ success: false, message: 'No live screen feed available' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Broadcast frame to all open MJPEG streams
function broadcastFrameToMjpeg(buffer) {
  for (const client of mjpegClients) {
    try {
      client.write(`--liveframeboundary\r\nContent-Type: image/jpeg\r\nContent-Length: ${buffer.length}\r\n\r\n`);
      client.write(buffer);
      client.write('\r\n');
    } catch {
      mjpegClients.delete(client);
    }
  }
}

// POST /api/device/screen-frame (Supports both raw binary JPEG and Base64)
router.post('/screen-frame', express.raw({ type: 'image/*', limit: '10mb' }), express.json({ limit: '10mb' }), (req, res) => {
  try {
    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
      latestAppFrameBuffer = req.body;
      latestAppFrameTime = Date.now();
      broadcastFrameToMjpeg(latestAppFrameBuffer);
      broadcastWsScreenFrame(latestAppFrameBuffer);
      return res.json({ success: true });
    }

    const { frame } = req.body || {};
    if (frame) {
      const base64Data = frame.replace(/^data:image\/\w+;base64,/, '');
      latestAppFrameBuffer = Buffer.from(base64Data, 'base64');
      latestAppFrameTime = Date.now();
      broadcastFrameToMjpeg(latestAppFrameBuffer);
      broadcastWsScreenFrame(latestAppFrameBuffer);
      return res.json({ success: true, message: 'Frame received' });
    }

    res.status(400).json({ success: false, message: 'No frame data' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/device/connect-wireless-adb
router.post('/connect-wireless-adb', express.json(), (req, res) => {
  const { ip, port } = req.body;
  if (!ip) return res.status(400).json({ success: false, message: 'IP is required' });
  const target = port ? `${ip}:${port}` : ip;
  exec(`adb connect ${target}`, { timeout: 5000 }, (err, stdout, stderr) => {
    res.json({
      success: !err && (stdout.includes('connected') || stdout.includes('already connected')),
      output: (stdout || '') + (stderr || '')
    });
  });
});

export default router;
