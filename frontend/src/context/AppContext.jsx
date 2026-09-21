import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Omar Ahmed',
    email: 'omar.ahmed@example.com',
    role: 'child',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjj47UTVN4_aoK1nIlnVWckmMzQif0I5W7D2cBx3yDqZ-xAP1hK3jGc7vKYfDqtfDwRiZ7B172XGFp4ewNcat9jqyi6iXm9GBXrdQS3uAHpiSdbUrxAr9tRiFlTlGVWa0hNZBaiV5kas8GY6LonF-4CNx3-E-GYhyLxUmStyKE6EYHu4EVHDoPE05EDfEyaxRIcTdTMh_9kn-6nf6O3rvTSSr1ShF1pF_hy1HQ-iv4s4pD0q4D2shn-g'
  });

  const [guardian, setGuardian] = useState({
    name: 'Ahmed Al-Salem',
    email: 'ahmed@example.com',
    relationship: 'Family Organizer • Primary Guardian',
    phone: '+966 50 123 4567',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNBKAJbbe-hDQXQCSSsG9RdvmkGL0729KDTgBrYT_HblOzXfdhzWcLkqw3Q6nz9j7yn4hq3jaTjOj-vxwntF6dvlAt7zoLrvRq58w-UdVpnaaQ44IEAC-zKPB5eO-X2fljyS90IzSnG_2LYAYWdieZNKGLEtqo2SshoQgEje0rlVLkce2rJNjbCHaFzcro9RyV-l1cP_15M_dUNA77pXa_WCyu4ImkexjHs4KQlkOAmIMploNRKpXUA'
  });

  const [permissions, setPermissions] = useState([]);
  const [usage, setUsage] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [profileRes, permRes, usageRes, telemRes] = await Promise.allSettled([
        api.getProfile(),
        api.getPermissions(),
        api.getUsage(),
        api.getTelemetry()
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.success) {
        setUser(profileRes.value.user);
        setGuardian(profileRes.value.guardian);
      }
      if (permRes.status === 'fulfilled' && permRes.value.success) {
        setPermissions(permRes.value.permissions);
      }
      if (usageRes.status === 'fulfilled' && usageRes.value.success) {
        setUsage(usageRes.value);
      }
      if (telemRes.status === 'fulfilled' && telemRes.value.success) {
        setTelemetry(telemRes.value.telemetry);
      }
    } catch (err) {
      console.error('Error refreshing context data:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (id, currentStatus) => {
    try {
      const res = await api.togglePermission(id, !currentStatus);
      if (res.success) {
        setPermissions(prev =>
          prev.map(p => (p.id === id ? { ...p, is_allowed: !currentStatus } : p))
        );
        showToast(`Permission updated: ${res.permission?.name || 'Saved'}`);
      }
    } catch (err) {
      showToast('Could not update permission', 'error');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        guardian,
        permissions,
        usage,
        telemetry,
        toast,
        loading,
        showToast,
        hideToast,
        refreshData,
        togglePermission,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
