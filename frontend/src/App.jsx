import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Toast from './components/Toast';

// Child Companion Pages
import Home from './pages/Home';
import Login from './pages/Login';
import ConnectDevice from './pages/ConnectDevice';
import Permissions from './pages/Permissions';
import Usage from './pages/Usage';
import Settings from './pages/Settings';
import DeviceInfo from './pages/DeviceInfo';
import PermissionSuccess from './pages/PermissionSuccess';

// Parent Web Portal Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentLiveScreen from './pages/parent/ParentLiveScreen';
import ParentAllChildren from './pages/parent/ParentAllChildren';
import ParentAddChild from './pages/parent/ParentAddChild';
import ParentProfile from './pages/parent/ParentProfile';
import ParentSettings from './pages/parent/ParentSettings';
import ParentContacts from './pages/parent/ParentContacts';
import ParentSMS from './pages/parent/ParentSMS';
import ParentApps from './pages/parent/ParentApps';

// Super Admin SecOps Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAllParents from './pages/admin/AdminAllParents';
import AdminAllChildren from './pages/admin/AdminAllChildren';
import AdminAddAdmin from './pages/admin/AdminAddAdmin';
import AdminSettings from './pages/admin/AdminSettings';

function FloatingModeSwitcher() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const currentMode = location.pathname.startsWith('/admin')
    ? 'Super Admin'
    : location.pathname.startsWith('/parent')
    ? 'Parent Portal'
    : 'Child Companion';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-[#0b1c30] text-white p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-2 min-w-[200px] animate-fadeIn">
          <span className="text-[10px] font-bold text-outline-variant uppercase tracking-wider px-2">
            Switch Application Portal
          </span>
          <Link
            to="/admin/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold text-tertiary-fixed"
          >
            <span className="material-symbols-outlined text-[18px]">security</span>
            <span>Super Admin SecOps</span>
          </Link>
          <Link
            to="/parent/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold text-primary-fixed"
          >
            <span className="material-symbols-outlined text-[18px]">shield</span>
            <span>Parent Web Portal</span>
          </Link>
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold text-secondary-fixed"
          >
            <span className="material-symbols-outlined text-[18px]">smartphone</span>
            <span>Child Companion App</span>
          </Link>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 bg-[#0b1c30] text-white px-4 py-2.5 rounded-full shadow-2xl hover:scale-105 transition-all text-xs font-bold border border-white/20 active:scale-95"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">
          {location.pathname.startsWith('/admin')
            ? 'security'
            : location.pathname.startsWith('/parent')
            ? 'shield'
            : 'smartphone'}
        </span>
        <span>{currentMode}</span>
        <span className="material-symbols-outlined text-[16px]">
          {open ? 'expand_more' : 'unfold_more'}
        </span>
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen w-full bg-surface text-on-surface">
          <Routes>
            {/* Child Companion App Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/connect-device" element={<ConnectDevice />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/device-info" element={<DeviceInfo />} />
            <Route path="/permission-success" element={<PermissionSuccess />} />

            {/* Parent Web Portal Routes */}
            <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/parent/live" element={<ParentLiveScreen />} />
            <Route path="/parent/live-screen" element={<ParentLiveScreen />} />
            <Route path="/parent/contacts" element={<ParentContacts />} />
            <Route path="/parent/sms" element={<ParentSMS />} />
            <Route path="/parent/apps" element={<ParentApps />} />
            <Route path="/parent/all-children" element={<ParentAllChildren />} />
            <Route path="/parent/fleet" element={<ParentAllChildren />} />
            <Route path="/parent/add-child" element={<ParentAddChild />} />
            <Route path="/parent/profile" element={<ParentProfile />} />
            <Route path="/parent/settings" element={<ParentSettings />} />

            {/* Super Admin SecOps Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/all-parents" element={<AdminAllParents />} />
            <Route path="/admin/all-children" element={<AdminAllChildren />} />
            <Route path="/admin/add-admin" element={<AdminAddAdmin />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
          <FloatingModeSwitcher />
          <Toast />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
