import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import logoSvg from '../assets/logo.svg';

export default function Login() {
  const navigate = useNavigate();
  const { setUser, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !pin.trim()) {
      showToast('Please enter your child account email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email.trim().toLowerCase(), pin.trim());
      if (res.success) {
        setUser(res.user);
        showToast(`Welcome back, ${res.user.name}! Redirecting...`, 'success');
        setTimeout(() => {
          navigate('/connect-device');
        }, 500);
      } else {
        showToast(res.message || 'Unauthorized child account. Please ask your parent to add you in the Parent Portal.', 'error');
      }
    } catch (err) {
      showToast('Login failed. Please verify the email and password provided by your parent.', 'error');
    } finally {
      setLoading(false);
    }
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
            <span class="material-symbols-outlined text-[18px]">battery_full</span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col relative w-full px-margin pb-safe bg-surface justify-center">
        <div className="flex flex-col w-full pb-6 space-y-5">
          
          {/* Top Visual Branding Header */}
          <div className="flex flex-col items-center text-center pt-2 relative">
            <div className="absolute w-36 h-36 bg-gradient-to-tr from-primary-fixed via-surface-container-highest to-secondary-fixed-dim rounded-full blur-2xl opacity-60 -top-2 pointer-events-none"></div>
            
            <div className="relative w-24 h-24 rounded-3xl bg-surface-container-lowest shadow-lg flex items-center justify-center p-3 mb-3">
              <img alt="SafeShield Child App Logo" className="w-full h-full object-contain rounded-2xl" src={logoSvg} />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-tertiary-container"></span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight font-bold">
                SafeShield
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm tracking-wide uppercase font-semibold">
                Child Companion
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mt-1.5 px-2">
              Connect this device to your family circle to keep you safe and connected.
            </p>
          </div>

          {/* Interactive Form Card */}
          <form onSubmit={handleLogin} className="bg-surface-container-lowest rounded-3xl shadow-sm p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface font-semibold" htmlFor="child-email">
                Family Account Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  alternate_email
                </span>
                <input
                  id="child-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. zain@familycloud.org"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-2xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface font-semibold" htmlFor="child-pass">
                Companion PIN or Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="child-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter parent-assigned password"
                  className="w-full pl-11 pr-12 py-3 bg-surface-container-low rounded-2xl font-body-md text-body-md text-on-surface placeholder:text-outline tracking-wider focus:outline-none focus:bg-surface-container transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 p-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => showToast('Password reset requested. Please ask your parent to check the Parent Portal.', 'info')}
                className="font-label-md text-label-md text-primary active:opacity-75 hover:underline font-semibold cursor-pointer"
              >
                Forgot PIN or Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 font-bold cursor-pointer disabled:opacity-70"
            >
              <span>{loading ? 'Authenticating...' : 'Log In to Companion'}</span>
              <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'arrow_forward'}
              </span>
            </button>
          </form>

          {/* Parental Supervision Indicator Card */}
          <div className="bg-surface-container-low rounded-2xl p-4 flex items-start gap-3 shadow-none">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5 text-primary">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Managed by Parent or Guardian
                </span>
                <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Your parents manage pairing permissions to ensure your digital wellbeing while respecting your privacy.
              </p>
            </div>
          </div>

          {/* Device Fingerprint Details */}
          <div className="flex flex-col items-center justify-center space-y-1.5 pt-1 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">smartphone</span>
              <span>Device: Samsung Galaxy S24 (Android 14)</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline">
              SafeShield Companion v2.4.1 (Build 890)
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
