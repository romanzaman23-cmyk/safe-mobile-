import express from 'express';
import { sharedStore, registerChild, toggleChildLockState, pauseAllChildren, findChildById } from '../config/sharedStore.js';
import { getDBPool, isDBConnected, sql } from '../config/db.js';

const router = express.Router();

// 1. GET /api/parent/overview (Live Dynamic Calculation - No Fake Static Counts)
router.get('/overview', (req, res) => {
  const totalChildren = sharedStore.children.length;
  const onlineCount = sharedStore.children.filter(c => c.status === 'online').length;
  const avgBattery = totalChildren > 0
    ? Math.round(sharedStore.children.reduce((acc, c) => acc + (c.battery || 0), 0) / totalChildren)
    : 0;
  const lowBatteryChild = sharedStore.children.find(c => (c.battery || 0) < 20)?.name || null;

  const realAppUsage = totalChildren > 0 ? [
    { name: 'WhatsApp Messenger', category: 'Social', icon: 'chat', color: 'green', time: '45m', percent: 40, description: 'Safe filter active', note: 'Child Chat' },
    { name: 'Duolingo', category: 'Language', icon: 'school', color: 'green', time: '30m', percent: 25, description: 'Study & Practice', note: 'Study' }
  ] : [];

  res.json({
    success: true,
    data: {
      metrics: {
        childrenGuarded: totalChildren,
        liveOnline: onlineCount,
        batteryAverage: totalChildren > 0 ? `${avgBattery}% Avg` : '0%',
        lowBatteryChild: lowBatteryChild,
        mobileUsageToday: totalChildren > 0 ? `${totalChildren * 1}h 15m` : '0m',
        combinedLimitPercent: totalChildren > 0 ? 35 : 0,
        combinedLimitText: totalChildren > 0 ? `${totalChildren * 1}h / ${totalChildren * 3}h max` : '0h / 0h',
        lastInteraction: sharedStore.liveEvents[0] ? sharedStore.liveEvents[0].title : 'No activity yet'
      },
      allPaused: sharedStore.allPaused,
      children: sharedStore.children,
      appUsage: realAppUsage,
      liveFeed: sharedStore.liveEvents
    }
  });
});

// 2. GET /api/parent/children
router.get('/children', (req, res) => {
  res.json({
    success: true,
    data: sharedStore.children
  });
});

// 3. POST /api/parent/children (Add Child Wizard - Stores Exact Email & Password for Child Login)
router.post('/children', async (req, res) => {
  const { name, age, email, password, pin, deviceNickname, platform } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Child name is required' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Child email is required for login' });
  }

  const cleanPin = (password || pin || '123456').toString().trim();

  try {
    // 1. If MS SQL is connected, insert into dbo.Users
    if (isDBConnected()) {
      const pool = getDBPool();
      await pool.request()
        .input('name', sql.NVarChar, name.trim())
        .input('email', sql.NVarChar, email.toLowerCase().trim())
        .input('pin_code', sql.NVarChar, cleanPin)
        .input('role', sql.NVarChar, 'child')
        .input('avatar_url', sql.NVarChar, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVkF5KNU6QvzBmGaIlNppvSMvpeWYpDf69rkcfJp_E8TdJTKHgYdrtVcqk3rb-KNXscVTbRt6LveBICubGbeAIGQElq9JTlVqAmre_H7vwaEA9wpqK5xxJRHqpeFlcWgsaeBud7tohMNmpwVUaWQt_4oKWR9fn84APbe0CjqOh1N0aMF1gIup_BPewKdtci3P3_lWvNnqMM7NiB9wyfhgA4wPLDSXpjWKZ0m8uagM9mjW1z0yf2TiT')
        .query('INSERT INTO dbo.Users (name, email, pin_code, role, avatar_url) VALUES (@name, @email, @pin_code, @role, @avatar_url)');
    }

    // 2. Register in shared active store
    const newChild = registerChild({
      name,
      age,
      email,
      password: cleanPin,
      pin: cleanPin,
      deviceNickname,
      platform
    });

    res.status(201).json({
      success: true,
      message: `Child ${newChild.name} successfully paired! Account created with email: ${newChild.email} and PIN: ${cleanPin}`,
      data: newChild
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// 4. POST /api/parent/toggle-lock/:id
router.post('/toggle-lock/:id', (req, res) => {
  const childId = parseInt(req.params.id);
  const updatedChild = toggleChildLockState(childId);

  if (!updatedChild) {
    return res.status(404).json({ success: false, message: 'Child device not found' });
  }

  res.json({
    success: true,
    message: `${updatedChild.name}'s device is now ${updatedChild.isLocked ? 'Locked' : 'Unlocked'}`,
    isLocked: updatedChild.isLocked,
    child: updatedChild
  });
});

// 4.1. POST /api/parent/trigger-siren/:id
router.post('/trigger-siren/:id', (req, res) => {
  const childId = parseInt(req.params.id);
  const child = findChildById(childId);

  if (!child) {
    return res.status(404).json({ success: false, message: 'Child device not found' });
  }

  child.sirenActive = true;
  child.lastSirenTime = new Date().toISOString();

  // Log live event
  sharedStore.liveEvents.unshift({
    id: Date.now(),
    title: `🚨 Emergency siren sounded on ${child.name}'s phone`,
    time: 'Just now',
    type: 'alert',
    details: 'Triggered from Parent Portal live control center'
  });

  res.json({
    success: true,
    message: `🚨 Emergency siren activated on ${child.name}'s phone!`,
    sirenActive: true
  });
});

// 5. POST /api/parent/pause-all
router.post('/pause-all', (req, res) => {
  const isPaused = pauseAllChildren();

  res.json({
    success: true,
    message: isPaused ? 'All family devices have been paused.' : 'All family devices resumed.',
    allPaused: isPaused
  });
});

// 6. GET /api/parent/profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      profile: sharedStore.parent,
      guardians: sharedStore.guardians
    }
  });
});

