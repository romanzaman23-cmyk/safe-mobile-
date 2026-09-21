import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logoSvg from '../assets/logo.svg';

export default function Header({ title = 'SafeShield', showBack = false, onBack = null }) {
  const { user, showToast } = useApp();
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 w-full max-w-md z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Status Bar */}
      <div className="h-6 px-margin flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm select-none">
        <span>{time}</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[16px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      {/* Navigation Header Bar */}
      <div className="h-14 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          {showBack ? (
            <button
              onClick={onBack || (() => window.history.back())}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-low text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}
          <img alt="SafeShield Child App Logo" className="h-8 w-auto object-contain" src={logoSvg} />
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none rounded-full"
            onClick={() => showToast('SafeShield Companion Protection Active', 'info')}
          >
            <span className="material-symbols-outlined text-[24px]">help_outline</span>
          </button>
          <Link to="/settings">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-[0_1px_4px_rgba(0,0,0,0.08)] ring-2 ring-primary/20 hover:ring-primary transition-all"
              src={user?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjj47UTVN4_aoK1nIlnVWckmMzQif0I5W7D2cBx3yDqZ-xAP1hK3jGc7vKYfDqtfDwRiZ7B172XGFp4ewNcat9jqyi6iXm9GBXrdQS3uAHpiSdbUrxAr9tRiFlTlGVWa0hNZBaiV5kas8GY6LonF-4CNx3-E-GYhyLxUmStyKE6EYHu4EVHDoPE05EDfEyaxRIcTdTMh_9kn-6nf6O3rvTSSr1ShF1pF_hy1HQ-iv4s4pD0q4D2shn-g'}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
