import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export default function ParentLayout({ children, activeChild, onSelectChild }) {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allPaused, setAllPaused] = useState(false);
  const [selectedChild, setSelectedChild] = useState(activeChild || 'all');
  const [isPausing, setIsPausing] = useState(false);

  const handlePauseAll = async () => {
    try {
      setIsPausing(true);
      const res = await api.togglePauseAll();
      setAllPaused(res.allPaused);
      showToast(res.message, res.allPaused ? 'warning' : 'success');
    } catch (err) {
      setAllPaused(!allPaused);
      showToast(allPaused ? 'Devices resumed' : 'All devices paused', allPaused ? 'success' : 'warning');
    } finally {
      setIsPausing(false);
    }
  };

  const navItems = [
    { path: '/parent/dashboard', label: 'Dashboard', icon: 'grid_view' },
    { path: '/parent/live-screen', label: 'Live Screen', icon: 'screenshot_monitor' },
    { path: '/parent/fleet', label: 'Family Devices', icon: 'devices' },
    { path: '/parent/settings', label: 'Settings & Rules', icon: 'settings' },
    { path: '/parent/profile', label: 'Parent Profile', icon: 'account_circle' },
  ];

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface antialiased flex flex-col font-body-md">
      {/* Mobile Top App Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md shadow-sm z-50 px-4 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-colors"
          type="button"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <span className="font-headline-sm text-[16px] font-bold text-on-surface">GuardianKids</span>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-primary"
        >
          <span className="material-symbols-outlined text-[16px]">smartphone</span>
          <span>Child View</span>
        </Link>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop & Responsive Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between gap-space-sm border-b border-surface-container-low/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary text-on-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-[16px] tracking-tight text-on-surface font-bold leading-tight">
                  GuardianKids
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                  Family Shield
                </span>
              </div>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[11px] px-2 py-0.5 rounded-full font-bold">
              Parent Portal
            </span>
          </div>

          {/* Navigation Links */}
          <div className="px-space-md py-space-sm">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-space-sm px-3 py-2.5 rounded-xl font-title-sm text-[14px] transition-all ${
                      isActive
                        ? 'bg-primary-fixed text-primary font-bold shadow-xs'
                        : 'text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Switcher & Profile Card */}
        <div className="flex flex-col gap-2 p-space-md bg-surface-container-low m-space-md rounded-xl">
          {/* Quick link to Child Companion Simulator */}
          <Link
            to="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-lowest hover:bg-primary-fixed text-primary font-title-sm text-[13px] font-bold shadow-2xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">smartphone</span>
              <span>Child App Companion</span>
            </div>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  alt="David Miller profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-surface-container-lowest"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKiKXstfjeOZrHO1qTfezZSD638hLho5uuQRsg5zDCKeN2sSnW-ZbbSEXytpBDy7az2kvAgUY_L9OgVv4BVX7eDwx8Be2nyYqMOZ6iV-FbzgGxLr8a_lh_tgBlMZe_7UFRGOC_r6q4kJu_pT4f5p7Dknk9P4YuaCRNSZDwgLTUHM463AdtlPD4Is6QQuBf8L2_GyUSlSFNDRRVeTjAxEsuy9QIssE3jb8BCOYxpLd8vs89Oj35zL6w"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-tertiary-container rounded-full ring-2 ring-surface-container-lowest"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-sm text-[13px] font-bold text-on-surface leading-tight truncate">
                  David Miller
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant truncate">
                  Primary Admin
                </span>
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between border-t border-outline-variant/30">
            <span className="inline-flex items-center gap-1.5 font-label-sm text-[11px] text-tertiary-container font-semibold">
              <span className="w-2 h-2 rounded-full bg-tertiary pulse-emerald"></span>
              Online
            </span>
            <button
              onClick={() => {
                showToast('Logged out of Parent Portal', 'info');
                navigate('/login');
              }}
              className="inline-flex items-center gap-1 text-error hover:text-on-error-container font-label-sm text-[11px] font-semibold transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Body Area with pl-72 for Desktop Sidebar */}
      <div className="lg:pl-72 w-full flex-1 flex flex-col">
        {/* Fixed Top Header */}
        <header className="fixed top-0 lg:left-72 left-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40">
          <div className="h-16 w-full px-4 lg:px-space-lg flex items-center justify-between gap-space-md">
            {/* Left Header: Child Selector & Live Syncing */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedChild}
                  onChange={(e) => {
                    setSelectedChild(e.target.value);
                    if (onSelectChild) onSelectChild(e.target.value);
                  }}
                  className="appearance-none bg-surface-container-low text-on-surface font-title-sm text-[13px] font-semibold py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none shadow-2xs hover:bg-surface-container transition-colors"
                >
                  <option value="all">All Children (3)</option>
                  <option value="1">Leo (iPhone 14)</option>
                  <option value="2">Maya (Galaxy S23)</option>
                  <option value="3">Noah (iPad Mini)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2.5 pointer-events-none text-[18px] text-on-surface-variant">
                  expand_more
                </span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-full text-tertiary">
                <span className="w-2 h-2 rounded-full bg-tertiary pulse-emerald"></span>
                <span className="font-label-sm text-[11px] font-bold">Live Syncing</span>
              </div>
            </div>

            {/* Right Header: Actions & Notifications & Profile */}
            <div className="flex items-center gap-2 lg:gap-space-md">
              <button
                onClick={handlePauseAll}
                disabled={isPausing}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-[12px] font-bold transition-all shadow-xs active:scale-95 ${
                  allPaused
                    ? 'bg-error text-on-error hover:bg-error/90 ring-2 ring-error'
                    : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {allPaused ? 'play_circle' : 'pause_circle'}
                </span>
                <span>{allPaused ? 'Resume All' : 'Pause All'}</span>
              </button>

              <button
                onClick={() => showToast('2 unread alerts: Noah low battery, gaming blocked for Leo', 'info')}
                className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                type="button"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error font-label-sm text-[10px] flex items-center justify-center rounded-full font-bold">
                  2
                </span>
              </button>

              <Link to="/parent/profile" className="flex items-center pl-1">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary transition-all"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKiKXstfjeOZrHO1qTfezZSD638hLho5uuQRsg5zDCKeN2sSnW-ZbbSEXytpBDy7az2kvAgUY_L9OgVv4BVX7eDwx8Be2nyYqMOZ6iV-FbzgGxLr8a_lh_tgBlMZe_7UFRGOC_r6q4kJu_pT4f5p7Dknk9P4YuaCRNSZDwgLTUHM463AdtlPD4Is6QQuBf8L2_GyUSlSFNDRRVeTjAxEsuy9QIssE3jb8BCOYxpLd8vs89Oj35zL6w"
                />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="w-full pt-16 bg-surface min-h-screen px-4 lg:px-space-lg py-space-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
