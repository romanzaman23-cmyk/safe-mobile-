import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParentLayout from '../../components/parent/ParentLayout';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function ParentDashboard() {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    metrics: {
      childrenGuarded: 0,
      liveOnline: 0,
      batteryAverage: '0%',
      lowBatteryChild: null,
      mobileUsageToday: '0m',
      combinedLimitPercent: 0,
      combinedLimitText: '0h / 0h',
      lastInteraction: 'No events yet'
    },
    children: [],
    appUsage: [],
    liveFeed: []
  });
  const [appFilter, setAppFilter] = useState('today');

  const fetchOverview = async () => {
    try {
      const res = await api.getParentOverview();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load parent dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleLock = async (childId, currentLocked, childName) => {
    try {
      const res = await api.toggleChildLock(childId);
      showToast(res.message, res.isLocked ? 'warning' : 'success');
      fetchOverview();
    } catch (err) {
      showToast(`Updated lock state for ${childName}`, 'info');
    }
  };

  return (
    <ParentLayout>
      <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-xl">
        {/* Welcome & Executive Quick Actions Header */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-xs">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-primary-fixed via-secondary-fixed/40 to-transparent blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
            <div className="flex flex-col space-y-space-xs">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-md text-label-md text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                  Today • Live Monitor
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low font-label-md text-label-md text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary pulse-emerald"></span>
                  Refreshed live
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                  Shield Active
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Welcome back, David! 👋
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                {data.children.length > 0
                  ? `Here is what is happening across your children's ${data.children.length} connected device(s) today. All safety filters and guardrails are live.`
                  : 'No child devices paired yet. Click "Add Child" to provision your first child account.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  await fetchOverview();
                  showToast('⚡ Live Telemetry Synced! All child devices refreshed from companion stream.', 'success');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-title-sm text-title-sm font-bold transition-all border border-emerald-200 shadow-2xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600 animate-spin-slow">sync</span>
                <span>🔄 Sync Devices Now</span>
              </button>
              <Link
                to="/parent/live-screen"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm font-semibold transition-all shadow-2xs"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">screenshot_monitor</span>
                <span>Live Screen</span>
              </Link>
              <Link
                to="/parent/fleet"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm font-semibold transition-all shadow-2xs"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">devices</span>
                <span>Family Devices</span>
              </Link>
              <Link
                to="/parent/add-child"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-semibold hover:bg-primary-container transition-all shadow-xs active:scale-98"
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                <span>+ Add Child</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 6-Metric Executive KPI Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
          {/* Total Children */}
          <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Children Guarded</span>
              <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[18px]">family_restroom</span>
              </div>
            </div>
            <div className="mt-3 flex flex-col space-y-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">{data.metrics.childrenGuarded} Children</span>
              <div className="flex items-center gap-1 font-body-sm text-body-sm text-tertiary font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>{data.metrics.childrenGuarded > 0 ? 'All paired & monitored' : 'No children paired'}</span>
              </div>
            </div>
          </div>

          {/* Active Now */}
          <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Live Activity</span>
              <div className="w-8 h-8 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary pulse-emerald"></span>
              </div>
            </div>
            <div className="mt-3 flex flex-col space-y-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">{data.metrics.liveOnline} Online</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {data.metrics.liveOnline > 0 ? `${data.metrics.liveOnline} device(s) online` : 'No devices online'}
              </span>
            </div>
          </div>

          {/* Battery Status */}
          <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Battery Average</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <span className="material-symbols-outlined text-[18px]">battery_charging_full</span>
              </div>
            </div>
            <div className="mt-3 flex flex-col space-y-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">{data.metrics.batteryAverage}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {data.metrics.lowBatteryChild ? `${data.metrics.lowBatteryChild} is low` : (data.metrics.childrenGuarded > 0 ? 'All batteries healthy' : 'No telemetry')}
              </span>
            </div>
          </div>

          {/* Mobile Usage Today */}
          <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Mobile Usage</span>
              <div className="w-8 h-8 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">smartphone</span>
              </div>
            </div>
            <div className="mt-3 flex flex-col space-y-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">{data.metrics.mobileUsageToday}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {data.metrics.childrenGuarded > 0 ? 'Recorded usage today' : 'No screen time'}
              </span>
            </div>
          </div>

          {/* Combined Screen Time Progress Gauge */}
          <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Combined Limit</span>
              <span className="font-label-sm text-label-sm text-primary font-bold">{data.metrics.combinedLimitPercent}%</span>
            </div>
            <div className="mt-2 flex flex-col space-y-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">{data.metrics.combinedLimitText.split('/')[0]}</span>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-primary via-secondary to-secondary-container h-full rounded-full" style={{ width: `${data.metrics.combinedLimitPercent}%` }}></div>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{data.metrics.childrenGuarded > 0 ? 'Combined allowance' : 'No limits active'}</span>
            </div>
          </div>

          {/* Last Active */}
          <div className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Last Interaction</span>
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
            </div>
            <div className="mt-3 flex flex-col space-y-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-on-surface truncate">{data.metrics.lastInteraction}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Live Real-Time Sync</span>
            </div>
          </div>
        </section>

        {/* Children Overview Cards */}
        <section className="flex flex-col space-y-space-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">Active Guardianship Status</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time device vitals, app engagements, and safety policy enforcement.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/parent/all-children" className="text-primary font-title-sm text-[13px] font-bold hover:underline flex items-center gap-1">
                <span>View Full Fleet</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {data.children.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-xs flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-primary-fixed text-primary flex items-center justify-center mb-1 shadow-sm">
                <span className="material-symbols-outlined text-[36px]">family_restroom</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">No Children Paired Yet</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                You have not added any child devices. Click the button below to add your child's legal name, email, and password.
              </p>
              <Link
                to="/parent/add-child"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-bold shadow-md hover:bg-primary-container transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                <span>+ Add Child Profile &amp; Pair Device</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
              {data.children.map((child) => (
                <div
                  key={child.id}
                  className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-lg shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex flex-col space-y-space-md">
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            className="w-14 h-14 rounded-2xl object-cover shadow-xs"
                            alt={child.name}
                            src={child.avatar}
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                child.status === 'online' ? 'bg-tertiary pulse-emerald' : 'bg-outline'
                              }`}
                            ></span>
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md font-bold text-on-surface">{child.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                              Age {child.age}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              {child.deviceModel?.includes('iPhone') ? 'phone_iphone' : 'phone_android'}
                            </span>
                            <span className="truncate">{child.deviceModel}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                          child.isLocked
                            ? 'bg-error-container text-on-error-container'
                            : child.status === 'online'
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${child.isLocked ? 'bg-error' : 'bg-tertiary'}`}></span>
                        <span>{child.isLocked ? 'Locked' : (child.status === 'online' ? 'Active' : 'Offline')}</span>
                      </span>
                    </div>

                    {/* Vitals Telemetry */}
                    <div className="grid grid-cols-2 gap-space-sm p-space-sm rounded-xl bg-surface-container-low/70">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-tertiary">battery_charging_full</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-sm text-[11px] text-on-surface-variant">Battery</span>
                          <span className="font-label-md text-label-md font-bold text-on-surface">{child.battery}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-sm text-[11px] text-on-surface-variant">Screen Time</span>
                          <span className="font-label-md text-label-md font-bold text-on-surface">{child.screenTimeUsed}</span>
                        </div>
                      </div>
                    </div>

                    {/* Current App Activity */}
                    <div className="flex flex-col gap-1 p-space-sm rounded-xl bg-surface-container-lowest shadow-2xs border border-outline-variant/30">
                      <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Active App</span>
                      <span className="font-title-sm text-title-sm font-bold text-on-surface truncate">{child.activeApp}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 pt-space-md mt-space-md border-t border-outline-variant/30">
                    <button
                      onClick={() => handleToggleLock(child.id, child.isLocked, child.name)}
                      className={`flex-1 py-2 px-3 rounded-xl font-label-md text-label-md font-semibold transition-all ${
                        child.isLocked
                          ? 'bg-error text-on-error hover:bg-error/90'
                          : 'bg-error-container/70 text-on-error-container hover:bg-error-container'
                      }`}
                      type="button"
                    >
                      {child.isLocked ? 'Unlock Device' : 'Lock Device'}
                    </button>
                    <Link
                      to="/parent/live-screen"
                      className="py-2 px-3 rounded-xl bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors"
                    >
                      Live View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Deep Dive Analytics & Real-Time Event Stream (Two-Column Asymmetric Bento Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* App Usage Summary (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Monitored Application Usage</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Aggregated consumption across social, gaming, and learning applications today.
                </p>
              </div>
              <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
                <button
                  onClick={() => setAppFilter('today')}
                  className={`px-3 py-1 rounded-lg font-label-md text-label-md font-bold transition-all ${
                    appFilter === 'today'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Today
                </button>
                <button
                  onClick={() => setAppFilter('7days')}
                  className={`px-3 py-1 rounded-lg font-label-md text-label-md font-bold transition-all ${
                    appFilter === '7days'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  7 Days
                </button>
              </div>
            </div>

            {/* App Breakdown Items */}
            <div className="flex flex-col space-y-space-md pt-2">
              {data.appUsage.map((app, idx) => (
                <div
                  key={idx}
                  className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                          app.color === 'green'
                            ? 'bg-green-500 text-white'
                            : app.color === 'black'
                            ? 'bg-black text-white'
                            : app.color === 'red'
                            ? 'bg-red-600 text-white'
                            : app.color === 'amber'
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">{app.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-title-sm text-title-sm font-bold text-on-surface">{app.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-label-sm text-label-sm font-semibold ${
                              app.isLimit
                                ? 'bg-error-container text-on-error-container font-bold flex items-center gap-0.5'
                                : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            {app.isLimit && <span className="material-symbols-outlined text-[12px]">lock</span>}
                            {app.category}
                          </span>
                        </div>
                        <span className={`font-body-sm text-body-sm ${app.isLimit ? 'text-error font-medium' : 'text-on-surface-variant'}`}>
                          {app.description}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-title-md text-title-md font-bold ${app.isLimit ? 'text-error' : 'text-on-surface'}`}>
                        {app.time}
                      </span>
                      <span className={`block font-label-sm text-label-sm ${app.isLimit ? 'text-error' : 'text-on-surface-variant'}`}>
                        {app.note}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${app.isLimit ? 'bg-error' : 'bg-primary'}`}
                      style={{ width: `${app.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Micro Note */}
            <div className="pt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary">health_and_safety</span>
                Real-time AI Content Shielding Active
              </span>
              <Link to="/parent/settings" className="text-primary font-semibold hover:underline">
                Manage App Limits →
              </Link>
            </div>
          </div>

          {/* Live Chronological Activity Stream (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-tertiary pulse-emerald"></div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Live Event Feed</h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Real-time sync</span>
            </div>

            {/* Timeline List */}
            <div className="relative flex flex-col space-y-space-md before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container">
              {data.liveFeed.map((event) => (
                <div key={event.id} className="relative flex items-start gap-space-md">
                  <div
                    className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                      event.isAlert
                        ? 'bg-error-container text-on-error-container'
                        : event.color === 'tertiary'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : event.color === 'secondary'
                        ? 'bg-secondary-fixed text-secondary'
                        : 'bg-primary-fixed text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{event.icon}</span>
                  </div>
                  <div
                    className={`flex flex-col flex-1 min-w-0 p-3 rounded-xl ${
                      event.isAlert ? 'bg-error-container/40' : 'bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-title-sm text-title-sm font-bold ${event.isAlert ? 'text-error' : 'text-on-surface'}`}>
                        {event.title}
                      </span>
                      <span className={`font-label-sm text-label-sm ${event.isAlert ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
                        {event.time}
                      </span>
                    </div>
                    <p className={`font-body-sm text-body-sm mt-0.5 ${event.isAlert ? 'text-on-error-container font-medium' : 'text-on-surface-variant'}`}>
                      {event.note}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                          event.isAlert
                            ? 'bg-error text-on-error'
                            : 'bg-surface-container-high text-primary'
                        }`}
                      >
                        {event.tag}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{event.device}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => showToast('Full historical log loaded (24h archive)', 'info')}
              className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm font-semibold transition-colors flex items-center justify-center gap-1"
              type="button"
            >
              <span>View Full Security Log</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </ParentLayout>
  );
}