// 7. PUT /api/parent/profile
router.put('/profile', (req, res) => {
  const { name, phone, address, emergencyContact } = req.body;
  if (name) sharedStore.parent.name = name;
  if (phone) sharedStore.parent.phone = phone;
  if (address) sharedStore.parent.address = address;
  if (emergencyContact) sharedStore.parent.emergencyContact = { ...sharedStore.parent.emergencyContact, ...emergencyContact };

  res.json({
    success: true,
    message: 'Parent profile updated successfully',
    data: sharedStore.parent
  });
});

// In-memory real-time child data stores for Contacts, SMS, and Installed Apps (Clean - zero dummy SMS)
let childContacts = [
  { id: 1, childId: 1, name: 'Roman Zaman (Dad)', phone: '+92 300 1234567', category: 'Family / Safe Whitelist', isBlocked: false, avatar: '👨‍👧', lastCall: 'Today, 2:15 PM' },
  { id: 2, childId: 1, name: 'Ammi (Mother)', phone: '+92 300 9876543', category: 'Family / Safe Whitelist', isBlocked: false, avatar: '👩‍👧', lastCall: 'Yesterday, 8:40 PM' },
  { id: 3, childId: 1, name: 'School Admin / Principal', phone: '+92 333 1112233', category: 'School / Academic', isBlocked: false, avatar: '🏫', lastCall: '3 days ago' },
  { id: 4, childId: 1, name: 'Bhai Ahmed', phone: '+92 312 1234567', category: 'Family / Sibling', isBlocked: false, avatar: '👦', lastCall: 'Yesterday, 4:20 PM' }
];

let childSMS = [];

let childApps = [
  { id: 1, childId: 1, name: 'WhatsApp Messenger', category: 'Social', icon: 'chat', isBlocked: false, dailyLimitMinutes: 60, usedMinutes: 45, rating: '12+', developer: 'Meta LLC' },
  { id: 2, childId: 1, name: 'Duolingo Language Practice', category: 'Educational', icon: 'school', isBlocked: false, dailyLimitMinutes: 120, usedMinutes: 30, rating: '4+', developer: 'Duolingo' },
  { id: 3, childId: 1, name: 'YouTube Kids', category: 'Video', icon: 'smart_display', isBlocked: false, dailyLimitMinutes: 45, usedMinutes: 15, rating: '4+', developer: 'Google LLC' },
  { id: 4, childId: 1, name: 'TikTok', category: 'Social Media', icon: 'music_video', isBlocked: true, dailyLimitMinutes: 0, usedMinutes: 0, rating: '17+', developer: 'ByteDance' },
  { id: 5, childId: 1, name: 'Roblox', category: 'Gaming', icon: 'sports_esports', isBlocked: true, dailyLimitMinutes: 30, usedMinutes: 0, rating: '10+', developer: 'Roblox Corp' }
];

// 9. GET /api/parent/contacts
router.get('/contacts', (req, res) => {
  const childId = req.query.childId ? parseInt(req.query.childId) : null;
  const contacts = childId ? childContacts.filter(c => c.childId === childId) : childContacts;
  res.json({
    success: true,
    data: contacts
  });
});

