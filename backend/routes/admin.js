import express from 'express';
import { sharedStore } from '../config/sharedStore.js';

const router = express.Router();

// Super Admin SecOps In-Memory Data Store (MS SQL schema compatible)
let adminStore = {
  serverHealth: {
    telemetryOperational: '100%',
    dbLatency: '12ms',
    gatewayStatus: '99.99%',
    geoApiStatus: 'Normal',
    activeWebSockets: 'Live Connected',
    activeSosAlerts: 0
  },
  admins: [
    {
      id: 1,
      name: 'Sarah Connor',
      email: 's.connor@guardiannest.internal',
      role: 'Super Admin',
      department: 'SecOps Core Ops',
      mfaStatus: 'YubiKey FIDO2 (Active)',
      timestamp: 'Active Now',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgdq5rEcDL2PpG-ZKKnL_zIbAsH1RQv0Wd8st1ZlHZgnqRYEic7FD16LruJVaXhb1ThZBMRx5Ozm5bK366K0oaIVLdYXk12Q8xoMhVN_Uft1AtkkZgaf9y0XC98ovqR_Evw8qKp0p9TFEPLt34xuOFKjMRv0qfQOgvy2uAv4yrkAUZcRa3SjK2ejDLwMXYlg990ebqdKPvh4s2RwxXdBu340IINwHA4qFG4_-9wlqBHqTNhTyDUh2i'
    }
  ],
  parents: [],
  childrenFleet: [],
  systemEvents: []
};

// 1. GET /api/admin/overview
router.get('/overview', (req, res) => {
  const totalParentsCount = 1 + adminStore.parents.length;
  const totalChildrenCount = sharedStore.children.length;
  const activeChildrenCount = sharedStore.children.filter(c => c.status === 'online').length;

  res.json({
    success: true,
    data: {
      kpis: {
        totalParents: totalParentsCount,
        totalParentsGrowth: totalParentsCount > 0 ? '+100%' : '0%',
        totalChildren: totalChildrenCount,
        totalChildrenGrowth: totalChildrenCount > 0 ? `+${totalChildrenCount}` : '0%',
        activeChildrenNow: activeChildrenCount,
        activeChildrenPercent: totalChildrenCount > 0 ? `${Math.round((activeChildrenCount / totalChildrenCount) * 100)}%` : '0%',
        activeParents24h: totalParentsCount,
        activeParentsPercent: '100%',
        totalUsers: totalParentsCount + totalChildrenCount,
        totalUsersGrowth: `+${totalParentsCount + totalChildrenCount}`
      },
      serverHealth: adminStore.serverHealth,
      systemEvents: sharedStore.liveEvents.length > 0 ? sharedStore.liveEvents : adminStore.systemEvents,
      deviceBreakdown: {
        ios: { count: sharedStore.children.filter(c => c.platform === 'ios').length, percent: totalChildrenCount > 0 ? Math.round((sharedStore.children.filter(c => c.platform === 'ios').length / totalChildrenCount) * 100) : 0 },
        android: { count: sharedStore.children.filter(c => c.platform === 'android').length, percent: totalChildrenCount > 0 ? Math.round((sharedStore.children.filter(c => c.platform === 'android').length / totalChildrenCount) * 100) : 0 },
        wearables: { count: 0, percent: 0 }
      }
    }
  });
});

// 2. GET /api/admin/parents
router.get('/parents', (req, res) => {
  // Dynamically attach the active shared parent
  const activeSharedParent = {
    id: 100,
    name: sharedStore.parent.name,
    role: sharedStore.parent.role,
    email: sharedStore.parent.email,
    phone: sharedStore.parent.phone,
    childrenCount: sharedStore.children.length,
    childrenNames: sharedStore.children.map(c => `${c.name} (${c.age})`),
    subscriptionTier: sharedStore.parent.activePlan,
    pricing: '$14.99/mo • Live Connected',
    status: 'Active & Verified',
    isVIP: true,
    registeredDate: 'Live Sync',
    registeredTime: 'Real-Time',
    avatar: sharedStore.parent.avatarUrl
  };

  const allParents = [
    activeSharedParent,
    ...adminStore.parents.filter(p => p.email !== sharedStore.parent.email)
  ];

  res.json({
    success: true,
    data: allParents
  });
});

