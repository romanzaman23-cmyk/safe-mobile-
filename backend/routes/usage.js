import express from 'express';
import { getDBPool, isDBConnected, memoryStore, sql } from '../config/db.js';

const router = express.Router();

// GET /api/usage
router.get('/', async (req, res) => {
  try {
    let appUsageData = memoryStore.appUsage;

    if (isDBConnected()) {
      const pool = getDBPool();
      const result = await pool.request().query('SELECT * FROM dbo.AppUsage ORDER BY usage_minutes DESC');
      appUsageData = result.recordset;
    }

    res.json({
      success: true,
      screenTime: {
        todayTotalMinutes: 272, // 4h 32m
        todayLimitMinutes: 300, // 5h 00m
        todayRemainingMinutes: 28,
        percentUsed: 90,
        weeklyTotalMinutes: 1725, // 28h 45m
        weeklyAverageMinutes: 246, // 4h 06m
        weeklyTrendPercent: -12,
        downtimeSchedule: {
          startsAt: '21:30',
          title: 'Downtime Schedule',
          status: 'Active 9:30 PM (School night)',
          whitelistedApps: ['Phone', 'Messages', 'SafeShield']
        }
      },
      apps: appUsageData
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/usage/request-extension
router.post('/request-extension', async (req, res) => {
  const { minutes = 30 } = req.body;

  try {
    if (isDBConnected()) {
      const pool = getDBPool();
      await pool.request()
        .input('minutes', sql.Int, minutes)
        .input('status', sql.NVarChar, 'Pending')
        .input('msg', sql.NVarChar, `Requested +${minutes} min screen time`)
        .query('INSERT INTO dbo.TimeRequests (child_id, requested_minutes, status, message) VALUES (1, @minutes, @status, @msg)');
    } else {
      memoryStore.timeRequests.push({
        id: memoryStore.timeRequests.length + 1,
        child_id: 1,
        requested_minutes: minutes,
        status: 'Pending',
        created_at: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: `Request for +${minutes} minutes sent to Ahmed Al-Salem successfully!`,
      requestedMinutes: minutes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
