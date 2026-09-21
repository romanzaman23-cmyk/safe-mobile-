import React, { useState } from 'react';
import ParentLayout from '../../components/parent/ParentLayout';
import { useApp } from '../../context/AppContext';

export default function ParentSettings() {
  const { showToast } = useApp();
  const [settings, setSettings] = useState({
    autoBedtimeLock: true,
    bedtimeHour: '20:30',
    wakeHour: '07:00',
    strictWebFilter: true,
    aiChatScreening: true,
    geofenceRadiusMeters: 300,
    smsTamperAlerts: true,
    dailyScreenTimeMinutes: 180
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    showToast(`Setting "${key}" updated`, 'success');
  };

  return (
    <ParentLayout>
      <div className="flex flex-col w-full max-w-5xl mx-auto gap-space-lg pb-space-xl">
        {/* Header */}
        <div className="flex flex-col gap-space-xs">
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Family Safety &amp; Shield Rules
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Global parental guardrails, screen time schedules, and AI threat detection parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Card 1: Screen Time & Bedtime Schedule */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs flex flex-col gap-space-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">schedule</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Screen Time &amp; Schedules</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Automated locking routines</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">Automatic Bedtime Lock</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Locks child screens automatically at night</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('autoBedtimeLock')}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 ${
                    settings.autoBedtimeLock ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-xs"></span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-3 bg-surface-container-low rounded-xl">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">Lock Start Time</label>
                  <input
                    type="time"
                    value={settings.bedtimeHour}
                    onChange={(e) => setSettings({ ...settings, bedtimeHour: e.target.value })}
                    className="bg-surface-container-lowest text-on-surface px-3 py-1.5 rounded-lg font-bold border border-outline-variant/30"
                  />
                </div>
                <div className="flex flex-col gap-1 p-3 bg-surface-container-low rounded-xl">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">Morning Unlock</label>
                  <input
                    type="time"
                    value={settings.wakeHour}
                    onChange={(e) => setSettings({ ...settings, wakeHour: e.target.value })}
                    className="bg-surface-container-lowest text-on-surface px-3 py-1.5 rounded-lg font-bold border border-outline-variant/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Safety & Content Filters */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs flex flex-col gap-space-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">security</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Content &amp; Web Filters</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">AI threat detection</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">Strict Web Filter</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Blocks adult content, phishing &amp; betting</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('strictWebFilter')}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 ${
                    settings.strictWebFilter ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-xs"></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">AI Chat Screening</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Alerts parents on stranger danger &amp; bullying</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('aiChatScreening')}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 ${
                    settings.aiChatScreening ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-xs"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => showToast('All safety rules saved and propagated to child devices!', 'success')}
            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-bold shadow-md hover:bg-primary-container transition-all"
            type="button"
          >
            Save All Rules
          </button>
        </div>
      </div>
    </ParentLayout>
  );
}