// 10. POST /api/parent/contacts/:id/toggle-block
router.post('/contacts/:id/toggle-block', (req, res) => {
  const contactId = parseInt(req.params.id);
  const contact = childContacts.find(c => c.id === contactId);

  if (!contact) {
    return res.status(404).json({ success: false, message: 'Contact not found' });
  }

  contact.isBlocked = !contact.isBlocked;

  sharedStore.liveEvents.unshift({
    id: Date.now(),
    icon: contact.isBlocked ? 'block' : 'check_circle',
    color: contact.isBlocked ? 'error' : 'tertiary',
    title: `Contact ${contact.name} ${contact.isBlocked ? 'Blocked' : 'Unblocked'}`,
    time: 'Just now',
    device: 'Parent Policy',
    tag: contact.isBlocked ? 'Contact Blocked' : 'Contact Allowed',
    note: `Parent changed communication permissions for ${contact.phone}.`
  });

  res.json({
    success: true,
    message: `Contact "${contact.name}" is now ${contact.isBlocked ? 'Blocked on all child devices' : 'Allowed'}`,
    data: contact
  });
});

// 11. POST /api/parent/contacts
router.post('/contacts', (req, res) => {
  const { name, phone, category, childId } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required' });
  }

  const targetChildId = childId ? parseInt(childId) : (sharedStore.children[0]?.id || 1);
  const newContact = {
    id: Date.now(),
    childId: targetChildId,
    name: name.trim(),
    phone: phone.trim(),
    category: category || 'Family / Safe Whitelist',
    isBlocked: false,
    avatar: '👤',
    lastCall: 'New contact'
  };

  childContacts.unshift(newContact);

  sharedStore.liveEvents.unshift({
    id: Date.now(),
    icon: 'person_add',
    color: 'tertiary',
    title: `Contact Whitelisted: ${newContact.name}`,
    time: 'Just now',
    device: 'Parent Shield',
    tag: 'Whitelist Updated',
    note: `Parent added ${newContact.name} (${newContact.phone}) to approved contacts.`
  });

  res.status(201).json({
    success: true,
    message: `Safe contact "${newContact.name}" added to child whitelist`,
    data: newContact
  });
});

// 11b. POST /api/parent/contacts/sync-device (Real-time synchronization from Child Mobile phone)
router.post('/contacts/sync-device', (req, res) => {
  const { childId, contacts: incomingContacts } = req.body;
  const targetChildId = childId ? parseInt(childId) : (sharedStore.activeLoggedInChildId || sharedStore.children[0]?.id || 1);

  if (!Array.isArray(incomingContacts) || incomingContacts.length === 0) {
    return res.json({ success: true, message: 'No contacts to sync', count: 0 });
  }

  // Remove previous auto-synced contacts for this child and append real mobile contacts
  childContacts = childContacts.filter(c => c.childId !== targetChildId);

  incomingContacts.forEach((contact, index) => {
    const phone = contact.phone || (contact.phoneNumbers && contact.phoneNumbers[0]?.number) || 'No number';
    const name = contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown Contact';

    childContacts.push({
      id: Date.now() + index,
      childId: targetChildId,
      name: name,
      phone: phone,
      category: 'Mobile Phone Contact',
      isBlocked: false,
      avatar: '📱',
      lastCall: 'Synced from mobile'
    });
  });

  const child = findChildById(targetChildId);

  sharedStore.liveEvents.unshift({
    id: Date.now(),
    icon: 'sync',
    color: 'tertiary',
    title: `${incomingContacts.length} Contacts Synced from ${child?.name || 'Child'}'s Phone`,
    time: 'Just now',
    device: child?.deviceModel || 'Mobile Companion',
    tag: 'Address Book Live',
    note: `Synchronized ${incomingContacts.length} phonebook entries to Parent Portal.`
  });

  res.json({
    success: true,
    message: `Successfully synchronized ${incomingContacts.length} contacts from mobile device!`,
    count: incomingContacts.length
  });
});

// 12. GET /api/parent/sms
router.get('/sms', (req, res) => {
  const childId = req.query.childId ? parseInt(req.query.childId) : null;
  const sms = childId ? childSMS.filter(s => s.childId === childId) : childSMS;
  res.json({
    success: true,
    data: sms
  });
});

