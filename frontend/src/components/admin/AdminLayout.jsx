import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function AdminLayout({ children }) {
  const { showToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'grid_view' },
    { path: '/admin/all-children', label: 'All Children', icon: 'verified_user' },
    { path: '/admin/all-parents', label: 'All Parents', icon: 'group' },
    { path: '/admin/settings', label: 'Settings', icon: 'tune' },
    { path: '/admin/add-admin', label: 'Add Admin', icon: 'person_add' },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-on-surface antialiased flex flex-col font-body-md selection:bg-primary/20">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md shadow-xs z-50 px-4 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-colors"
          type="button"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Logo SVG */}
          <svg className="w-7 h-7" viewBox="0 0 120 120" fill="none">
            <defs>
              <linearGradient id="shieldGradMob" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#0EA5E9" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" rx="28" fill="url(#shieldGradMob)" />
            <path d="M60 22C42 22 32 30 32 46C32 72 60 96 60 96C60 96 88 72 88 46C88 30 78 22 60 22Z" fill="white" fillOpacity="0.2" />
            <path d="M60 30C46 30 38 37 38 50C38 71 60 88 60 88C60 88 82 71 82 50C82 37 74 30 60 30Z" fill="white" />
            <circle cx="60" cy="50" r="10" fill="url(#shieldGradMob)" />
            <path d="M48 68C51 62 55 59 60 59C65 59 69 62 72 68" stroke="url(#shieldGradMob)" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="font-headline-sm text-[16px] font-bold text-on-surface">GuardianNest</span>
        </div>

        <span className="bg-primary-container/10 text-primary font-label-sm text-[10px] px-2 py-0.5 rounded font-bold">
          SUPER ADMIN
        </span>
      </div>

      {/* Backdrop for Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Fixed Desktop & Responsive Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-lowest border-b border-surface-container-low/60">
            <div className="flex items-center gap-space-sm">
              <svg className="h-8 w-8 shrink-0" viewBox="0 0 120 120" fill="none">
                <defs>
                  <linearGradient id="shieldGradSide" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>
                <rect width="120" height="120" rx="28" fill="url(#shieldGradSide)" />
                <path d="M60 22C42 22 32 30 32 46C32 72 60 96 60 96C60 96 88 72 88 46C88 30 78 22 60 22Z" fill="white" fillOpacity="0.2" />
                <path d="M60 30C46 30 38 37 38 50C38 71 60 88 60 88C60 88 82 71 82 50C82 37 74 30 60 30Z" fill="white" />
                <circle cx="60" cy="50" r="10" fill="url(#shieldGradSide)" />
                <path d="M48 68C51 62 55 59 60 59C65 59 69 62 72 68" stroke="url(#shieldGradSide)" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col">
                <span className="font-headline-sm text-[15px] font-bold text-on-surface leading-tight tracking-tight">
                  GuardianNest
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant font-medium">
                  Child &amp; Family SecOps
                </span>
              </div>
            </div>
            <span className="bg-primary-container/10 text-primary font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
              SUPER ADMIN
            </span>
          </div>

          {/* Nav Items */}
          <div className="px-space-md pt-space-md">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline px-space-xs mb-space-xs block font-bold">
              Operational Console
            </span>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg font-label-lg text-label-lg transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Controls & Telemetry Gauge */}
        <div className="p-space-md flex flex-col gap-space-sm bg-surface-container-low/50 border-t border-surface-container-low/60">
          <div className="flex items-center justify-between px-space-sm py-space-xs rounded-lg bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-space-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">Telemetry Operational</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary font-bold font-mono">99.98%</span>
          </div>

          <div className="flex items-center justify-between px-space-sm py-space-xs rounded-lg bg-surface-container-lowest">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Theme Mode</span>
            <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-full">
              <button
                aria-label="Light mode"
                onClick={() => showToast('Switched to Light Mode', 'info')}
                className="p-1 rounded-full bg-surface-container-lowest text-on-surface shadow-2xs flex items-center justify-center"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">light_mode</span>
              </button>
              <button
                aria-label="Dark mode"
                onClick={() => showToast('Dark mode enabled for night SecOps monitoring', 'info')}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface flex items-center justify-center"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">dark_mode</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-space-sm overflow-hidden">
              <img
                alt="Alex Chen Super Admin"
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-primary/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-eVC2gCZllM9Jnvg2lFEvTSStYp7_9WqZQ5HMJ-UuOV43ST4BxF64RHXV-DjfPIw7kPRK9X9_bqtrplS1cdYKZnjEf-KGhrltayZj_Ff8ntBbOFzEMN3UGGcUMChVQxJMBZqw7Xwryfu6tRsQe8fz5XyO9FpOtyvztareWnl60wwEVSfZ9PnpHiCUCGJkCRIXF3meiSgC5cbbPvqVXjgS8xst4q013Ewg5TNH35FhRCpWJJt-bISJ"
              />
              <div className="flex flex-col truncate">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">Alex Chen</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Lead SecOps &amp; Admin</span>
              </div>
            </div>
            <button
              onClick={() => {
                showToast('Super Admin signed out', 'info');
                navigate('/login');
              }}
              className="text-outline hover:text-error transition-colors p-1 rounded hover:bg-error-container/20 flex items-center justify-center"
              title="Sign out"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Top Header & Body Container with Desktop pl-72 */}
      <div className="lg:pl-72 w-full flex-1 flex flex-col">
        <header className="fixed top-0 lg:left-72 left-0 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 lg:px-space-lg">
          <div className="flex items-center gap-space-md">
            <div className="hidden lg:flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
              <span className="text-outline">Admin Console</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-medium capitalize">
                {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
              </span>
            </div>

            <div className="relative flex items-center w-64 xl:w-96">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-12 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm placeholder:text-outline shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                placeholder="Search children, parents, devices, alerts..."
                type="text"
              />
              <span className="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] uppercase font-mono">
                ⌘K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-error-container/30 text-error font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
              <span>0 Active SOS Alerts</span>
            </div>

            <div className="hidden md:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-tertiary-fixed/20 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary pulse-emerald"></span>
              <span>Shield Engine Live</span>
            </div>

            <button
              onClick={() => showToast('No critical alerts pending', 'info')}
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors flex items-center justify-center"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            </button>

            <div className="flex items-center gap-space-xs pl-space-xs border-l border-outline-variant/30">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-eVC2gCZllM9Jnvg2lFEvTSStYp7_9WqZQ5HMJ-UuOV43ST4BxF64RHXV-DjfPIw7kPRK9X9_bqtrplS1cdYKZnjEf-KGhrltayZj_Ff8ntBbOFzEMN3UGGcUMChVQxJMBZqw7Xwryfu6tRsQe8fz5XyO9FpOtyvztareWnl60wwEVSfZ9PnpHiCUCGJkCRIXF3meiSgC5cbbPvqVXjgS8xst4q013Ewg5TNH35FhRCpWJJt-bISJ"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold leading-none">Alex Chen</span>
                <span className="font-label-sm text-label-sm text-tertiary text-[10px] uppercase font-bold leading-tight">
                  Super Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative pt-16 w-full min-h-screen bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
