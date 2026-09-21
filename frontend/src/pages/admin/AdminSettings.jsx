import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useApp } from '../../context/AppContext';

export default function AdminSettings() {
  const { showToast } = useApp();
  const [settings, setSettings] = useState({
    enforceFips: true,
    telemetryPollingSeconds: 15,
    immutableAuditLogsDays: 365,
    autoGeofenceBreachDispatch: true,
    emergencySirenCooldownMinutes: 10,
    coppaAuditComplianceExport: true
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    showToast(`Global SecOps rule "${key}" updated`, 'success');
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-5xl mx-auto px-4 lg:px-space-xl py-space-lg flex flex-col gap-space-lg pb-space-xl">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            SecOps Global System Parameters
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Platform-wide telemetry intervals, immutable compliance auditing, and emergency dispatch threshold governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Card 1: Telemetry & Polling Rates */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs flex flex-col gap-space-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">satellite_alt</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Telemetry &amp; Polling</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Live endpoint heartbeat frequency</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex flex-col gap-1 p-3 bg-surface-container-low rounded-xl">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  Standard Polling Interval (Seconds)
                </label>
                <input
                  type="number"
                  value={settings.telemetryPollingSeconds}
                  onChange={(e) => setSettings({ ...settings, telemetryPollingSeconds: parseInt(e.target.value) })}
                  className="bg-surface-container-lowest text-on-surface px-3 py-1.5 rounded-lg font-bold border border-outline-variant/30"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">
                    Auto Geofence Breach Dispatch
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Instant level-3 push to parent mobile
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('autoGeofenceBreachDispatch')}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 ${
                    settings.autoGeofenceBreachDispatch ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-2xs"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Statutory Governance */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs flex flex-col gap-space-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">policy</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Statutory Governance</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">FIPS 140-2 &amp; COPPA</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">
                    FIPS 140-2 Strict Mode
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Enforces AES-256 GCM hardware encryption
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('enforceFips')}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 ${
                    settings.enforceFips ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-2xs"></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">
                    COPPA Audit Archive
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Immutable staff access trail retention
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('coppaAuditComplianceExport')}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 ${
                    settings.coppaAuditComplianceExport ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-2xs"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => showToast('SecOps global parameters committed to HSM vault', 'success')}
            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-bold shadow-md hover:bg-primary-container transition-all"
            type="button"
          >
            Save Global System Rules
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
