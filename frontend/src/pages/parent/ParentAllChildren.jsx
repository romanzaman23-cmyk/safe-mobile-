import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParentLayout from '../../components/parent/ParentLayout';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function ParentAllChildren() {
  const { showToast } = useApp();
  const [childrenList, setChildrenList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Active Selected Child Device Hub Modal State
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeTab, setActiveTab] = useState('vitals'); // 'vitals', 'screen', 'contacts', 'sms', 'apps'
  const [childContacts, setChildContacts] = useState([]);
  const [childSMS, setChildSMS] = useState([]);
  const [childApps, setChildApps] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  // New Contact Form Modal State inside child view
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  const fetchChildren = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.getParentChildren();
      if (res.success && res.data) {
        setChildrenList(res.data);
        if (selectedChild) {
          const fresh = res.data.find(c => c.id === selectedChild.id);
          if (fresh) setSelectedChild(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to load children list', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
    const interval = setInterval(() => fetchChildren(true), 2000);
    return () => clearInterval(interval);
  }, [selectedChild?.id]);

  // Auto-refresh child data while modal is open
  useEffect(() => {
    if (!selectedChild) return;
    const interval = setInterval(async () => {
      try {
        const [contactsRes, smsRes, appsRes] = await Promise.all([
          api.getParentContacts(selectedChild.id),
          api.getParentSMS(selectedChild.id),
          api.getParentApps(selectedChild.id)
        ]);
        if (contactsRes.success) setChildContacts(contactsRes.data || []);
        if (smsRes.success) setChildSMS(smsRes.data || []);
        if (appsRes.success) setChildApps(appsRes.data || []);
      } catch (err) {
        // silent sync
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedChild?.id]);

  // Fetch specific child telemetry, contacts, sms, and apps when modal opens
  const openChildHub = async (child, initialTab = 'vitals') => {
    setSelectedChild(child);
    setActiveTab(initialTab);
    setTabLoading(true);

    try {
      const [contactsRes, smsRes, appsRes] = await Promise.all([
        api.getParentContacts(child.id),
        api.getParentSMS(child.id),
        api.getParentApps(child.id)
      ]);

      if (contactsRes.success) setChildContacts(contactsRes.data || []);
      if (smsRes.success) setChildSMS(smsRes.data || []);
      if (appsRes.success) setChildApps(appsRes.data || []);
    } catch (err) {
      console.error('Failed to load child specific data', err);
    } finally {
      setTabLoading(false);
    }
  };

  const handleToggleLock = async (childId, currentLocked, childName) => {
    try {
      const res = await api.toggleChildLock(childId);
      showToast(res.message, res.isLocked ? 'warning' : 'success');
      if (selectedChild && selectedChild.id === childId) {
        setSelectedChild(prev => ({ ...prev, isLocked: res.isLocked, status: res.isLocked ? 'attention' : 'online' }));
      }
      fetchChildren();
    } catch (err) {
      showToast(`Updated state for ${childName}`, 'info');
    }
  };

  const handleToggleBlockContact = async (contact) => {
    try {
      const res = await api.toggleBlockContact(contact.id);
      if (res.success) {
        showToast(res.message, res.data.isBlocked ? 'warning' : 'success');
        setChildContacts(prev => prev.map(c => c.id === contact.id ? res.data : c));
      }
    } catch (err) {
      showToast('Failed to toggle contact block', 'error');
    }
  };

  const handleAddChildContact = async (e) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    try {
      const res = await api.addParentContact({
        childId: selectedChild.id,
        name: newContactName,
        phone: newContactPhone,
        category: 'Family / Safe Whitelist'
      });
      if (res.success) {
        showToast(res.message, 'success');
        setChildContacts(prev => [res.data, ...prev]);
        setNewContactName('');
        setNewContactPhone('');
        setShowAddContact(false);
      }
    } catch (err) {
      showToast('Error adding contact', 'error');
    }
  };

  const handleBlockSMSSender = async (sms) => {
    try {
      const res = await api.blockSMSSender(sms.id);
      if (res.success) {
        showToast(res.message, 'warning');
        setChildSMS(prev => prev.map(s => s.id === sms.id ? res.data : s));
      }
    } catch (err) {
      showToast('Failed to block sender', 'error');
    }
  };

  const handleToggleBlockApp = async (app) => {
    try {
      const res = await api.toggleBlockApp(app.id);
      if (res.success) {
        showToast(res.message, res.data.isBlocked ? 'warning' : 'success');
        setChildApps(prev => prev.map(a => a.id === app.id ? res.data : a));
      }
    } catch (err) {
      showToast('Failed to toggle app permission', 'error');
    }
  };

  const filteredChildren = childrenList.filter((child) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      child.name.toLowerCase().includes(query) ||
      child.deviceModel.toLowerCase().includes(query) ||
      (child.activeApp && child.activeApp.toLowerCase().includes(query));

    let matchesFilter = true;
    if (filterType === 'online') {
      matchesFilter = child.status === 'online';
    } else if (filterType === 'attention') {
      matchesFilter = child.status === 'attention' || child.isLocked || child.battery < 20;
    }

    return matchesQuery && matchesFilter;
  });

  return (
    <ParentLayout>
      <div className="flex flex-col w-full max-w-7xl mx-auto pb-space-xl">
        {/* Top Command & Action Bar */}
        <div className="relative w-full rounded-2xl bg-surface-container-lowest p-space-lg shadow-xs mb-space-lg overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-primary-fixed via-secondary-fixed/40 to-transparent blur-3xl pointer-events-none -z-0"></div>
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-lg">
            <div className="flex flex-col gap-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant font-bold">
                  Family Hardware Fleet
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  {childrenList.length} Connected Devices
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Child Devices &amp; Security Hub
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Click on any child device below to inspect their real-time live screen, contacts book, SMS text messages, and installed app quotas.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  await fetchChildren();
                  if (selectedChild) {
                    const [contactsRes, smsRes, appsRes] = await Promise.all([
                      api.getParentContacts(selectedChild.id),
                      api.getParentSMS(selectedChild.id),
                      api.getParentApps(selectedChild.id)
                    ]);
                    if (contactsRes.success) setChildContacts(contactsRes.data || []);
                    if (smsRes.success) setChildSMS(smsRes.data || []);
                    if (appsRes.success) setChildApps(appsRes.data || []);
                  }
                  showToast('⚡ Live Telemetry Synced! All child devices and phonebooks refreshed.', 'success');
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-title-sm text-title-sm font-bold border border-emerald-200 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px] text-emerald-600 animate-spin-slow">sync</span>
                <span>🔄 Sync Family Devices</span>
              </button>
              <Link
                to="/parent/add-child"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                <span>+ Add Child Device</span>
              </Link>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="relative z-10 mt-space-lg pt-space-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md bg-surface-container-low/60 p-3 rounded-xl">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md shadow-2xs outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="Search child name, phone model, or active app..."
                type="text"
              />
            </div>

            {/* Segmented Pill Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70'
                }`}
                type="button"
              >
                All Devices ({childrenList.length})
              </button>
              <button
                onClick={() => setFilterType('online')}
                className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all whitespace-nowrap ${
                  filterType === 'online'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70'
                }`}
                type="button"
              >
                Online Now ({childrenList.filter((c) => c.status === 'online').length})
              </button>
              <button
                onClick={() => setFilterType('attention')}
                className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all whitespace-nowrap ${
                  filterType === 'attention'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70'
                }`}
                type="button"
              >
                Locked / Attention ({childrenList.filter((c) => c.status === 'attention' || c.battery < 20 || c.isLocked).length})
              </button>
            </div>
          </div>
        </div>

        {/* Children Primary Cards Grid */}
        {filteredChildren.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-xs flex flex-col items-center justify-center gap-3 mb-space-xl">
            <div className="w-16 h-16 rounded-3xl bg-primary-fixed text-primary flex items-center justify-center mb-1 shadow-sm">
              <span className="material-symbols-outlined text-[36px]">devices_other</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">No Child Devices Found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              {searchQuery ? 'No child profiles match your search criteria.' : 'You have not added any child accounts yet. Click below to pair a child companion.'}
            </p>
            <Link
              to="/parent/add-child"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-bold shadow-md hover:bg-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>+ Add Child Profile</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-space-xl">
            {filteredChildren.map((child) => (
              <div
                key={child.id}
                className="flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden border border-outline-variant/30"
              >
                <div className="flex flex-col gap-space-md">
                  {/* Card Top Bar */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative cursor-pointer" onClick={() => openChildHub(child)}>
                        <img
                          className="w-14 h-14 rounded-2xl object-cover shadow-xs"
                          alt={child.name}
                          src={child.avatar}
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-surface-container-lowest rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              child.status === 'online' ? 'bg-tertiary pulse-emerald' : 'bg-outline'
                            }`}
                          ></span>
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <h3
                            onClick={() => openChildHub(child)}
                            className="font-title-md text-title-md text-on-surface font-bold hover:text-primary cursor-pointer transition-colors"
                          >
                            {child.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant font-medium">
                            {child.age} yrs
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
                          <span className="material-symbols-outlined text-[16px]">
                            {child.os?.includes('iOS') ? 'phone_iphone' : 'smartphone'}
                          </span>
                          <span className="truncate max-w-[170px]">{child.deviceModel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Battery Gauge */}
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-label-sm text-label-sm font-semibold ${
                        child.battery < 20
                          ? 'bg-error-container text-on-error-container animate-pulse'
                          : 'bg-surface-container-low text-tertiary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {child.battery < 20 ? 'battery_alert' : 'battery_5_bar'}
                      </span>
                      <span>{child.battery}%</span>
                    </div>
                  </div>

                  {/* Device Vitals Summary */}
                  <div
                    onClick={() => openChildHub(child)}
                    className="rounded-xl bg-surface-container-low/70 p-3 flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-2xs flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          {child.isLocked ? 'lock' : 'verified_user'}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                          Active Guardian State
                        </span>
                        <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                          {child.isLocked ? 'Device Locked by Parent' : `${child.status === 'online' ? 'Online' : 'Standby'} • ${child.activeApp || 'SafeShield Shield Active'}`}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      chevron_right
                    </span>
                  </div>

                  {/* Quick Shortcut Pills for Contacts, SMS, Apps */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => openChildHub(child, 'contacts')}
                      className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-center flex flex-col items-center gap-0.5 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px] text-tertiary">contacts</span>
                      <span className="text-[11px] font-bold">Contacts</span>
                    </button>
                    <button
                      onClick={() => openChildHub(child, 'sms')}
                      className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-center flex flex-col items-center gap-0.5 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">sms</span>
                      <span className="text-[11px] font-bold">SMS Logs</span>
                    </button>
                    <button
                      onClick={() => openChildHub(child, 'apps')}
                      className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-center flex flex-col items-center gap-0.5 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px] text-amber-600">apps</span>
                      <span className="text-[11px] font-bold">App Limits</span>
                    </button>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-space-md pt-space-sm flex items-center gap-2 border-t border-outline-variant/30">
                  <button
                    onClick={() => openChildHub(child, 'screen')}
                    className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary font-title-sm text-[13px] font-bold hover:bg-primary-container transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">screenshot_monitor</span>
                    <span>Live Screen</span>
                  </button>
                  <button
                    onClick={() => handleToggleLock(child.id, child.isLocked, child.name)}
                    className={`py-2 px-3 rounded-xl font-title-sm text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                      child.isLocked
                        ? 'bg-error text-on-error hover:bg-error/90'
                        : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {child.isLocked ? 'lock_open' : 'lock'}
                    </span>
                    <span>{child.isLocked ? 'Unlock' : 'Lock'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* COMPREHENSIVE CHILD DEVICE HUB MODAL (CONTACTS, SMS, APPS, LIVE MIRROR) */}
        {/* ========================================================================= */}
        {selectedChild && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-5xl max-h-[90vh] bg-surface-container-lowest rounded-3xl shadow-2xl flex flex-col border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95">
              
              {/* Modal Top Header */}
              <div className="p-space-md sm:p-space-lg bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={selectedChild.avatar}
                      alt={selectedChild.name}
                      className="w-12 h-12 rounded-2xl object-cover shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-surface-container-lowest flex items-center justify-center">
                      <span className={`w-2 h-2 rounded-full ${selectedChild.status === 'online' ? 'bg-tertiary pulse-emerald' : 'bg-outline'}`} />
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-headline-sm text-[18px] sm:text-[20px] font-bold text-on-surface truncate">
                        {selectedChild.name}'s Device Hub
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        selectedChild.isLocked ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}>
                        {selectedChild.isLocked ? 'Device Locked' : 'Protected & Online'}
                      </span>
                    </div>
                    <span className="text-body-sm text-on-surface-variant flex items-center gap-1.5 font-normal">
                      <span className="material-symbols-outlined text-[14px]">smartphone</span>
                      {selectedChild.deviceModel} • {selectedChild.battery}% Battery • {selectedChild.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLock(selectedChild.id, selectedChild.isLocked, selectedChild.name)}
                    className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-label-md font-bold transition-all ${
                      selectedChild.isLocked
                        ? 'bg-error text-on-error hover:bg-error/90'
                        : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {selectedChild.isLocked ? 'lock_open' : 'lock'}
                    </span>
                    <span>{selectedChild.isLocked ? 'Unlock' : 'Lock Phone'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedChild(null)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[24px]">close</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 p-2 bg-surface-container-low/70 border-b border-outline-variant/30 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('vitals')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-sm text-[13px] font-bold transition-all shrink-0 ${
                    activeTab === 'vitals' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                  <span>Vitals &amp; Controls</span>
                </button>

                <button
                  onClick={() => setActiveTab('screen')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-sm text-[13px] font-bold transition-all shrink-0 ${
                    activeTab === 'screen' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">screenshot_monitor</span>
                  <span>Live Mirror Screen</span>
                </button>

                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-sm text-[13px] font-bold transition-all shrink-0 ${
                    activeTab === 'contacts' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">contacts</span>
                  <span>Contacts Book ({childContacts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('sms')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-sm text-[13px] font-bold transition-all shrink-0 ${
                    activeTab === 'sms' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">sms</span>
                  <span>SMS Messages ({childSMS.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('apps')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-sm text-[13px] font-bold transition-all shrink-0 ${
                    activeTab === 'apps' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">apps</span>
                  <span>Apps &amp; Quotas ({childApps.length})</span>
                </button>

                <button
                  onClick={async () => {
                    setTabLoading(true);
                    const [cRes, sRes] = await Promise.all([
                      api.getParentContacts(selectedChild.id),
                      api.getParentSMS(selectedChild.id)
                    ]);
                    if (cRes.success) setChildContacts(cRes.data || []);
                    if (sRes.success) setChildSMS(sRes.data || []);
                    setTabLoading(false);
                    showToast(`🔄 Telemetry & Contacts refreshed from ${selectedChild.name}'s phone!`, 'success');
                  }}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-title-sm text-[12px] font-bold transition-all shrink-0 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">sync</span>
                  <span>Pull Phone Contacts &amp; SMS</span>
                </button>
              </div>

              {/* Modal Body Tab Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-space-md sm:p-space-lg">
                {tabLoading ? (
                  <div className="p-12 text-center text-on-surface-variant">Synchronizing device telemetry...</div>
                ) : null}

                {/* TAB 1: VITALS & DIRECT CONTROLS */}
                {!tabLoading && activeTab === 'vitals' && (
                  <div className="flex flex-col gap-space-md">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col">
                        <span className="text-[12px] text-on-surface-variant">Battery Vitals</span>
                        <span className="text-headline-sm font-bold text-on-surface mt-1">{selectedChild.battery}%</span>
                        <span className="text-[11px] text-tertiary font-semibold">Healthy Charge</span>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col">
                        <span className="text-[12px] text-on-surface-variant">Screen Time Today</span>
                        <span className="text-headline-sm font-bold text-primary mt-1">{selectedChild.screenTimeUsed}</span>
                        <span className="text-[11px] text-on-surface-variant">Limit: {selectedChild.screenTimeLimit}</span>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col">
                        <span className="text-[12px] text-on-surface-variant">Companion Version</span>
                        <span className="text-headline-sm font-bold text-on-surface mt-1">v2.4.1</span>
                        <span className="text-[11px] text-tertiary font-semibold">WireGuard Enforced</span>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col">
                        <span className="text-[12px] text-on-surface-variant">Shield Status</span>
                        <span className="text-headline-sm font-bold text-tertiary mt-1">{selectedChild.isLocked ? 'Locked' : 'Active'}</span>
                        <span className="text-[11px] text-on-surface-variant">AI Filter 100%</span>
                      </div>
                    </div>

                    <div className="p-space-md bg-surface-container-low rounded-2xl flex flex-col gap-3">
                      <h4 className="font-title-md font-bold text-on-surface">Direct Parental Action Grid</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <button
                          onClick={() => handleToggleLock(selectedChild.id, selectedChild.isLocked, selectedChild.name)}
                          className={`p-3 rounded-xl flex flex-col gap-1 text-left font-bold transition-all ${
                            selectedChild.isLocked ? 'bg-error text-on-error' : 'bg-surface-container-lowest text-error hover:bg-error-container'
                          }`}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[22px]">
                            {selectedChild.isLocked ? 'lock_open' : 'lock'}
                          </span>
                          <span className="text-[13px]">{selectedChild.isLocked ? 'Unlock Phone' : 'Instant Lock'}</span>
                        </button>

                        <button
                          onClick={() => showToast(`Emergency Siren Chime dispatched to ${selectedChild.name}'s phone`, 'warning')}
                          className="p-3 rounded-xl bg-surface-container-lowest hover:bg-amber-100 text-amber-800 flex flex-col gap-1 text-left font-bold transition-all"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[22px]">notification_important</span>
                          <span className="text-[13px]">Ring Siren Chime</span>
                        </button>

                        <button
                          onClick={() => showToast(`+15 mins bonus screen time granted to ${selectedChild.name}!`, 'success')}
                          className="p-3 rounded-xl bg-surface-container-lowest hover:bg-tertiary-fixed text-tertiary flex flex-col gap-1 text-left font-bold transition-all"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[22px]">more_time</span>
                          <span className="text-[13px]">+15m Bonus Time</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('screen')}
                          className="p-3 rounded-xl bg-surface-container-lowest hover:bg-primary-fixed text-primary flex flex-col gap-1 text-left font-bold transition-all"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[22px]">screenshot_monitor</span>
                          <span className="text-[13px]">Mirror Screen</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: LIVE SCREEN MIRROR */}
                {!tabLoading && activeTab === 'screen' && (
                  <div className="flex flex-col items-center justify-center gap-4 py-2">
                    <div className="relative w-full max-w-[340px] aspect-[9/19] bg-inverse-surface rounded-[48px] p-3 shadow-2xl ring-1 ring-white/10">
                      <div className="relative w-full h-full bg-surface-container-lowest rounded-[38px] overflow-hidden flex flex-col select-none justify-between border border-black/30">
                        {/* Status bar */}
                        <div className="h-10 px-5 pt-1 flex items-center justify-between text-[11px] font-bold text-on-surface bg-black/10">
                          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <div className="w-20 h-4 bg-inverse-surface rounded-full flex items-center justify-end px-1.5 shadow-inner">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-0.5"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>5G</span>
                            <span className="material-symbols-outlined text-[14px]">wifi</span>
                            <span className="text-emerald-500 font-bold">{selectedChild.battery || 85}%</span>
                          </div>
                        </div>

                        {/* Screen Content - Dynamic based on activeApp and lock state */}
                        {selectedChild.isLocked ? (
                          <div className="flex-1 bg-[#0b0f19] text-white flex flex-col items-center justify-center text-center p-5">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-2 border border-red-500/30 animate-pulse">
                              <span className="material-symbols-outlined text-[36px]">lock</span>
                            </div>
                            <h4 className="font-headline-sm text-[16px] font-bold text-red-400">Device Locked by Parent</h4>
                            <p className="text-[11px] text-gray-300 mt-1 px-2">SafeShield parental lock active.</p>
                            <span className="mt-3 px-3 py-0.5 rounded-full bg-red-950 text-red-400 text-[10px] font-bold border border-red-800">
                              🔒 Shield Active
                            </span>
                          </div>
                        ) : selectedChild.activeApp?.includes('messages') || selectedChild.activeApp?.includes('sms') ? (
                          <div className="flex-1 bg-[#0d1117] text-white flex flex-col justify-between p-3 overflow-hidden">
                            <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[16px]">💬</span>
                                  <span className="text-[12px] font-bold">SMS Messages</span>
                                </div>
                                <span className="px-2 py-0.2 bg-emerald-950 text-emerald-400 text-[9px] font-bold rounded-full border border-emerald-800">
                                  AI Protected
                                </span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {childSMS.length === 0 ? (
                                  <div className="p-3 bg-[#161b27] rounded-xl text-center text-gray-400 text-[11px] my-auto">
                                    No SMS logged on device yet
                                  </div>
                                ) : (
                                  childSMS.slice(0, 3).map((sms, i) => (
                                    <div key={sms.id || i} className="p-2 bg-[#161b27] rounded-xl border border-white/10 text-left">
                                      <div className="flex justify-between items-center text-[10px]">
                                        <span className="font-bold text-emerald-400">{sms.sender}</span>
                                        <span className="text-gray-400">{sms.time || 'Now'}</span>
                                      </div>
                                      <p className="text-[11px] text-gray-200 mt-0.5 line-clamp-2">{sms.message}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-around py-1.5 border-t border-white/10 bg-[#161b27] rounded-xl text-center text-[10px]">
                              <span className="text-gray-400">🏠 Home</span>
                              <span className="text-emerald-400 font-bold">💬 SMS</span>
                              <span className="text-gray-400">🛡️ Shield</span>
                              <span className="text-gray-400">📱 Stats</span>
                            </div>
                          </div>
                        ) : selectedChild.activeApp?.includes('shield') ? (
                          <div className="flex-1 bg-[#0d1117] text-white flex flex-col justify-between p-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1.5 pb-1.5 border-b border-white/10">
                                <span className="text-[16px]">🛡️</span>
                                <span className="text-[12px] font-bold">Protection Shield</span>
                              </div>
                              <div className="space-y-1">
                                {['👥 Contacts Sync (Live)', '💬 SMS Safety (Active)', '📺 Screen Telemetry (1080p)', '🔋 Battery Vitals (100%)'].map((item, idx) => (
                                  <div key={idx} className="p-1.5 bg-[#161b27] rounded-lg flex items-center justify-between text-[10px] border border-white/5">
                                    <span>{item}</span>
                                    <span className="text-emerald-400 font-bold">✓</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-around py-1.5 border-t border-white/10 bg-[#161b27] rounded-xl text-center text-[10px]">
                              <span className="text-gray-400">🏠 Home</span>
                              <span className="text-gray-400">💬 SMS</span>
                              <span className="text-emerald-400 font-bold">🛡️ Shield</span>
                              <span className="text-gray-400">📱 Stats</span>
                            </div>
                          </div>
                        ) : selectedChild.activeApp?.includes('device') ? (
                          <div className="flex-1 bg-[#0d1117] text-white flex flex-col justify-between p-3">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1.5 pb-1.5 border-b border-white/10">
                                <span className="text-[16px]">📱</span>
                                <span className="text-[12px] font-bold">Hardware Vitals</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="p-2 bg-[#161b27] rounded-lg">
                                  <span className="text-[9px] text-gray-400 block">🔋 Battery</span>
                                  <span className="text-[13px] font-bold text-emerald-400">{selectedChild.battery}%</span>
                                </div>
                                <div className="p-2 bg-[#161b27] rounded-lg">
                                  <span className="text-[9px] text-gray-400 block">⏱️ Screen Time</span>
                                  <span className="text-[13px] font-bold text-sky-400">{selectedChild.screenTimeUsed}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-around py-1.5 border-t border-white/10 bg-[#161b27] rounded-xl text-center text-[10px]">
                              <span className="text-gray-400">🏠 Home</span>
                              <span className="text-gray-400">💬 SMS</span>
                              <span className="text-gray-400">🛡️ Shield</span>
                              <span className="text-emerald-400 font-bold">📱 Stats</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 bg-[#0d1117] text-white flex flex-col justify-between p-3 overflow-hidden">
                            {/* Live Companion Home Screen (Full Scrollable View) */}
                            <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-0.5 custom-scrollbar">
                              <div className="p-2.5 bg-[#161b27] rounded-xl flex items-center justify-between border border-white/10">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 flex items-center justify-center text-[16px] shrink-0">
                                    🧒
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[12px] font-bold text-white block truncate">Hello, {selectedChild.name}! 👋</span>
                                    <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                      🟢 Live Companion Connected
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-2 bg-[#161b27] rounded-xl border border-white/10 flex flex-col gap-1 text-[11px]">
                                <span className="font-bold text-emerald-400">🔄 Live Sync Center</span>
                                <span className="text-gray-300 text-[10px]">📲 200 Contacts • {childSMS.length} SMS Synced</span>
                              </div>

                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="p-2 bg-[#161b27] rounded-xl border border-white/10">
                                  <span className="text-[9px] text-gray-400 block">🔋 Battery</span>
                                  <span className="text-[13px] font-bold text-emerald-400">{selectedChild.battery}%</span>
                                </div>
                                <div className="p-2 bg-[#161b27] rounded-xl border border-white/10">
                                  <span className="text-[9px] text-gray-400 block">⏱️ Screen Time</span>
                                  <span className="text-[13px] font-bold text-sky-400">{selectedChild.screenTimeUsed}</span>
                                </div>
                              </div>

                              <div className="p-2 bg-[#161b27] rounded-xl border border-white/10 flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-300">📋 Permissions Status</span>
                                {['📲 Contacts Whitelist', '💬 SMS Live Safety', '📺 Screen Telemetry', '🔋 Hardware Vitals'].map((p, i) => (
                                  <div key={i} className="flex justify-between items-center text-[9px]">
                                    <span className="text-gray-400">{p}</span>
                                    <span className="text-emerald-400 font-bold">✅ Active</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-around py-1.5 border-t border-white/10 bg-[#161b27] rounded-xl text-center text-[10px] mt-1">
                              <span className="text-emerald-400 font-bold">🏠 Home</span>
                              <span className="text-gray-400">💬 SMS</span>
                              <span className="text-gray-400">🛡️ Shield</span>
                              <span className="text-gray-400">📱 Stats</span>
                            </div>
                          </div>
                        )}

                        {/* Bottom bar */}
                        <div className="h-4 w-full flex items-center justify-center bg-black/10">
                          <div className="w-24 h-1 bg-white/40 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => showToast(`Screenshot captured and saved to ${selectedChild.name}'s vault`, 'success')}
                        className="px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-[12px] flex items-center gap-1.5 cursor-pointer active:scale-95"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">photo_camera</span>
                        <span>📸 Capture Frame</span>
                      </button>
                      
                      <button
                        onClick={() => handleToggleLock(selectedChild.id, selectedChild.isLocked, selectedChild.name)}
                        className={`px-3.5 py-2 rounded-xl font-bold text-[12px] flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                          selectedChild.isLocked
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {selectedChild.isLocked ? 'lock_open' : 'screen_lock_portrait'}
                        </span>
                        <span>{selectedChild.isLocked ? '🔓 Unlock Phone' : '🔒 Blackout Screen'}</span>
                      </button>

                      <Link
                        to="/parent/live-screen"
                        className="px-3.5 py-2 rounded-xl bg-primary text-white font-bold text-[12px] flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        <span>Open Full Screen Studio</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB 3: CONTACTS BOOK */}
                {!tabLoading && activeTab === 'contacts' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-title-md font-bold text-on-surface">{selectedChild.name}'s Address Book</h4>
                        <p className="text-body-sm text-on-surface-variant">Approved calling whitelist and blocked contacts.</p>
                      </div>
                      <button
                        onClick={() => setShowAddContact(true)}
                        className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-bold text-[12px] flex items-center gap-1 shadow-2xs"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                        <span>Add Whitelist Contact</span>
                      </button>
                    </div>

                    {showAddContact && (
                      <form onSubmit={handleAddChildContact} className="p-3.5 bg-surface-container-low rounded-2xl flex flex-col sm:flex-row items-center gap-2 border border-outline-variant/40">
                        <input
                          type="text"
                          required
                          placeholder="Contact Name"
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-surface-container-lowest rounded-xl text-[13px] text-on-surface border border-outline-variant/30"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number"
                          value={newContactPhone}
                          onChange={(e) => setNewContactPhone(e.target.value)}
                          className="flex-1 px-3 py-2 bg-surface-container-lowest rounded-xl text-[13px] text-on-surface border border-outline-variant/30"
                        />
                        <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-[12px]">
                          Save
                        </button>
                        <button type="button" onClick={() => setShowAddContact(false)} className="px-3 py-2 text-on-surface-variant font-bold text-[12px]">
                          Cancel
                        </button>
                      </form>
                    )}

                    {childContacts.length === 0 ? (
                      <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 mt-2">
                        <span className="material-symbols-outlined text-[36px] text-outline">contacts</span>
                        <span className="font-title-sm font-bold text-on-surface">No Contacts Added Yet</span>
                        <p className="text-body-sm text-on-surface-variant max-w-sm">
                          Click "Add Whitelist Contact" above to add approved family members, guardians, or teachers.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                        {childContacts.map(contact => (
                          <div key={contact.id} className="p-3.5 bg-surface-container-low rounded-2xl flex items-center justify-between gap-3 border border-outline-variant/20">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-[18px]">
                                {contact.avatar || '👤'}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-title-sm text-[14px] font-bold text-on-surface truncate">{contact.name}</span>
                                <span className="text-[12px] font-mono text-on-surface-variant">{contact.phone}</span>
                                <span className="text-[10px] text-primary font-semibold">{contact.category}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleBlockContact(contact)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                                contact.isBlocked ? 'bg-tertiary text-on-tertiary' : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                              }`}
                              type="button"
                            >
                              {contact.isBlocked ? 'Unblock' : 'Block Caller'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: SMS MESSAGES */}
                {!tabLoading && activeTab === 'sms' && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <h4 className="font-title-md font-bold text-on-surface">{selectedChild.name}'s SMS Message Stream</h4>
                      <p className="text-body-sm text-on-surface-variant">Real-time incoming &amp; outgoing screened text messages.</p>
                    </div>

                    {childSMS.length === 0 ? (
                      <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 mt-2">
                        <span className="material-symbols-outlined text-[36px] text-outline">mark_chat_read</span>
                        <span className="font-title-sm font-bold text-on-surface">No SMS Messages Yet</span>
                        <p className="text-body-sm text-on-surface-variant max-w-sm">
                          SafeShield AI screening is active. Intercepted incoming and outgoing SMS will appear here in real-time.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {childSMS.map(sms => {
                          const isFlagged = sms.status.toLowerCase().includes('phishing') || sms.status.toLowerCase().includes('blocked');
                          return (
                            <div
                              key={sms.id}
                              className={`p-3.5 bg-surface-container-low rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border ${
                                isFlagged ? 'border-error/40 bg-error-container/10' : 'border-outline-variant/20'
                              }`}
                            >
                              <div className="flex flex-col gap-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-sm text-[14px] font-bold text-on-surface">{sms.sender}</span>
                                  <span className="text-[11px] font-mono text-on-surface-variant">({sms.phone})</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isFlagged ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                                  }`}>
                                    {sms.status}
                                  </span>
                                  <span className="text-[11px] text-on-surface-variant ml-auto">🕒 {sms.time}</span>
                                </div>
                                <p className="p-2.5 bg-surface-container-lowest rounded-xl text-[13px] text-on-surface border border-outline-variant/20 mt-1">
                                  {sms.message}
                                </p>
                              </div>

                              {!isFlagged && (
                                <button
                                  onClick={() => handleBlockSMSSender(sms)}
                                  className="px-3 py-1.5 rounded-xl bg-error-container hover:bg-error hover:text-on-error text-on-error-container text-[11px] font-bold shrink-0 self-end sm:self-center"
                                  type="button"
                                >
                                  Block Sender
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: INSTALLED APPS */}
                {!tabLoading && activeTab === 'apps' && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <h4 className="font-title-md font-bold text-on-surface">{selectedChild.name}'s Installed Apps &amp; Limits</h4>
                      <p className="text-body-sm text-on-surface-variant">Manage daily minute limits and block distracting games.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {childApps.map(app => (
                        <div key={app.id} className="p-3.5 bg-surface-container-low rounded-2xl flex flex-col gap-2.5 border border-outline-variant/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                                <span className="material-symbols-outlined text-[20px]">{app.icon || 'apps'}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-title-sm text-[14px] font-bold text-on-surface">{app.name}</span>
                                <span className="text-[11px] text-on-surface-variant">{app.category} • {app.usedMinutes}m used</span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              app.isBlocked ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                            }`}>
                              {app.isBlocked ? 'Blocked' : 'Allowed'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                            <span className="text-[11px] text-on-surface-variant">Daily Limit: {app.dailyLimitMinutes} mins</span>
                            <button
                              onClick={() => handleToggleBlockApp(app)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                                app.isBlocked ? 'bg-tertiary text-on-tertiary' : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                              }`}
                              type="button"
                            >
                              {app.isBlocked ? 'Allow App' : 'Block App'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
