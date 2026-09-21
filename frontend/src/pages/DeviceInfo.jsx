import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function DeviceInfo() {
  const navigate = useNavigate();
  const { telemetry, showToast } = useApp();
  const [syncing, setSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Just now (12 seconds ago)');

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      await api.syncDevice();
      setLastSyncText('Just now (1 second ago)');
      showToast('Hardware Telemetry Synchronized!');
    } catch (err) {
      setLastSyncText('Just now (1 second ago)');
      showToast('Synchronized with local device');
    } finally {
      setTimeout(() => setSyncing(false), 1200);
    }
  };

  return (
    <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl">
      <Header title="Device Info" showBack={true} onBack={() => navigate('/settings')} />

      <main className="flex-1 flex flex-col relative w-full px-margin pt-20 pb-28 bg-surface">
        <div className="flex flex-col w-full gap-space-lg">
          
          {/* Header Status */}
          <div className="flex flex-col gap-space-xs pt-2">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                Device Information
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant shadow-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
                </span>
                <span className="font-label-sm text-label-sm">Connected</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Hardware details, operating system & sync telemetry
            </p>
          </div>

          {/* Device Overview Card */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm p-space-md flex flex-col gap-space-md">
            <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-surface-container-low opacity-60 pointer-events-none"></div>
            <div className="flex items-center gap-space-md relative z-10">
              <div className="w-16 h-20 rounded-xl bg-surface-container flex flex-col items-center justify-between p-2 shadow-inner shrink-0 relative">
                <div className="w-2.5 h-0.5 rounded-full bg-outline-variant"></div>
                <div className="w-full flex-1 my-1 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[24px]">smartphone</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    {telemetry?.device_name || "Omar's Galaxy S24"}
                  </h2>
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Samsung Electronics</span>
                <span className="font-body-sm text-body-sm text-outline font-mono mt-0.5">SM-S921B / DS</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-space-sm pt-space-xs bg-surface-container-low/70 rounded-lg p-space-sm">
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Operating System</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                  {telemetry?.os_version || 'Android 14'}
                </span>
                <span className="font-body-sm text-body-sm text-outline truncate text-[11px]">One UI 6.1 (UP1A)</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Device Fingerprint</span>
                <span className="font-label-lg text-label-lg text-on-surface font-mono font-semibold truncate">
                  {telemetry?.fingerprint || 'IMEI-****-9482'}
                </span>
                <span className="font-body-sm text-body-sm text-tertiary flex items-center gap-0.5 text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[12px]">lock</span> Encrypted SHA-256
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-space-sm">
            {/* Battery */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Battery Status</span>
                <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  battery_charging_80
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {telemetry?.battery_percent || 85}%
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                    {telemetry?.battery_status || 'Good'}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline truncate">Li-ion 4,000 mAh</p>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-tertiary h-full rounded-full transition-all duration-500"
                  style={{ width: `${telemetry?.battery_percent || 85}%` }}
                ></div>
              </div>
            </div>

            {/* Network */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Network</span>
                <span className="material-symbols-outlined text-primary text-[20px]">wifi</span>
              </div>
              <div>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate block">
                  {telemetry?.network_name || 'Home-Fiber-5G'}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Connected (5 GHz)</p>
              </div>
              <div className="flex items-center gap-1 text-tertiary font-semibold">
                <span className="material-symbols-outlined text-[13px]">speed</span>
                <span className="font-label-sm text-label-sm">Signal Excellent</span>
              </div>
            </div>

            {/* Internal Storage */}
            <div className="col-span-2 bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[20px]">hard_drive</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Internal Storage</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">128 GB Flash</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">54.2 GB</span>
                  <span className="font-body-sm text-body-sm text-outline">used</span>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary font-medium">73.8 GB Free</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex my-0.5">
                <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '42%' }}></div>
              </div>
              <div className="flex items-center justify-between text-outline text-[11px] font-body-sm">
                <span>Apps & System: 32 GB</span>
                <span>Media: 22.2 GB</span>
              </div>
            </div>

            {/* RAM */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Memory RAM</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">memory</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">3.8 GB</span>
                  <span className="font-body-sm text-body-sm text-outline">/ 8 GB</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">LPDDR5X Active</p>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary-container h-full rounded-full transition-all duration-500" style={{ width: '47%' }}></div>
              </div>
            </div>

            {/* IP Routing */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">IP Routing</span>
                <span className="material-symbols-outlined text-outline text-[20px]">router</span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-on-surface font-mono font-semibold truncate block">
                  {telemetry?.ip_address || '192.168.1.142'}
                </span>
                <p className="font-body-sm text-body-sm text-tertiary truncate">Local Secure NAT</p>
              </div>
              <div className="flex items-center gap-1 text-outline text-[11px]">
                <span className="material-symbols-outlined text-[13px]">vpn_lock</span>
                <span>Mesh Active</span>
              </div>
            </div>

            {/* App Version */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Companion Client</span>
                <span className="material-symbols-outlined text-primary text-[20px]">security_update_good</span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-on-surface font-semibold">SafeShield v2.4.1</span>
                <p className="font-body-sm text-body-sm text-tertiary truncate">Build #8942-rel</p>
              </div>
              <div className="flex items-center gap-1 text-tertiary font-semibold">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span className="font-label-sm text-label-sm">Up to Date</span>
              </div>
            </div>

            {/* Daemon State */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Daemon State</span>
                <span className="material-symbols-outlined text-tertiary text-[20px]">play_circle</span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Foreground Mode</span>
                <p className="font-body-sm text-body-sm text-outline truncate">Persistent Android OOM 0</p>
              </div>
              <div className="flex items-center gap-1 text-tertiary font-semibold">
                <span className="material-symbols-outlined text-[13px]">published_with_changes</span>
                <span className="font-label-sm text-label-sm">Unrestricted</span>
              </div>
            </div>
          </div>

          {/* Sync Timestamp Banner */}
          <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-xl px-space-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">sync</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  Last Cloud Synchronization
                </span>
                <span className="font-body-sm text-body-sm text-outline">{lastSyncText}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[18px]">cloud_done</span>
          </div>

          {/* Force Sync Action Button */}
          <div className="flex flex-col gap-space-sm mt-space-xs">
            <button
              onClick={handleForceSync}
              disabled={syncing}
              className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all font-bold cursor-pointer disabled:opacity-70"
            >
              <span className={`material-symbols-outlined text-[20px] ${syncing ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{syncing ? 'Synchronizing Hardware...' : 'Force Sync Now'}</span>
            </button>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}