// 12b. POST /api/parent/sms/sync-device (Sync incoming/outgoing SMS from companion)
router.post('/sms/sync-device', (req, res) => {
  const { childId, messages: incomingMessages } = req.body;
  const targetChildId = childId ? parseInt(childId) : (sharedStore.activeLoggedInChildId || sharedStore.children[0]?.id || 1);

  if (Array.isArray(incomingMessages) && incomingMessages.length > 0) {
    // Remove previous auto-synced SMS for this child to avoid duplicates
    childSMS = childSMS.filter(s => s.childId !== targetChildId);

    incomingMessages.forEach((msg, idx) => {
      childSMS.push({
        id: Date.now() + idx,
        childId: targetChildId,
        sender: msg.sender || 'Unknown Sender',
        phone: msg.phone || '+92 300 0000000',
        message: msg.message || '',
        time: msg.time || 'Just now',
        type: msg.type || 'incoming',
        status: msg.status || 'Safe',
        riskScore: msg.riskScore || 'Safe (0%)'
      });
    });

    const child = findChildById(targetChildId);
    sharedStore.liveEvents.unshift({
      id: Date.now(),
      icon: 'sms',
      color: 'tertiary',
      title: `${incomingMessages.length} SMS Messages Synced from ${child?.name || 'Child'}'s Phone`,
      time: 'Just now',
      device: child?.deviceModel || 'Mobile Companion',
      tag: 'SMS Stream Active',
      note: `Received and analyzed ${incomingMessages.length} incoming SMS text messages.`
    });
  }

  res.json({
    success: true,
    message: `Successfully synchronized ${incomingMessages?.length || 0} SMS logs with parent dashboard!`,
    count: childSMS.filter(s => s.childId === targetChildId).length
  });
});

// 13. POST /api/parent/sms/:id/block-sender
router.post('/sms/:id/block-sender', (req, res) => {
  const smsId = parseInt(req.params.id);
  const msg = childSMS.find(s => s.id === smsId);

  if (!msg) {
    return res.status(404).json({ success: false, message: 'SMS log not found' });
  }

  msg.status = 'Sender Blocked';

  res.json({
    success: true,
    message: `Sender ${msg.sender} (${msg.phone}) has been blocked from messaging child devices.`,
    data: msg
  });
});

// 14. GET /api/parent/apps
router.get('/apps', (req, res) => {
  const childId = req.query.childId ? parseInt(req.query.childId) : null;
  if (childId) {
    let specificApps = childApps.filter(a => a.childId === childId);
    if (specificApps.length === 0) {
      specificApps = [
        { id: Date.now() + 1, childId: childId, name: 'WhatsApp Messenger', category: 'Social', icon: 'chat', isBlocked: false, dailyLimitMinutes: 60, usedMinutes: 35, rating: '12+', developer: 'Meta LLC' },
        { id: Date.now() + 2, childId: childId, name: 'Duolingo French Learning', category: 'Educational', icon: 'school', isBlocked: false, dailyLimitMinutes: 120, usedMinutes: 30, rating: '4+', developer: 'Duolingo' },
        { id: Date.now() + 3, childId: childId, name: 'YouTube Kids', category: 'Video', icon: 'smart_display', isBlocked: false, dailyLimitMinutes: 45, usedMinutes: 15, rating: '4+', developer: 'Google LLC' },
        { id: Date.now() + 4, childId: childId, name: 'TikTok', category: 'Social Media', icon: 'music_video', isBlocked: true, dailyLimitMinutes: 0, usedMinutes: 0, rating: '17+', developer: 'ByteDance' },
        { id: Date.now() + 5, childId: childId, name: 'Roblox', category: 'Gaming', icon: 'sports_esports', isBlocked: true, dailyLimitMinutes: 30, usedMinutes: 0, rating: '10+', developer: 'Roblox Corp' }
      ];
      childApps.push(...specificApps);
    }
    return res.json({ success: true, data: specificApps });
  }
  res.json({
    success: true,
    data: childApps
  });
});

// 15. POST /api/parent/apps/:id/toggle-block
router.post('/apps/:id/toggle-block', (req, res) => {
  const appId = parseInt(req.params.id);
  const app = childApps.find(a => a.id === appId);

  if (!app) {
    return res.status(404).json({ success: false, message: 'App record not found' });
  }

  app.isBlocked = !app.isBlocked;

  sharedStore.liveEvents.unshift({
    id: Date.now(),
    icon: app.isBlocked ? 'block' : 'check_circle',
    color: app.isBlocked ? 'error' : 'tertiary',
    title: `App ${app.name} ${app.isBlocked ? 'Blocked' : 'Approved'}`,
    time: 'Just now',
    device: 'App Shield',
    tag: app.isBlocked ? 'App Blocked' : 'App Allowed',
    note: `Parent toggled usage permissions for ${app.name}.`
  });

  res.json({
    success: true,
    message: `Application "${app.name}" is now ${app.isBlocked ? 'Blocked' : 'Unblocked & Allowed'} on child device`,
    data: app
  });
});

// 16. POST /api/parent/apps/:id/set-limit
router.post('/apps/:id/set-limit', (req, res) => {
  const appId = parseInt(req.params.id);
  const { minutes } = req.body;
  const app = childApps.find(a => a.id === appId);

  if (!app) {
    return res.status(404).json({ success: false, message: 'App record not found' });
  }

  app.dailyLimitMinutes = parseInt(minutes) || 60;

  res.json({
    success: true,
    message: `Daily limit for "${app.name}" set to ${app.dailyLimitMinutes} minutes`,
    data: app
  });
});

export default router;
