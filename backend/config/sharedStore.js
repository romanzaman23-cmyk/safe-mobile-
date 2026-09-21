// Shared In-Memory & Database Store for Real-Time Synchronization across Parent, Child, and Super Admin

export const sharedStore = {
  // Parent & Family Account Info
  parent: {
    id: 'GKD-94022-FAM',
    name: 'David Miller',
    email: 'david.miller@familycloud.org',
    phone: '+1 (555) 349-2810',
    role: 'Primary Family Administrator',
    location: 'Maplewood, NJ',
    address: '42 Elmwood Terrace, Maplewood, NJ',
    memberSince: 'Jan 2023',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKiKXstfjeOZrHO1qTfezZSD638hLho5uuQRsg5zDCKeN2sSnW-ZbbSEXytpBDy7az2kvAgUY_L9OgVv4BVX7eDwx8Be2nyYqMOZ6iV-FbzgGxLr8a_lh_tgBlMZe_7UFRGOC_r6q4kJu_pT4f5p7Dknk9P4YuaCRNSZDwgLTUHM463AdtlPD4Is6QQuBf8L2_GyUSlSFNDRRVeTjAxEsuy9QIssE3jb8BCOYxpLd8vs89Oj35zL6w',
    securityScore: 98,
    is2FAEnforced: true,
    lastPasswordRotation: '3 weeks ago',
    activePlan: 'Family Shield Premium',
    emergencyContact: {
      name: 'Sarah Miller',
      relationship: 'Spouse / Secondary Guardian',
      phone: '+1 (555) 349-2811'
    }
  },

  guardians: [
    {
      id: 2,
      name: 'Sarah Miller',
      email: 'sarah.miller@familycloud.org',
      role: 'Secondary Admin',
      initials: 'SM',
      permissions: ['Live Screen View', 'App Approvals']
    }
  ],

  // Registered Child Accounts (Pre-configured for Roman & Leo)
  children: [
    {
      id: 1,
      name: 'Roman Zaman',
      age: 14,
      email: 'romanzaman23@gmail.com',
      pin_code: '123456',
      deviceModel: "Roman's Android (Active Companion)",
      platform: 'android',
      os: 'Android 14 (One UI 6.1)',
      status: 'online',
      isLocked: false,
      battery: 94,
      batteryStatus: 'Healthy (94%)',
      screenTimeUsed: '1h 25m',
      screenTimeLimit: '3h 00m',
      screenTimePercent: 47,
      allowanceLeft: '1h 35m allowance left',
      activeApp: 'WhatsApp Messenger',
      appCategory: 'Communication',
      appTime: '45m',
      shieldStatus: 'Live Monitoring Active',
      alertsToday: 0,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      lastSync: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Leo Miller',
      age: 11,
      email: 'leo@familycloud.org',
      pin_code: '123456',
      deviceModel: "Leo's iPhone 15 Pro",
      platform: 'ios',
      os: 'Apple iOS 17.4',
      status: 'online',
      isLocked: false,
      battery: 88,
      batteryStatus: 'Normal (88%)',
      screenTimeUsed: '48m',
      screenTimeLimit: '2h 30m',
      screenTimePercent: 32,
      allowanceLeft: '1h 42m allowance left',
      activeApp: 'Duolingo French Learning',
      appCategory: 'Educational',
      appTime: '30m',
      shieldStatus: 'Protection Active',
      alertsToday: 0,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      lastSync: new Date().toISOString()
    }
  ],

  // Live real-time events feed
  liveEvents: [
    {
      id: 1,
      icon: 'sync',
      color: 'tertiary',
      title: 'Real-Time Sync Connected',
      time: 'Just now',
      device: "Roman's Android (Active Companion)",
      tag: 'Live Stream',
      note: 'Telemetry, battery vitals, and screen time synced in real time.'
    },
    {
      id: 2,
      icon: 'verified_user',
      color: 'primary',
      title: 'Safety Shield Active',
      time: '5m ago',
      device: 'Fleet Wide',
      tag: 'Guardrails OK',
      note: 'Web filtering, SMS inspection, and location safety active.'
    }
  ],

  allPaused: false,
  activeLoggedInChildId: 1
};

// Helper methods
export function findChildByEmailAndPin(email, pin) {
  if (!email || !pin) return null;
  const cleanEmail = email.toLowerCase().trim();
  const cleanPin = pin.toString().trim();

  return sharedStore.children.find(
    (c) => c.email.toLowerCase().trim() === cleanEmail && c.pin_code.toString().trim() === cleanPin
  ) || null;
}

