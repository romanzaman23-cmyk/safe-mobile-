import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ConnectDevice() {
  const navigate = useNavigate();
  const { user, guardian, showToast } = useApp();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    if (connecting) return;
    setConnecting(true);

    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      showToast('Device linked with parent successfully!');
      setTimeout(() => {
        navigate('/permissions');
      }, 700);
    }, 1400);
  };

  return (
    <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl">
      {/* Top Status Bar */}
      <div className="w-full pt-safe">
        <div className="h-6 px-margin flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm select-none">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            <span className="material-symbols-outlined text-[18px]">battery_full</span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col relative w-full px-margin pb-safe bg-surface">
        <div className="flex flex-col w-full pb-space-lg">
          
          {/* Top Navigation / Progress Indicator */}
          <div className="flex items-center justify-between w-full mb-space-md pt-2">
            <Link
              to="/login"
              aria-label="Go back"
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant ml-1 font-semibold">Step 2 of 3</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant" title="Encrypted Connection">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
          </div>

          {/* Header Section */}
          <div className="flex flex-col items-center text-center px-space-xs mb-space-md">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-space-sm shadow-sm">
              <span className="material-symbols-outlined text-[26px]">devices_other</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mb-1 font-bold">
              Connect Your Device
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
              Pairing this smartphone with your family safety circle.
            </p>
          </div>

          {/* Dual User Link Visual Card */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md mb-space-md relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-tertiary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative flex flex-col items-center gap-space-sm">
              {/* Parent Box */}
              <div className="w-full bg-surface-container-low rounded-lg p-space-md flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high">
                      <img
                        className="w-full h-full object-cover"
                        alt="Ahmed Al-Salem"
                        src={guardian?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2mSn0LZt4IVIEd1btbPDFQsAJSSmjTKoPk4cLvnWYOPv5Dy8gpj2-_-1T7YXC_T9jCOTNn-J1GH_4eAW6TVd6eCQhO857R6JRVpgWfoJrxyvnh5Ph7Csp-lZHsl96YM_FW7XlTlCu7RD_lJzdsqj84vletbGVeaIcuji8RCsYB74r7NhuW29gewav42dno_gs2q9I6LRQ91Whh9qilJG9fSk3SVpQ9ZS0ofLGA_POsnV62i9QWdIZyg'}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] shadow-sm">
                      <span className="material-symbols-outlined text-[13px]">shield_person</span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                        {guardian?.name || 'Ahmed Al-Salem'}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {guardian?.email || 'ahmed@example.com'}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold mt-0.5">
                      Primary Family Guardian
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 self-start">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Verified Parent
                  </span>
                </div>
              </div>

              {/* Connecting Node */}
              <div className="flex items-center justify-center w-full py-1 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-surface-container-highest"></div>
                </div>
                <div className="relative z-10 flex items-center gap-2 bg-surface-container-lowest px-3 py-1 rounded-full shadow-sm">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary animate-pulse">
                    <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wide font-bold">
                    SECURE SYNC
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  </div>
                </div>
              </div>

              {/* Child Box */}
              <div className="w-full bg-surface-container-low rounded-lg p-space-md flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high">
                      <img
                        className="w-full h-full object-cover"
                        alt="Omar Ahmed"
                        src={user?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJvj2o86oZWx3AWgW88Dzws0ktaftS18Ws9iVs6OjCzolRsnUlrcoAX_389YaxxpPI8FcYDbOD00aYdQ3Sb2qr38T52WE_5c26MmJkLputSJHWheFCS8PCrTSfg68aUKBxrh_nRmprSxm70dQlxKSruhSsF404DxAivTg3GV_4mOaA6Ocm93D67SCiasrFeAsBYygomvH0GWVtqRna0TkOcNLlfzlZZUdvWhjTu60-_AFBHhJaraHAkw'}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center text-[11px] shadow-sm">
                      <span className="material-symbols-outlined text-[13px]">person</span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                        {user?.name || 'Omar Ahmed'}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {user?.email || 'omar.ahmed@example.com'}
                    </span>
                    <span className="font-label-sm text-label-sm text-tertiary font-semibold mt-0.5">
                      Family Member (Child)
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 self-start">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]">smartphone</span>
                    This Phone
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Specifications Card */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md mb-space-md">
            <div className="flex items-center justify-between mb-space-sm pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                <h2 className="font-label-lg text-label-lg text-on-surface font-bold">Target Device Details</h2>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-label-sm text-label-sm">Waiting for Permission</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[16px]">phone_android</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Device Name</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Omar's Galaxy S24</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Model</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Samsung Galaxy S24 (SM-S921B)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[16px]">system_update</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Operating System</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Android 14 (One UI 6.1)</span>
              </div>
            </div>
          </div>

          {/* Privacy Callout */}
          <div className="w-full bg-surface-container-low rounded-xl p-space-md mb-space-lg flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface mb-0.5 font-bold">
                End-to-End Encrypted Guard
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                All telemetry and monitoring data is end-to-end encrypted between this device and Ahmed Al-Salem's parent dashboard.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-3 w-full mt-auto">
            <button
              onClick={handleConnect}
              disabled={connecting}
              className={`w-full h-12 rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] font-bold cursor-pointer text-on-primary ${
                connected ? 'bg-tertiary-container' : 'bg-primary hover:bg-on-primary-fixed-variant'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${connecting ? 'animate-spin' : ''}`}>
                {connecting ? 'autorenew' : connected ? 'check_circle' : 'wifi_tethering'}
              </span>
              <span>
                {connecting
                  ? 'Authorizing Handshake...'
                  : connected
                  ? 'Linked Successfully!'
                  : 'Connect Device'}
              </span>
            </button>

            <Link
              to="/login"
              className="w-full h-11 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-low transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">switch_account</span>
              <span>Switch Child Account</span>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