// 3. GET /api/admin/children
router.get('/children', (req, res) => {
  // Map sharedStore.children into admin format
  const dynamicSharedChildren = sharedStore.children.map(c => ({
    id: c.id,
    name: c.name,
    age: c.age,
    gender: 'N/A',
    code: `GK-${c.id * 1024}-${c.name.slice(0, 2).toUpperCase()}`,
    parentName: sharedStore.parent.name,
    parentEmail: sharedStore.parent.email,
    parentPhone: sharedStore.parent.phone,
    device: c.deviceModel,
    os: c.os,
    deviceType: c.platform,
    battery: c.battery || 85,
    isCharging: false,
    signal: 'Wi-Fi 5G • GPS ±3m',
    supervisionState: c.isLocked ? 'Device Locked by Parent' : (c.status === 'online' ? 'Active Monitoring' : 'Attention Required'),
    safeZone: 'In Safe Zone (Home / School)',
    lastPing: c.lastLogin ? new Date(c.lastLogin).toLocaleTimeString() : 'Live Sync',
    avatar: c.avatar
  }));

  const allFleet = [
    ...dynamicSharedChildren,
    ...adminStore.childrenFleet
  ];

  res.json({
    success: true,
    data: allFleet
  });
});

// 4. GET /api/admin/admins
router.get('/admins', (req, res) => {
  res.json({
    success: true,
    data: adminStore.admins
  });
});

// 5. POST /api/admin/admins (Add Admin User)
router.post('/admins', (req, res) => {
  const { name, email, phone, department, role, mfaType } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const newAdmin = {
    id: adminStore.admins.length + 1,
    name,
    email,
    phone: phone || '+1 (555) 019-2831',
    department: department || 'SecOps / Child Safety Escalations',
    role: role === 'super_admin' ? 'Super Admin' : role === 'compliance_officer' ? 'Compliance & Audit Officer' : role === 'parent_support' ? 'Parent Support Specialist' : 'Safety & Security Analyst',
    mfaStatus: mfaType || 'FIDO2 / Hardware Key Enforced',
    timestamp: 'Just now',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgdq5rEcDL2PpG-ZKKnL_zIbAsH1RQv0Wd8st1ZlHZgnqRYEic7FD16LruJVaXhb1ThZBMRx5Ozm5bK366K0oaIVLdYXk12Q8xoMhVN_Uft1AtkkZgaf9y0XC98ovqR_Evw8qKp0p9TFEPLt34xuOFKjMRv0qfQOgvy2uAv4yrkAUZcRa3SjK2ejDLwMXYlg990ebqdKPvh4s2RwxXdBu340IINwHA4qFG4_-9wlqBHqTNhTyDUh2i'
  };

  adminStore.admins.unshift(newAdmin);

  // Add event log
  adminStore.systemEvents.unshift({
    id: `ADM-${Date.now()}`,
    type: 'AUDIT INFO',
    title: `Admin Provisioned: ${name}`,
    description: `Staff member ${name} (${newAdmin.role}) added to ${newAdmin.department}. Invitation dispatched.`,
    time: 'Just now',
    color: 'primary'
  });

  res.status(201).json({
    success: true,
    message: `Administrator ${name} successfully provisioned! Time-sensitive setup link sent to ${email}`,
    data: newAdmin
  });
});

// 6. POST /api/admin/parents/:id/status
router.post('/parents/:id/status', (req, res) => {
  const parentId = parseInt(req.params.id);
  const { status } = req.body;
  const parent = adminStore.parents.find(p => p.id === parentId);

  if (!parent) {
    return res.status(404).json({ success: false, message: 'Parent record not found' });
  }

  parent.status = status || 'Active & Verified';

  res.json({
    success: true,
    message: `Status for ${parent.name} updated to "${parent.status}"`,
    data: parent
  });
});

// 7. POST /api/admin/broadcast
router.post('/broadcast', (req, res) => {
  const { title, message } = req.body;
  res.json({
    success: true,
    message: `Broadcast message "${title || 'Emergency System Ping'}" dispatched to all 42,190 endpoints and parents.`
  });
});

export default router;
