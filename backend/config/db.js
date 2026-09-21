import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourPasswordHere',
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  database: process.env.DB_DATABASE || 'SafeShieldDB',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT !== 'false',
    enableArithAbort: true,
    connectTimeout: 5000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;
let isConnected = false;

// Fallback in-memory store if MS SQL is offline
export const memoryStore = {
  user: {
    id: 1,
    name: 'Omar Ahmed',
    email: 'omar.ahmed@example.com',
    pin_code: '123456',
    role: 'child',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjj47UTVN4_aoK1nIlnVWckmMzQif0I5W7D2cBx3yDqZ-xAP1hK3jGc7vKYfDqtfDwRiZ7B172XGFp4ewNcat9jqyi6iXm9GBXrdQS3uAHpiSdbUrxAr9tRiFlTlGVWa0hNZBaiV5kas8GY6LonF-4CNx3-E-GYhyLxUmStyKE6EYHu4EVHDoPE05EDfEyaxRIcTdTMh_9kn-6nf6O3rvTSSr1ShF1pF_hy1HQ-iv4s4pD0q4D2shn-g'
  },
  guardian: {
    id: 1,
    name: 'Ahmed Al-Salem',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
    relationship: 'Family Organizer • Primary Guardian',
    is_verified: true,
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNBKAJbbe-hDQXQCSSsG9RdvmkGL0729KDTgBrYT_HblOzXfdhzWcLkqw3Q6nz9j7yn4hq3jaTjOj-vxwntF6dvlAt7zoLrvRq58w-UdVpnaaQ44IEAC-zKPB5eO-X2fljyS90IzSnG_2LYAYWdieZNKGLEtqo2SshoQgEje0rlVLkce2rJNjbCHaFzcro9RyV-l1cP_15M_dUNA77pXa_WCyu4ImkexjHs4KQlkOAmIMploNRKpXUA'
  },
  permissions: [
    { id: 1, code: 'live_screen', name: 'Live Screen', category: 'Real-time Display', description: 'Allows your parent to view your device screen when live monitoring is enabled.', icon: 'screenshot_monitor', is_allowed: false, status_text: 'Active • On Guardian Request' },
    { id: 2, code: 'contacts', name: 'Contacts', category: 'Address Book Sync', description: 'Allows authorized monitoring of contacts stored on this device.', icon: 'contacts', is_allowed: true, status_text: 'Active • Unknown caller warnings' },
    { id: 3, code: 'sms', name: 'SMS Messages', category: 'Message Safety', description: 'Allows authorized monitoring of SMS information from this device.', icon: 'sms', is_allowed: true, status_text: 'Active • Safety filter active' },
    { id: 4, code: 'installed_apps', name: 'Installed Apps', category: 'Application Inventory', description: 'Allows the system to display applications installed on this device.', icon: 'apps', is_allowed: true, status_text: 'Active • Verified store only' },
    { id: 5, code: 'app_usage', name: 'App Usage', category: 'Time & Patterns', description: 'Allows your parent to view application usage and screen-time information.', icon: 'insights', is_allowed: true, status_text: 'Active • Balanced time tracking' },
    { id: 6, code: 'device_info', name: 'Device Information', category: 'System Status', description: 'Allows the system to show device model, operating system and device status.', icon: 'smartphone', is_allowed: true, status_text: 'Active • OS & Security patches' },
    { id: 7, code: 'battery_status', name: 'Battery Status', category: 'Level & Health', description: 'Allows your parent to see the current battery percentage of this device.', icon: 'battery_charging_full', is_allowed: true, status_text: 'Active • Low battery alerts' },
    { id: 8, code: 'screen_time', name: 'Screen Time', category: 'Daily Limits & Insights', description: 'Allows the system to calculate and display daily mobile usage and screen time.', icon: 'schedule', is_allowed: false, status_text: 'Active • Limit: 5h / day' }
  ],
  appUsage: [
    { id: 1, app_name: 'WhatsApp', category: 'Social', icon: 'chat', usage_minutes: 102, daily_limit_minutes: 0, color: 'tertiary', status: 'Safe Pace' },
    { id: 2, app_name: 'TikTok', category: 'Media', icon: 'music_note', usage_minutes: 75, daily_limit_minutes: 90, color: 'secondary', status: 'Near Limit' },
    { id: 3, app_name: 'Snapchat', category: 'Social', icon: 'camera', usage_minutes: 48, daily_limit_minutes: 60, color: 'primary', status: '12m left' },
    { id: 4, app_name: 'Facebook', category: 'Media', icon: 'public', usage_minutes: 32, daily_limit_minutes: 0, color: 'primary-container', status: 'Safe Pace' },
    { id: 5, app_name: 'YouTube Kids', category: 'Learning', icon: 'smart_display', usage_minutes: 15, daily_limit_minutes: 0, color: 'error', status: 'Active' }
  ],
  deviceTelemetry: {
    device_name: "Omar's Galaxy S24",
    model: 'Samsung Galaxy S24 (SM-S921B)',
    os_version: 'Android 14 (One UI 6.1)',
    fingerprint: 'IMEI-****-9482',
    battery_percent: 85,
    battery_status: 'Good',
    network_name: 'Home-Fiber-5G',
    network_status: 'Signal Excellent',
    storage_used_gb: 54.20,
    storage_total_gb: 128.00,
    ram_used_gb: 3.80,
    ram_total_gb: 8.00,
    ip_address: '192.168.1.142',
    daemon_status: 'Foreground Mode (Unrestricted)',
    last_sync: new Date().toISOString()
  },
  timeRequests: []
};

export async function connectDB() {
  try {
    pool = await sql.connect(config);
    isConnected = true;
    console.log('✅ Connected to MS SQL Server (Database:', config.database + ')');
    return pool;
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ MS SQL Server connection note:', err.message);
    console.log('ℹ️ Running backend in active memory mode with MS SQL Schema fallback.');
    return null;
  }
}

export function getDBPool() {
  return pool;
}

export function isDBConnected() {
  return isConnected;
}

export { sql };
