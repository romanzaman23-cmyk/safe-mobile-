import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function Settings() {
  const navigate = useNavigate();
  const { user, guardian, permissions, showToast } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await api.logout();
      showToast('Logged out from Companion. Guardian notified.');
      setTimeout(() => {
        navigate('/login');
      }, 700);
    } catch (err) {
      showToast('Logged out');
      navigate('/login');
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const allowedCount = permissions.filter(p => p.is_allowed).length;

  return (
    <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl">
      <Header title="Settings" />

      <main className="flex-1 flex flex-col relative w-full px-margin pt-20 pb-28 bg-surface">
        <div className="flex flex-col w-full pb-8">
          
          {/* Header Intro */}
          <div className="flex flex-col gap-1 mb-6">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm shadow-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_with_heart
              </span>
              <span>Transparent Safe Protection</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
              Settings & Privacy
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage preferences, parent connection, and continuous data security.
            </p>
          </div>

          {/* Connected Parent Card */}
          <section className="mb-6">
            <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm p-space-md">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      className="w-12 h-12 rounded-full object-cover shadow-sm"
                      alt="Ahmed Al-Salem"
                      src={guardian?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNBKAJbbe-hDQXQCSSsG9RdvmkGL0729KDTgBrYT_HblOzXfdhzWcLkqw3Q6nz9j7yn4hq3jaTjOj-vxwntF6dvlAt7zoLrvRq58w-UdVpnaaQ44IEAC-zKPB5eO-X2fljyS90IzSnG_2LYAYWdieZNKGLEtqo2SshoQgEje0rlVLkce2rJNjbCHaFzcro9RyV-l1cP_15M_dUNA77pXa_WCyu4ImkexjHs4KQlkOAmIMploNRKpXUA'}
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary-container rounded-full ring-2 ring-surface-container-lowest"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">
                        {guardian?.name || 'Ahmed Al-Salem'}
                      </span>
                      <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {guardian?.email || 'ahmed@example.com'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-tertiary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-ping"></span>
                  Active Supervisor
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-on-surface">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">handshake</span>
                  <span className="font-label-md text-label-md font-semibold">Mutual Autonomy & Care</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Guardian phone: ${guardian?.phone || '+966 50 123 4567'}`)}
                  className="font-label-sm text-label-sm font-bold text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          {/* Settings Navigation Items */}
          <section className="mb-8 flex flex-col gap-2">
            <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider px-1 font-bold">
              App Configuration
            </h2>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden divide-y divide-surface-container-low">
              
              {/* Account */}
              <Link
                to="/login"
                className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">face</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-bold">Account</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {user?.name || 'Omar Ahmed'} (Child Profile)
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
              </Link>

              {/* Monitoring Permissions */}
              <Link
                to="/permissions"
                className="flex items-center justify-between p-4 bg-surface-container-low/40 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
                    <span className="material-symbols-outlined text-[22px]">verified_user</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-bold">Monitoring Permissions</p>
                    <p className="font-body-sm text-body-sm text-tertiary font-medium">
                      {allowedCount} of {permissions.length || 8} permissions configured
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary font-label-sm text-label-sm font-semibold">
                  <span>Review</span>
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </Link>

              {/* Device Information */}
              <Link
                to="/device-info"
                className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[22px]">phone_android</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-bold">Device Information</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Samsung Galaxy S24</p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-outline-variant bg-surface-container px-2 py-0.5 rounded-full font-medium">
                  Synced
                </span>
              </Link>

              {/* Notifications & Alerts */}
              <Link
                to="/permission-success"
                className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[22px]">notifications_active</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-bold">Notifications & Alerts</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Push & Alerts Enabled</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
              </Link>

              {/* Privacy Policy */}
              <div
                onClick={() => showToast('End-to-End Encryption verified across parent sync.')}
                className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">enhanced_encryption</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-bold">Privacy Policy & Security</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">End-to-end encrypted monitoring</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
              </div>

              {/* Help & Support */}
              <div
                onClick={() => showToast('SafeShield Support: 24/7 Family Care Helpdesk')}
                className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[22px]">help_center</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-bold">Help & Support</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">FAQ, Safety Tips, Parent Help</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
              </div>

            </div>
          </section>

          {/* Logout Section */}
          <section className="mt-4 pt-2 flex flex-col items-center">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full h-12 rounded-full bg-error-container text-on-error-container font-label-lg text-label-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm font-bold cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Log Out from Companion</span>
            </button>
            <p className="font-body-sm text-body-sm text-outline mt-3 text-center">
              SafeShield Child Client v2.4.1 • Device ID #SF-9042
            </p>
          </section>

          {/* Logout Modal Sheet */}
          {showLogoutModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity">
              <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150">
                <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">warning</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
                  Are you sure you want to logout?
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  Logging out will pause monitoring sync with{' '}
                  <span className="font-semibold text-on-surface">Ahmed Al-Salem</span>. Your parent will be notified immediately.
                </p>
                <div className="flex flex-col w-full gap-2.5">
                  <button
                    onClick={handleConfirmLogout}
                    disabled={loggingOut}
                    className="w-full h-12 rounded-full bg-error text-on-error font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-70"
                  >
                    <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
                    <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full h-12 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold hover:bg-surface-container transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
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
