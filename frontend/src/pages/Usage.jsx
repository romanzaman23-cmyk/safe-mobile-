import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function Usage() {
  const { usage, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('today');
  const [requesting, setRequesting] = useState(false);

  const handleRequestExtension = async () => {
    setRequesting(true);
    try {
      const res = await api.requestTimeExtension(30);
      showToast(res.message || 'Request sent to parent!');
    } catch (err) {
      showToast('Extension requested (+30 mins)');
    } finally {
      setTimeout(() => setRequesting(false), 2000);
    }
  };

  const apps = usage?.apps || [
    { id: 1, app_name: 'WhatsApp', category: 'Social', icon: 'chat', usage_minutes: 102, daily_limit_minutes: 0, color: 'tertiary-container', status: 'Safe Pace' },
    { id: 2, app_name: 'TikTok', category: 'Media', icon: 'music_note', usage_minutes: 75, daily_limit_minutes: 90, color: 'secondary', status: 'Near Limit' },
    { id: 3, app_name: 'Snapchat', category: 'Social', icon: 'camera', usage_minutes: 48, daily_limit_minutes: 60, color: 'primary', status: '12m left' },
    { id: 4, app_name: 'Facebook', category: 'Media', icon: 'public', usage_minutes: 32, daily_limit_minutes: 0, color: 'primary-container', status: 'Safe Pace' },
    { id: 5, app_name: 'YouTube Kids', category: 'Learning', icon: 'smart_display', usage_minutes: 15, daily_limit_minutes: 0, color: 'error', status: 'Active' }
  ];

  const formatHours = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl">
      <Header title="Usage" />

      <main className="flex-1 flex flex-col relative w-full px-margin pt-20 pb-24 bg-surface">
        <div className="flex flex-col w-full gap-space-lg">
          
          {/* Header Context & Day Selector */}
          <section className="flex flex-col gap-space-sm pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                  App Usage & Screen Time
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Track your daily screen limits and app time breakdown
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  hourglass_top
                </span>
              </div>
            </div>

            {/* Day Selector Filter Pills */}
            <div className="flex items-center gap-space-xs p-1 bg-surface-container rounded-full mt-2">
              {['today', 'yesterday', 'weekly'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all text-center capitalize font-semibold cursor-pointer ${
                    activeTab === tab
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab === 'weekly' ? 'Weekly Summary' : tab}
                </button>
              ))}
            </div>
          </section>

          {/* Hero Metric Cards Grid */}
          <section className="grid grid-cols-1 gap-space-md">
            {/* Today's Screen Time Featured Card */}
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-md">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    Today's Screen Time
                  </span>
                  <div className="flex items-baseline gap-space-xs mt-1">
                    <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight font-bold">
                      4h 32m
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">/ 5h limit</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm shadow-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">timelapse</span>
                  <span>90% used</span>
                </div>
              </div>

              {/* Segmented Progress Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-secondary transition-all duration-700 shadow-sm"
                    style={{ width: '90%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-secondary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    28m remaining today
                  </span>
                  <span className="text-on-surface-variant">Daily Cap: 5h 00m</span>
                </div>
              </div>
            </div>

            {/* Weekly Screen Time Digest Card */}
            <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/30 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">insights</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Weekly Total</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">28h 45m</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Daily avg: 4h 06m</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_down</span>
                  <span>-12%</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-right">vs last week</span>
              </div>
            </div>
          </section>

          {/* Most Used Apps Section */}
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Most Used Apps</h2>
              <span
                onClick={() => showToast('Limits are managed by parent Ahmed Al-Salem', 'info')}
                className="font-label-sm text-label-sm text-primary font-semibold cursor-pointer"
              >
                View App Limits
              </span>
            </div>

            <div className="flex flex-col gap-space-xs">
              {apps.map(app => (
                <div
                  key={app.id}
                  className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-md">
                      <div className="w-11 h-11 rounded-xl bg-surface-container text-primary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[24px]">{app.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            {app.app_name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
                            {app.category}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {app.daily_limit_minutes > 0
                            ? `${formatHours(app.daily_limit_minutes)} Daily Limit`
                            : 'No limit set'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {formatHours(app.usage_minutes)}
                      </span>
                      <span
                        className={`font-label-sm text-label-sm font-semibold ${
                          app.status === 'Near Limit' ? 'text-secondary' : 'text-tertiary'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        app.status === 'Near Limit' ? 'bg-secondary' : 'bg-tertiary-container'
                      }`}
                      style={{
                        width: `${
                          app.daily_limit_minutes > 0
                            ? Math.min(100, Math.round((app.usage_minutes / app.daily_limit_minutes) * 100))
                            : Math.min(100, Math.round((app.usage_minutes / 180) * 100))
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Downtime Schedule */}
          <section className="rounded-xl bg-surface-container-high p-space-md flex flex-col gap-space-md shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bedtime
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Downtime Schedule</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Starts at 21:30 PM • School night</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
                Active 9:30 PM
              </span>
            </div>

            <div className="flex flex-col gap-space-xs bg-surface-container-lowest p-space-sm rounded-lg">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                Allowed apps during downtime:
              </span>
              <div className="flex items-center gap-space-sm pt-1">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                  <span>Phone</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">chat</span>
                  <span>Messages</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
                  <span>SafeShield</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRequestExtension}
              disabled={requesting}
              className="w-full h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] font-bold cursor-pointer disabled:opacity-70"
            >
              <span className={`material-symbols-outlined text-[20px] ${requesting ? 'animate-spin' : ''}`}>
                {requesting ? 'sync' : 'hourglass_empty'}
              </span>
              <span>{requesting ? 'Sending Request...' : 'Request Time Extension'}</span>
            </button>
          </section>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}
