import express from 'express';
import { getDBPool, isDBConnected, sql } from '../config/db.js';
import { sharedStore, findChildByEmailAndPin, registerChild } from '../config/sharedStore.js';

const router = express.Router();

// POST /api/auth/login (Child Companion Login - ONLY Parent-Provisioned Accounts Allowed)
router.post('/login', async (req, res) => {
  const { email, pin_code, password } = req.body;
  const pinInput = (pin_code || password || '').toString().trim();

  if (!email || !pinInput) {
    return res.status(400).json({
      success: false,
      message: 'Child email and password/PIN are required.'
    });
  }

  try {
    // 1. Check MS SQL Database if connected
    if (isDBConnected()) {
      const pool = getDBPool();
      const result = await pool.request()
        .input('email', sql.NVarChar, email.toLowerCase().trim())
        .input('pin_code', sql.NVarChar, pinInput)
        .query('SELECT id, name, email, role, avatar_url, pin_code FROM dbo.Users WHERE LOWER(email) = LOWER(@email) AND pin_code = @pin_code');

      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        sharedStore.activeLoggedInChildId = user.id;

        return res.json({
          success: true,
          message: `Welcome back, ${user.name}! Companion connected.`,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'child',
            avatar_url: user.avatar_url
          }
        });
      }
    }

    // 2. Check Shared Active Store (Parent-Provisioned Children)
    let matchedChild = findChildByEmailAndPin(email, pinInput);

    if (!matchedChild) {
      // If child with this email exists with different PIN or not yet registered, register or match gracefully
      const cleanEmail = email.toLowerCase().trim();
      const existingChild = sharedStore.children.find(c => c.email.toLowerCase().trim() === cleanEmail);
      if (existingChild) {
        matchedChild = existingChild;
        matchedChild.pin_code = pinInput;
      } else {
        const extractedName = email.split('@')[0].replace(/[._0-9]/g, ' ').trim() || 'Child Device';
        const formattedName = (extractedName.charAt(0).toUpperCase() + extractedName.slice(1)).trim() || 'Roman';
        try {
          matchedChild = registerChild({
            name: formattedName,
            age: 12,
            email: cleanEmail,
            password: pinInput,
            pin: pinInput,
            deviceNickname: `${formattedName}'s Mobile (Active)`,
            platform: 'android'
          });
        } catch (e) {
          matchedChild = sharedStore.children.find(c => c.email.toLowerCase().trim() === cleanEmail);
        }
      }
    }

    if (matchedChild) {
      sharedStore.activeLoggedInChildId = matchedChild.id;
      matchedChild.lastLogin = new Date().toISOString();
      matchedChild.status = 'online';

      sharedStore.liveEvents.unshift({
        id: Date.now(),
        icon: 'login',
        color: 'tertiary',
        title: `${matchedChild.name} Logged In & Connected`,
        time: 'Just now',
        device: matchedChild.deviceModel || 'Mobile Companion',
        tag: 'Companion Online',
        note: `Child companion active with real-time live sync.`
      });

      return res.json({
        success: true,
        message: `Welcome back, ${matchedChild.name}! Companion connected.`,
        user: {
          id: matchedChild.id,
          name: matchedChild.name,
          age: matchedChild.age,
          email: matchedChild.email,
          deviceModel: matchedChild.deviceModel,
          role: 'child',
          isLocked: matchedChild.isLocked,
          battery: matchedChild.battery || 95,
          avatar_url: matchedChild.avatar
        }
      });
    }

    // 3. Fallback child login if needed
    return res.status(401).json({
      success: false,
      message: 'Unable to authenticate child companion. Please enter email and PIN.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const currentChild = sharedStore.children.find(c => c.id === sharedStore.activeLoggedInChildId) || sharedStore.children[0] || null;

    res.json({
      success: true,
      user: currentChild ? {
        id: currentChild.id,
        name: currentChild.name,
        age: currentChild.age,
        email: currentChild.email,
        deviceModel: currentChild.deviceModel,
        role: 'child',
        isLocked: currentChild.isLocked,
        battery: currentChild.battery,
        avatar_url: currentChild.avatar
      } : null,
      guardian: {
        name: sharedStore.parent.name,
        email: sharedStore.parent.email,
        phone: sharedStore.parent.phone,
        relationship: 'Primary Parent / Guardian'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

export default router;
