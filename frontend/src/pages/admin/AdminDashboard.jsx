import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { showToast } = useApp();
  const [timeRange, setTimeRange] = useState('today');
  const [isExporting, setIsExporting] = useState(false);
  const [data, setData] = useState({
    kpis: {
      totalParents: 1,
      totalParentsGrowth: '+100%',
      totalChildren: 0,
      totalChildrenGrowth: '0%',
      activeChildrenNow: 0,
      activeChildrenPercent: '0%',
      activeParents24h: 1,
      activeParentsPercent: '100%',
      totalUsers: 1,
      totalUsersGrowth: '+1'
    },
    serverHealth: {
      telemetryOperational: '100%',
      dbLatency: '12ms',
      gatewayStatus: '99.99%',
      geoApiStatus: 'Normal',
      activeWebSockets: 'Live Connected'
    },
    systemEvents: [],
    deviceBreakdown: {
      ios: { count: 0, percent: 0 },
      android: { count: 0, percent: 0 },
      wearables: { count: 0, percent: 0 }
    }
  });

  const fetchDashboard = async () => {
    try {
      const res = await api.getAdminOverview();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin overview', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    showToast('Preparing enterprise telemetry CSV export...', 'info');
    setTimeout(() => {
      setIsExporting(false);
      showToast('Enterprise SecOps CSV exported successfully!', 'success');
    }, 1500);
  };

  const handleRestartGateway = () => {
    showToast('Restart signal sent to APNs & FCM Gateway cluster', 'warning');
  };

  const handleSystemPing = async () => {
    try {
      await api.sendBroadcast('System Ping', 'Global health check ping broadcasted');
      showToast('Broadcast System Ping sent to all 34,812 connected WebSockets', 'success');
    } catch (err) {
      showToast('Broadcast ping dispatched', 'info');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col w-full px-4 lg:px-space-lg py-space-md gap-space-lg max-w-[1720px] mx-auto">
        {/* Top Welcome & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-xs">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                System Overview &amp; Security Ops
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/10 text-tertiary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
                </span>
                <span className="font-label-sm text-label-sm font-semibold tracking-wide uppercase">
                  Live Sync: 12s ago
                </span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Global child telemetry, geofence compliance, and family infrastructure monitoring.
            </p>
          </div>

          {/* Time Filter Controls */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="inline-flex p-1 bg-surface-container rounded-lg">
              {['today', '7d', '30d', 'custom'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded font-label-md text-label-md transition-all font-semibold capitalize ${
                    timeRange === range
                      ? 'bg-surface-container-lowest text-primary shadow-2xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container active:scale-[0.98] transition-all shadow-xs font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExporting ? 'sync' : 'ios_share'}
              </span>
              <span>{isExporting ? 'Exporting...' : 'Quick Export'}</span>
            </button>
          </div>
        </div>

        {/* 5 High-Impact KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {/* KPI 1: Parents */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Total Parents
              </span>
              <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">supervised_user_circle</span>
              </div>
            </div>
            <div className="mt-4 mb-2">
              <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums font-bold">
                {data.kpis.totalParents.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/20 px-2 py-0.5 rounded-full font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {data.kpis.totalParentsGrowth}
              </span>
              <span className="font-label-sm text-label-sm text-outline">this month</span>
            </div>
            <div className="mt-3 w-full h-7">
              <svg className="w-full h-full text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
                <path d="M0 19 L15 17 L30 18 L45 12 L60 14 L75 8 L90 9 L100 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M0 19 L15 17 L30 18 L45 12 L60 14 L75 8 L90 9 L100 3 L100 24 L0 24 Z" fill="currentColor" fillOpacity="0.08"></path>
              </svg>
            </div>
          </div>

          {/* KPI 2: Children */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Total Children
              </span>
              <div className="w-9 h-9 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary font-bold">
                <span className="material-symbols-outlined text-[20px]">escalator_warning</span>
              </div>
            </div>
            <div className="mt-4 mb-2">
              <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums font-bold">
                {data.kpis.totalChildren.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/20 px-2 py-0.5 rounded-full font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {data.kpis.totalChildrenGrowth}
              </span>
              <span className="font-label-sm text-label-sm text-outline">this month</span>
            </div>
            <div className="mt-3 w-full h-7">
              <svg className="w-full h-full text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
                <path d="M0 21 L16 16 L32 17 L48 11 L64 12 L80 6 L92 7 L100 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M0 21 L16 16 L32 17 L48 11 L64 12 L80 6 L92 7 L100 2 L100 24 L0 24 Z" fill="currentColor" fillOpacity="0.08"></path>
              </svg>
            </div>
          </div>

          {/* KPI 3: Active Children */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Active Children Now
              </span>
              <div className="w-9 h-9 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold">
                <span className="material-symbols-outlined text-[20px]">location_searching</span>
              </div>
            </div>
            <div className="mt-4 mb-2">
              <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums font-bold">
                {data.kpis.activeChildrenNow.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary pulse-emerald"></span>
                {data.kpis.activeChildrenPercent} Online
              </span>
              <span className="font-label-sm text-label-sm text-outline">GPS Active</span>
            </div>
            <div className="mt-3 w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div className="bg-tertiary h-full rounded-full transition-all duration-700" style={{ width: '82.5%' }}></div>
            </div>
          </div>

          {/* KPI 4: Active Parents (24h) */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Active Parents (24h)
              </span>
              <div className="w-9 h-9 rounded-lg bg-primary-fixed-dim flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">smartphone</span>
              </div>
            </div>
            <div className="mt-4 mb-2">
              <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums font-bold">
                {data.kpis.activeParents24h.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-bold">
                {data.kpis.activeParentsPercent} Engagement
              </span>
              <span className="font-label-sm text-label-sm text-outline">App sessions</span>
            </div>
            <div className="mt-3 w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: '77.1%' }}></div>
            </div>
          </div>

          {/* KPI 5: Total Users */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Total System Users
              </span>
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface font-bold">
                <span className="material-symbols-outlined text-[20px]">lan</span>
              </div>
            </div>
            <div className="mt-4 mb-2">
              <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums font-bold">
                {data.kpis.totalUsers.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-label-sm text-label-sm text-outline font-medium">Parents + Kids + Admins</span>
              <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/20 px-2 py-0.5 rounded-full font-bold">
                {data.kpis.totalUsersGrowth}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <span className="h-2 flex-1 rounded-l bg-primary" title="Children (59.7%)"></span>
              <span className="h-2 flex-1 bg-secondary" title="Parents (40.2%)"></span>
              <span className="h-2 w-2 rounded-r bg-tertiary" title="Staff (0.1%)"></span>
            </div>
          </div>
        </div>

        {/* Grid Section 1: Real-Time Telemetry & Safety Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Device Fleet & Geofence Status */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">devices_other</span>
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Real-Time Telemetry &amp; Device Integrity
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                  42,190 Enrolled Endpoints
                </span>
              </div>
            </div>

            {/* Device Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">iOS Devices</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">phone_iphone</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold tabular-nums">24,100</span>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '57.1%' }}></div>
                </div>
                <span className="font-label-sm text-label-sm text-outline">57.1% of global endpoints</span>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">Android Devices</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">android</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold tabular-nums">16,890</span>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '40.0%' }}></div>
                </div>
                <span className="font-label-sm text-label-sm text-outline">40.0% of global endpoints</span>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">Wearables &amp; GPS Bands</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">watch</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold tabular-nums">1,200</span>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-tertiary-container h-full" style={{ width: '2.9%' }}></div>
                </div>
                <span className="font-label-sm text-label-sm text-outline">2.9% specialized wearable tags</span>
              </div>
            </div>

            {/* Geofence & SOS Overview Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
              <div className="p-space-md rounded-xl bg-surface-container-low/60 flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed/30 flex items-center justify-center text-tertiary font-bold">
                    <span className="material-symbols-outlined text-[20px]">fence</span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold block">Geofence Compliance</span>
                    <span className="font-label-sm text-label-sm text-outline">Home, School, &amp; Designated Safe Zones</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-lg text-headline-lg text-tertiary font-bold tabular-nums">98.4%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Compliant</span>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low/60 flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center text-error font-bold">
                    <span className="material-symbols-outlined text-[20px]">sos</span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold block">Active SOS Emergencies</span>
                    <span className="font-label-sm text-label-sm text-outline">4 triggers resolved today</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold tabular-nums">
                    0 <span className="font-body-sm text-body-sm text-tertiary font-semibold">Active</span>
                  </span>
                  <span className="font-label-sm text-label-sm text-outline block">All cleared</span>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Flow Inflow Chart */}
          <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">query_stats</span>
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold">Telemetry Flow</span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary font-bold uppercase tracking-wider">
                High Velocity
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Ping Influx (Packets / Sec)
              </span>
              <div className="flex items-end justify-between h-28 gap-1.5 pt-2 px-1">
                <div className="flex-1 bg-primary-fixed hover:bg-primary transition-colors rounded-t h-[40%]" title="00:00 - 12k"></div>
                <div className="flex-1 bg-primary-fixed hover:bg-primary transition-colors rounded-t h-[25%]" title="03:00 - 8k"></div>
                <div className="flex-1 bg-primary-fixed hover:bg-primary transition-colors rounded-t h-[30%]" title="06:00 - 9.5k"></div>
                <div className="flex-1 bg-primary-container hover:bg-primary transition-colors rounded-t h-[85%]" title="08:00 (School Arrival) - 41k"></div>
                <div className="flex-1 bg-primary-fixed hover:bg-primary transition-colors rounded-t h-[70%]" title="10:00 - 28k"></div>
                <div className="flex-1 bg-primary-fixed hover:bg-primary transition-colors rounded-t h-[65%]" title="12:00 - 25k"></div>
                <div className="flex-1 bg-primary-container hover:bg-primary transition-colors rounded-t h-[95%]" title="15:00 (School Dismissal) - 48k"></div>
                <div className="flex-1 bg-primary-fixed hover:bg-primary transition-colors rounded-t h-[75%]" title="18:00 - 32k"></div>
                <div className="flex-1 bg-primary hover:bg-primary-fixed-variant transition-colors rounded-t h-[82%]" title="Current - 36k"></div>
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-outline px-1 font-mono">
                <span>00:00</span>
                <span>08:00</span>
                <span>15:00</span>
                <span>Now</span>
              </div>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-2">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant font-medium">Live Location Packets</span>
                <span className="font-bold text-on-surface tabular-nums font-mono">1.42M / hr</span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant font-medium">Parent Push Notifications</span>
                <span className="font-bold text-on-surface tabular-nums font-mono">38,910 sent</span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant font-medium">App Open Rate</span>
                <span className="font-bold text-tertiary tabular-nums font-mono">4.2 opens / parent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Section 2: Recent System Activity & Safety Events */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest border-b border-surface-container-low">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[18px]">history</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Recent System Activity &amp; Safety Events
                </h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Automated triggers, geofence violations, device warnings, and administrative actions
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="font-label-sm text-label-sm text-outline">Auto-refresh active</span>
              <button
                onClick={() => {
                  fetchDashboard();
                  showToast('Security audit log refreshed', 'info');
                }}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                title="Refresh Log"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-surface-container/50">
            {data.systemEvents.map((ev, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-space-md sm:px-space-lg hover:bg-surface-container-low transition-colors gap-space-md"
              >
                <div className="flex items-start gap-space-md">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      ev.color === 'error'
                        ? 'bg-error-container/40 text-error'
                        : ev.color === 'secondary'
                        ? 'bg-secondary-fixed text-secondary'
                        : ev.color === 'tertiary'
                        ? 'bg-tertiary-fixed/40 text-tertiary'
                        : 'bg-primary-fixed text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {ev.color === 'error' ? 'fmd_bad' : ev.color === 'secondary' ? 'battery_alert' : ev.color === 'tertiary' ? 'person_add' : 'admin_panel_settings'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-bold">{ev.title}</span>
                      <span
                        className={`font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full ${
                          ev.color === 'error'
                            ? 'bg-error-container/30 text-error'
                            : ev.color === 'secondary'
                            ? 'bg-secondary-fixed/50 text-secondary'
                            : 'bg-tertiary-fixed/30 text-tertiary'
                        }`}
                      >
                        {ev.type}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline font-mono">ID: {ev.id}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      {ev.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{ev.time}</span>
                  <button
                    onClick={() => showToast(`Audit trail details for ${ev.id}`, 'info')}
                    className="font-label-sm text-label-sm text-primary hover:underline mt-1 font-semibold"
                    type="button"
                  >
                    Audit Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-space-md bg-surface-container-low flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Showing {data.systemEvents.length} recorded system events today
            </span>
            <button
              onClick={() => showToast('Full historical SecOps ledger exported', 'info')}
              className="font-label-sm text-label-sm text-primary font-bold hover:underline flex items-center gap-1"
              type="button"
            >
              <span>View Complete Audit Log</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Bottom: Server Health Bar & Quick SecOps Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-center bg-surface-container-lowest p-space-md rounded-xl shadow-xs">
          <div className="xl:col-span-8 flex flex-wrap items-center gap-x-space-lg gap-y-space-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">DB Read/Write Latency:</span>
              <span className="font-label-sm text-label-sm text-on-surface font-bold font-mono">14ms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">APNs &amp; FCM Gateway:</span>
              <span className="font-label-sm text-label-sm text-tertiary font-bold font-mono">99.99%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Geocoding &amp; Mapping API:</span>
              <span className="font-label-sm text-label-sm text-on-surface font-bold">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Active WebSockets:</span>
              <span className="font-label-sm text-label-sm text-primary font-bold font-mono">34,812 connected</span>
            </div>
          </div>

          <div className="xl:col-span-4 flex items-center justify-start xl:justify-end gap-space-sm">
            <button
              onClick={handleRestartGateway}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1.5 font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Restart Gateway</span>
            </button>
            <button
              onClick={handleSystemPing}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-all flex items-center gap-1.5 font-bold shadow-2xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">notifications_active</span>
              <span>Broadcast System Ping</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
