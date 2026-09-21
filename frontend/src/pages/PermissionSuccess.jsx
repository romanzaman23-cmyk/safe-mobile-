import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';

export default function PermissionSuccess() {
  const navigate = useNavigate();
  const { user, guardian, showToast } = useApp();
  const [showAndroidModal, setShowAndroidModal] = useState(false);

  const dismissModal = (choice) => {
    setShowAndroidModal(false);
    if (choice === 'denied') {
      showToast('Contacts access withheld (Parent notified)', 'error');
    } else {
      showToast('SafeShield Contacts Verified for Parent Sync', 'info');
    }
  };

  return (
    <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl">
      <Header title="Permission Details" showBack={true} onBack={() => navigate('/permissions')} />

      <main className="flex-1 flex flex-col relative w-full px-margin pt-20 pb-safe bg-surface">
        <div className="flex flex-col w-full relative pb-8 select-none">
          
          {/* Celebration Sparks */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
            <div className="absolute top-6 left-1/4 w-2 h-2 rounded-full bg-tertiary-fixed opacity-70 animate-ping"></div>
            <div className="absolute top-12 right-12 w-2.5 h-2.5 rounded-full bg-secondary-container opacity-60 animate-pulse"></div>
            <div className="absolute top-28 left-8 w-3 h-3 rounded-full bg-primary-fixed-dim opacity-50"></div>
            <div className="absolute top-44 right-1/4 w-2 h-2 rounded-full bg-tertiary-container opacity-70 animate-bounce"></div>
          </div>

          {/* Success Hero */}
          <div className="flex flex-col items-center text-center pt-2 px-space-xs z-10">
            <div className="relative flex items-center justify-center mb-space-md">
              <div className="absolute w-28 h-28 rounded-full bg-tertiary-fixed/30 blur-xl animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-tertiary-container flex items-center justify-center shadow-lg shadow-tertiary/20">
                <div className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-tertiary text-[38px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified_user
                  </span>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-surface-container-lowest text-tertiary rounded-full p-1 shadow-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-label-sm text-label-sm mb-space-sm shadow-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              Pairing Established
            </div>

            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
              Device Connected Successfully
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 max-w-xs leading-relaxed">
              Your device is now securely connected to your parent account.
            </p>
          </div>

          {/* Summary Bento Card */}
          <div className="mt-space-lg bg-surface-container-lowest rounded-xl shadow-sm p-margin flex flex-col gap-space-md z-10">
            <div className="flex items-center justify-between pb-space-sm bg-surface-container-low p-3 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-sm">
                  <img
                    alt="Omar Ahmed"
                    className="w-full h-full object-cover"
                    src={user?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjj47UTVN4_aoK1nIlnVWckmMzQif0I5W7D2cBx3yDqZ-xAP1hK3jGc7vKYfDqtfDwRiZ7B172XGFp4ewNcat9jqyi6iXm9GBXrdQS3uAHpiSdbUrxAr9tRiFlTlGVWa0hNZBaiV5kas8GY6LonF-4CNx3-E-GYhyLxUmStyKE6EYHu4EVHDoPE05EDfEyaxRIcTdTMh_9kn-6nf6O3rvTSSr1ShF1pF_hy1HQ-iv4s4pD0q4D2shn-g'}
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-tertiary"></span>
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Child Profile
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    {user?.name || 'Omar Ahmed'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end min-w-0 pl-2 text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Guardian
                </span>
                <span className="font-label-lg text-label-lg text-primary font-bold truncate">
                  {guardian?.name || 'Ahmed Al-Salem'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                  <span className="font-label-sm text-label-sm font-medium">Device</span>
                </div>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">Samsung S24</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Android 14</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-1.5 text-tertiary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold">Status</span>
                </div>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Connected</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Sync: Just now</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2.5 bg-surface-container-low rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed/60 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    battery_charging_full
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Battery 85%</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Optimal health</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Active Sync
              </div>
            </div>
          </div>

          {/* Reassurance Notice */}
          <div className="mt-space-md p-space-md rounded-xl bg-surface-container-high flex items-start gap-3 z-10">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              health_and_safety
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Mutual Safety & Autonomous Trust
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                Protected by SafeShield Child Security Service. Only emergency alerts and device wellness metrics are shared. Private personal messages remain protected.
              </p>
            </div>
          </div>

          {/* Dashboard Button */}
          <div className="mt-space-lg w-full flex flex-col gap-space-sm z-10">
            <Link
              to="/"
              className="w-full h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:bg-primary active:scale-[0.98] transition-transform font-bold"
            >
              <span>Go to Child Home Dashboard</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <button
              onClick={() => setShowAndroidModal(true)}
              className="w-full py-2 text-center text-primary font-label-md text-label-md hover:underline font-semibold cursor-pointer"
            >
              Simulate Android 14 System Permission Modal
            </button>
          </div>

          {/* Android Native Permission Simulation Modal */}
          {showAndroidModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-inverse-surface/40 backdrop-blur-sm transition-opacity">
              <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl p-space-lg flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-space-md text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    contacts
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Allow SafeShield to access your contacts?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm leading-relaxed text-left bg-surface-container-low p-3 rounded-lg w-full">
                  Your parent account (<span className="font-semibold text-on-surface">{guardian?.name || 'Ahmed Al-Salem'}</span>) has requested permission to monitor contact information for emergency verification and safety.
                </p>
                <div className="w-full mt-space-lg flex flex-col gap-2">
                  <button
                    onClick={() => dismissModal('while-using')}
                    className="w-full py-3 px-4 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-[0.98] transition-all text-center font-semibold cursor-pointer"
                  >
                    While using the app
                  </button>
                  <button
                    onClick={() => dismissModal('only-this-time')}
                    className="w-full py-3 px-4 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-[0.98] transition-all text-center font-semibold cursor-pointer"
                  >
                    Only this time
                  </button>
                  <button
                    onClick={() => dismissModal('denied')}
                    className="w-full py-3 px-4 rounded-full bg-transparent text-primary font-label-md text-label-md hover:bg-surface-container-low active:scale-[0.98] transition-all text-center font-semibold cursor-pointer"
                  >
                    Don't allow
                  </button>
                </div>
                <div className="mt-space-md flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[15px] text-tertiary">lock</span>
                  <span>End-to-End Guardian Protection</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <BottomNav />
    </div>
  );
}
