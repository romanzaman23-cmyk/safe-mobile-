import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const navItems = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/usage', label: 'Usage', icon: 'bar_chart' },
    { to: '/permissions', label: 'Permissions', icon: 'verified_user' },
    { to: '/permission-success', label: 'Alerts', icon: 'notifications', hasBadge: true },
    { to: '/settings', label: 'Settings', icon: 'tune' }
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex justify-around items-center h-16 px-space-xs">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] h-12 rounded-full transition-all gap-0.5 relative ${
                isActive
                  ? 'bg-surface-container-low text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              {item.hasBadge ? (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
              ) : null}
            </div>
            <span className="font-label-sm text-label-sm font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