export function findChildById(id) {
  return sharedStore.children.find((c) => c.id === parseInt(id)) || null;
}

export function registerChild(childData) {
  const { name, age, email, password, pin, deviceNickname, platform } = childData;

  const cleanEmail = email.toLowerCase().trim();
  const existingChild = sharedStore.children.find((c) => c.email.toLowerCase().trim() === cleanEmail);
  if (existingChild) {
    throw new Error(`Child with email "${cleanEmail}" already exists. Please choose a unique email.`);
  }

  const assignedPin = (password || pin || '123456').toString().trim();

  const newChild = {
    id: sharedStore.children.length > 0 ? Math.max(...sharedStore.children.map(c => c.id)) + 1 : 1,
    name: name.trim(),
    age: parseInt(age) || 10,
    email: cleanEmail,
    pin_code: assignedPin,
    deviceModel: deviceNickname || `${name.trim()}'s Device`,
    platform: platform === 'android' ? 'android' : 'ios',
    os: platform === 'android' ? 'Android 14 (One UI 6.1)' : 'Apple iOS 17.4',
    status: 'online',
    isLocked: false,
    battery: 100,
    batteryStatus: 'Healthy',
    screenTimeUsed: '0m',
    screenTimeLimit: '2h 30m',
    screenTimePercent: 0,
    allowanceLeft: '2h 30m allowance left',
    activeApp: 'SafeShield Companion Initialized',
    appCategory: 'System',
    appTime: '0m',
    shieldStatus: 'Protection Active',
    alertsToday: 0,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVkF5KNU6QvzBmGaIlNppvSMvpeWYpDf69rkcfJp_E8TdJTKHgYdrtVcqk3rb-KNXscVTbRt6LveBICubGbeAIGQElq9JTlVqAmre_H7vwaEA9wpqK5xxJRHqpeFlcWgsaeBud7tohMNmpwVUaWQt_4oKWR9fn84APbe0CjqOh1N0aMF1gIup_BPewKdtci3P3_lWvNnqMM7NiB9wyfhgA4wPLDSXpjWKZ0m8uagM9mjW1z0yf2TiT',
    createdAt: new Date().toISOString()
  };

  sharedStore.children.push(newChild);

  // Add event to live real-time feed
  sharedStore.liveEvents.unshift({
    id: Date.now(),
    icon: 'person_add',
    color: 'primary',
    title: `Child Added: ${newChild.name}`,
    time: 'Just now',
    device: newChild.deviceModel,
    tag: 'Credentials Provisioned',
    note: `Parent authorized email ${newChild.email}. Child can now login to Companion App.`
  });

  return newChild;
}

export function toggleChildLockState(childId) {
  const child = findChildById(childId);
  if (!child) return null;

  child.isLocked = !child.isLocked;
  child.status = child.isLocked ? 'attention' : 'online';
  child.shieldStatus = child.isLocked ? 'Manual Device Lock Enforced' : 'Protection Active';

  sharedStore.liveEvents.unshift({
    id: Date.now(),
    icon: child.isLocked ? 'lock' : 'lock_open',
    color: child.isLocked ? 'error' : 'tertiary',
    title: `${child.name}'s Device ${child.isLocked ? 'Locked' : 'Unlocked'} by Parent`,
    time: 'Just now',
    device: child.deviceModel,
    tag: child.isLocked ? 'Lock Enforced' : 'Device Active',
    note: child.isLocked ? 'Instant screen shield locked on target device.' : 'Screen time allowance resumed.'
  });

  return child;
}

export function pauseAllChildren() {
  sharedStore.allPaused = !sharedStore.allPaused;
  sharedStore.children.forEach((c) => {
    c.isLocked = sharedStore.allPaused;
    c.status = sharedStore.allPaused ? 'attention' : 'online';
  });

  sharedStore.liveEvents.unshift({
    id: Date.now(),
    icon: sharedStore.allPaused ? 'pause_circle' : 'play_circle',
    color: sharedStore.allPaused ? 'error' : 'tertiary',
    title: sharedStore.allPaused ? 'All Family Devices Paused' : 'All Family Devices Resumed',
    time: 'Just now',
    device: 'Fleet Wide',
    tag: sharedStore.allPaused ? 'Global Pause' : 'Global Resume',
    note: sharedStore.allPaused ? 'Parent issued 1-tap emergency freeze.' : 'Normal allowances restored.'
  });

  return sharedStore.allPaused;
}
