import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { connectDB, isDBConnected } from './config/db.js';

import authRoutes from './routes/auth.js';
import permissionsRoutes from './routes/permissions.js';
import usageRoutes from './routes/usage.js';
import deviceRoutes, { wsScreenClients, getLatestAppFrame } from './routes/device.js';
import parentRoutes from './routes/parent.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ==========================================
// CORS - Allow ALL origins (for mobile app)
// ==========================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
}));
app.options('*', cors()); // Pre-flight for all routes

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SafeShield Backend API',
    database: isDBConnected() ? 'MS SQL Server (Connected)' : 'Active Memory Mode',
    timestamp: new Date().toISOString(),
    message: 'Backend is reachable from mobile devices'
  });
});

// Download latest APK directly to phone over WiFi
app.get('/download-apk', (req, res) => {
  const apkPath = 'c:/safe mobile/safeshield-companion.apk';
  res.download(apkPath, 'safeshield-companion.apk');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);

import os from 'os';

// Get local network IPv4 address (prioritizing Wi-Fi / LAN over virtual switches)
function getLocalIp() {
  const nets = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(nets)) {
    // Skip virtual/docker/vethernet adapters if possible
    const isVirtual = /vEthernet|Virtual|Loopback|WSL/i.test(name);
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        if (!isVirtual) {
          candidates.unshift(net.address); // non-virtual first
        } else {
          candidates.push(net.address);
        }
      }
    }
  }
  // Prefer 192.168.x or 10.x LAN IPs
  const lanIp = candidates.find(ip => ip.startsWith('192.168.') || ip.startsWith('10.'));
  return lanIp || candidates[0] || 'localhost';
}

// Connect Database and Start Server
async function startServer() {
  await connectDB();

  const localIp = getLocalIp();

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws/screen' });

  wss.on('connection', (ws) => {
    wsScreenClients.add(ws);
    const current = getLatestAppFrame();
    if (current && current.buffer && (Date.now() - current.time < 25000)) {
      try {
        ws.send(current.buffer, { binary: true });
      } catch (_) {}
    }
    ws.on('close', () => wsScreenClients.delete(ws));
    ws.on('error', () => wsScreenClients.delete(ws));
  });

  // Listen on ALL interfaces so mobile devices can connect
  server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 ==========================================');
    console.log(`🚀  SafeShield Backend is RUNNING!`);
    console.log('🚀 ==========================================');
    console.log(`📡  Local:    http://localhost:${PORT}`);
    console.log(`📱  Network:  http://${localIp}:${PORT}  ← USE THIS IN MOBILE APP`);
    console.log(`📊  Health:   http://${localIp}:${PORT}/api/health`);
    console.log(`⚡  ScreenWS: ws://${localIp}:${PORT}/ws/screen`);
    console.log('🚀 ==========================================');
    console.log('');
    console.log('ℹ️  Mobile phone MUST be on same WiFi as this PC');
    console.log('ℹ️  If phone cannot connect, check Windows Firewall or IP setting');
    console.log('');
  });
}

startServer();

