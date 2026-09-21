-- ==========================================================
-- SafeShield Database Schema for MS SQL Server (MSSQL)
-- ==========================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SafeShieldDB')
BEGIN
    CREATE DATABASE SafeShieldDB;
END
GO

USE SafeShieldDB;
GO

-- 1. Users Table (Child Profiles)
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) NOT NULL UNIQUE,
        pin_code NVARCHAR(50) NOT NULL,
        role NVARCHAR(50) DEFAULT 'child',
        avatar_url NVARCHAR(500),
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- 2. Guardians Table (Parents)
IF OBJECT_ID('dbo.Guardians', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Guardians (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) NOT NULL,
        phone NVARCHAR(50),
        relationship NVARCHAR(50) DEFAULT 'Father',
        is_verified BIT DEFAULT 1,
        avatar_url NVARCHAR(500),
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- 3. Permissions Table
IF OBJECT_ID('dbo.Permissions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Permissions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        code NVARCHAR(50) NOT NULL UNIQUE,
        name NVARCHAR(100) NOT NULL,
        category NVARCHAR(100) NOT NULL,
        description NVARCHAR(500) NOT NULL,
        icon NVARCHAR(50) NOT NULL,
        is_allowed BIT DEFAULT 0,
        status_text NVARCHAR(100)
    );
END
GO

-- 4. AppUsage Table
IF OBJECT_ID('dbo.AppUsage', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AppUsage (
        id INT IDENTITY(1,1) PRIMARY KEY,
        app_name NVARCHAR(100) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        icon NVARCHAR(50) NOT NULL,
        usage_minutes INT DEFAULT 0,
        daily_limit_minutes INT DEFAULT 0,
        color NVARCHAR(50) DEFAULT 'primary',
        status NVARCHAR(50) DEFAULT 'Normal'
    );
END
GO

-- 5. DeviceTelemetry Table
IF OBJECT_ID('dbo.DeviceTelemetry', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.DeviceTelemetry (
        id INT IDENTITY(1,1) PRIMARY KEY,
        device_name NVARCHAR(100) NOT NULL,
        model NVARCHAR(100) NOT NULL,
        os_version NVARCHAR(100) NOT NULL,
        fingerprint NVARCHAR(100) NOT NULL,
        battery_percent INT DEFAULT 85,
        battery_status NVARCHAR(50) DEFAULT 'Good',
        network_name NVARCHAR(100) DEFAULT 'Home-Fiber-5G',
        network_status NVARCHAR(50) DEFAULT 'Excellent',
        storage_used_gb DECIMAL(6,2) DEFAULT 54.20,
        storage_total_gb DECIMAL(6,2) DEFAULT 128.00,
        ram_used_gb DECIMAL(6,2) DEFAULT 3.80,
        ram_total_gb DECIMAL(6,2) DEFAULT 8.00,
        ip_address NVARCHAR(50) DEFAULT '192.168.1.142',
        daemon_status NVARCHAR(50) DEFAULT 'Foreground Mode (Unrestricted)',
        last_sync DATETIME DEFAULT GETDATE()
    );
END
GO

-- 6. TimeRequests Table
IF OBJECT_ID('dbo.TimeRequests', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TimeRequests (
        id INT IDENTITY(1,1) PRIMARY KEY,
        child_id INT DEFAULT 1,
        requested_minutes INT NOT NULL,
        status NVARCHAR(50) DEFAULT 'Pending',
        message NVARCHAR(255),
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- Seed Initial Data
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE email = 'omar.ahmed@example.com')
BEGIN
    INSERT INTO dbo.Users (name, email, pin_code, role, avatar_url)
    VALUES ('Omar Ahmed', 'omar.ahmed@example.com', '123456', 'child', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjj47UTVN4_aoK1nIlnVWckmMzQif0I5W7D2cBx3yDqZ-xAP1hK3jGc7vKYfDqtfDwRiZ7B172XGFp4ewNcat9jqyi6iXm9GBXrdQS3uAHpiSdbUrxAr9tRiFlTlGVWa0hNZBaiV5kas8GY6LonF-4CNx3-E-GYhyLxUmStyKE6EYHu4EVHDoPE05EDfEyaxRIcTdTMh_9kn-6nf6O3rvTSSr1ShF1pF_hy1HQ-iv4s4pD0q4D2shn-g');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Guardians WHERE email = 'ahmed@example.com')
BEGIN
    INSERT INTO dbo.Guardians (name, email, phone, relationship, is_verified, avatar_url)
    VALUES ('Ahmed Al-Salem', 'ahmed@example.com', '+966 50 123 4567', 'Family Organizer • Primary Guardian', 1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNBKAJbbe-hDQXQCSSsG9RdvmkGL0729KDTgBrYT_HblOzXfdhzWcLkqw3Q6nz9j7yn4hq3jaTjOj-vxwntF6dvlAt7zoLrvRq58w-UdVpnaaQ44IEAC-zKPB5eO-X2fljyS90IzSnG_2LYAYWdieZNKGLEtqo2SshoQgEje0rlVLkce2rJNjbCHaFzcro9RyV-l1cP_15M_dUNA77pXa_WCyu4ImkexjHs4KQlkOAmIMploNRKpXUA');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Permissions)
BEGIN
    INSERT INTO dbo.Permissions (code, name, category, description, icon, is_allowed, status_text)
    VALUES 
    ('live_screen', 'Live Screen', 'Real-time Display', 'Allows your parent to view your device screen when live monitoring is enabled.', 'screenshot_monitor', 0, 'Active • On Guardian Request'),
    ('contacts', 'Contacts', 'Address Book Sync', 'Allows authorized monitoring of contacts stored on this device.', 'contacts', 1, 'Active • Unknown caller warnings'),
    ('sms', 'SMS Messages', 'Message Safety', 'Allows authorized monitoring of SMS information from this device.', 'sms', 1, 'Active • Safety filter active'),
    ('installed_apps', 'Installed Apps', 'Application Inventory', 'Allows the system to display applications installed on this device.', 'apps', 1, 'Active • Verified store only'),
    ('app_usage', 'App Usage', 'Time & Patterns', 'Allows your parent to view application usage and screen-time information.', 'insights', 1, 'Active • Balanced time tracking'),
    ('device_info', 'Device Information', 'System Status', 'Allows the system to show device model, operating system and device status.', 'perm_device_information', 1, 'Active • OS & Security patches'),
    ('battery_status', 'Battery Status', 'Level & Health', 'Allows your parent to see the current battery percentage of this device.', 'battery_saver', 1, 'Active • Low battery alerts'),
    ('screen_time', 'Screen Time', 'Daily Limits & Insights', 'Allows the system to calculate and display daily mobile usage and screen time.', 'schedule', 0, 'Active • Limit: 5h / day');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.AppUsage)
BEGIN
    INSERT INTO dbo.AppUsage (app_name, category, icon, usage_minutes, daily_limit_minutes, color, status)
    VALUES 
    ('WhatsApp', 'Social', 'chat', 102, 0, 'tertiary', 'Safe Pace'),
    ('TikTok', 'Media', 'music_note', 75, 90, 'secondary', 'Near Limit'),
    ('Snapchat', 'Social', 'camera', 48, 60, 'primary', '12m left'),
    ('Facebook', 'Media', 'public', 32, 0, 'primary-container', 'Safe Pace'),
    ('YouTube Kids', 'Learning', 'smart_display', 15, 0, 'error', 'Active');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.DeviceTelemetry)
BEGIN
    INSERT INTO dbo.DeviceTelemetry (device_name, model, os_version, fingerprint, battery_percent, battery_status, network_name, network_status, storage_used_gb, storage_total_gb, ram_used_gb, ram_total_gb, ip_address, daemon_status, last_sync)
    VALUES ('Omar''s Galaxy S24', 'Samsung Galaxy S24 (SM-S921B)', 'Android 14 (One UI 6.1)', 'IMEI-****-9482', 85, 'Good', 'Home-Fiber-5G', 'Signal Excellent', 54.20, 128.00, 3.80, 8.00, '192.168.1.142', 'Foreground Mode (Unrestricted)', GETDATE());
END
GO
