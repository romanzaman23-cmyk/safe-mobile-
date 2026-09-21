import express from 'express';
import { getDBPool, isDBConnected, memoryStore, sql } from '../config/db.js';

const router = express.Router();

// GET /api/permissions
router.get('/', async (req, res) => {
  try {
    if (isDBConnected()) {
      const pool = getDBPool();
      const result = await pool.request().query('SELECT * FROM dbo.Permissions ORDER BY id ASC');
      return res.json({
        success: true,
        permissions: result.recordset
      });
    }

    res.json({
      success: true,
      permissions: memoryStore.permissions
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/permissions/:id/toggle
router.patch('/:id/toggle', async (req, res) => {
  const permId = parseInt(req.params.id, 10);
  const { is_allowed } = req.body;

  try {
    if (isDBConnected()) {
      const pool = getDBPool();
      await pool.request()
        .input('id', sql.Int, permId)
        .input('is_allowed', sql.Bit, is_allowed ? 1 : 0)
        .query('UPDATE dbo.Permissions SET is_allowed = @is_allowed WHERE id = @id');

      const updated = await pool.request()
        .input('id', sql.Int, permId)
        .query('SELECT * FROM dbo.Permissions WHERE id = @id');

      return res.json({
        success: true,
        permission: updated.recordset[0]
      });
    }

    const perm = memoryStore.permissions.find(p => p.id === permId);
    if (perm) {
      perm.is_allowed = typeof is_allowed === 'boolean' ? is_allowed : !perm.is_allowed;
      return res.json({
        success: true,
        permission: perm
      });
    }

    res.status(404).json({ success: false, message: 'Permission not found' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
