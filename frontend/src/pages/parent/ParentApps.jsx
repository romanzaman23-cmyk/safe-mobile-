import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/parent/ParentLayout';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export default function ParentApps() {
  const { showToast } = useApp();
  const [apps, setApps] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsRes, childrenRes] = await Promise.all([
        api.getParentApps(selectedChildId === 'all' ? null : selectedChildId),
        api.getParentChildren()
      ]);
      if (appsRes.success) setApps(appsRes.data || []);
      if (childrenRes.success) setChildren(childrenRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedChildId]);

  const handleToggleBlockApp = async (app) => {
    try {
      const res = await api.toggleBlockApp(app.id);
      if (res.success) {
        showToast(res.message, res.data.isBlocked ? 'warning' : 'success');
        setApps(prev => prev.map(a => a.id === app.id ? res.data : a));
      }
    } catch (err) {
      showToast('Failed to update app permissions', 'error');
    }
  };

  const handleUpdateLimit = async (app, minutes) => {
    try {
      const res = await api.setAppTimeLimit(app.id, minutes);
      if (res.success) {
        showToast(res.message, 'success');
        setApps(prev => prev.map(a => a.id === app.id ? res.data : a));
      }
    } catch (err) {
      showToast('Failed to update time limit', 'error');
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (categoryFilter === 'blocked') return app.isBlocked;
    if (categoryFilter === 'allowed') return !app.isBlocked;
    if (categoryFilter !== 'all') return app.category.toLowerCase() === categoryFilter.toLowerCase();
    return true;
  });

  return (
    <ParentLayout>
      <div className="flex flex-col w-full max-w-7xl mx-auto gap-space-lg pb-space-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary-fixed text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">apps</span>
              </span>
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-bold">
                Installed Applications &amp; Screen Limits
              </h1>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Audit all games, social networks, and educational tools installed on child devices. Set daily minute limits or lock immediately.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadData();
                showToast('App inventory synced from child devices', 'info');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-sm text-title-sm font-bold shadow-xs transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">sync</span>
              <span>Sync Inventory</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-lowest p-space-sm rounded-2xl shadow-xs">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search installed app or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all ${
                  categoryFilter === 'all' ? 'bg-surface-container-lowest text-on-surface shadow-2xs' : 'text-on-surface-variant'
                }`}
                type="button"
              >
                All ({apps.length})
              </button>
              <button
                onClick={() => setCategoryFilter('blocked')}
                className={`px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all ${
                  categoryFilter === 'blocked' ? 'bg-error-container text-on-error-container shadow-2xs' : 'text-on-surface-variant'
                }`}
                type="button"
              >
                Blocked
              </button>
              <button
                onClick={() => setCategoryFilter('allowed')}
                className={`px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all ${
                  categoryFilter === 'allowed' ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-2xs' : 'text-on-surface-variant'
                }`}
                type="button"
              >
                Allowed
              </button>
            </div>

            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 py-2 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
            >
              <option value="all">All Child Devices</option>
              {children.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Apps Grid */}
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant">Scanning application inventory...</div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/40">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">apps</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">No Applications Found</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">No apps match the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className={`flex flex-col justify-between bg-surface-container-lowest rounded-2xl border shadow-xs transition-all overflow-hidden ${
                  app.isBlocked ? 'border-error/40 bg-error-container/10' : 'border-outline-variant/20'
                }`}
              >
                <div className="p-space-md flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] ${
                        app.isBlocked ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed text-primary'
                      }`}>
                        <span className="material-symbols-outlined">{app.icon || 'apps'}</span>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-title-md text-[16px] font-bold text-on-surface">
                          {app.name}
                        </h4>
                        <span className="text-[12px] text-on-surface-variant">
                          {app.category} • Rating: {app.rating}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      app.isBlocked ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                    }`}>
                      {app.isBlocked ? 'Blocked' : 'Allowed'}
                    </span>
                  </div>

                  {/* Usage & Time Quota */}
                  <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-on-surface-variant">Today's Usage:</span>
                      <strong className="text-on-surface font-bold">{app.usedMinutes} mins / {app.dailyLimitMinutes} mins limit</strong>
                    </div>

                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${app.isBlocked ? 'bg-error' : 'bg-primary'}`}
                        style={{ width: `${Math.min(100, (app.usedMinutes / (app.dailyLimitMinutes || 1)) * 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-on-surface-variant">Daily Limit:</span>
                      <div className="flex items-center gap-1.5">
                        {[30, 60, 120].map(mins => (
                          <button
                            key={mins}
                            onClick={() => handleUpdateLimit(app, mins)}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                              app.dailyLimitMinutes === mins
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                            }`}
                            type="button"
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-3 bg-surface-container-low/50 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    Dev: {app.developer}
                  </span>

                  <button
                    onClick={() => handleToggleBlockApp(app)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                      app.isBlocked
                        ? 'bg-tertiary text-on-tertiary hover:bg-tertiary/90'
                        : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {app.isBlocked ? 'check_circle' : 'block'}
                    </span>
                    <span>{app.isBlocked ? 'Unblock App' : 'Block App'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
