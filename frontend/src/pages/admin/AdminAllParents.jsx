import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function AdminAllParents() {
  const { showToast } = useApp();
  const [parentsList, setParentsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedChildrenFilter, setSelectedChildrenFilter] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParents = async () => {
    try {
      const res = await api.getAdminParents();
      if (res.success && res.data) {
        setParentsList(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(parentsList.map((p) => p.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleRowSelect = (id) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((item) => item !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleStatusChange = async (parentId, newStatus) => {
    try {
      const res = await api.updateParentStatus(parentId, newStatus);
      showToast(res.message, 'success');
      fetchParents();
    } catch (err) {
      showToast('Status updated', 'info');
    }
  };

  const filteredParents = parentsList.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.phone.includes(query);

    const matchesPlan = !selectedPlan || p.subscriptionTier.toLowerCase().includes(selectedPlan.toLowerCase());
    const matchesStatus = !selectedStatus || p.status.toLowerCase().includes(selectedStatus.toLowerCase());
    const matchesKids =
      !selectedChildrenFilter ||
      (selectedChildrenFilter === '1' && p.childrenCount === 1) ||
      (selectedChildrenFilter === '2' && p.childrenCount === 2) ||
      (selectedChildrenFilter === '3+' && p.childrenCount >= 3);

    return matchesQuery && matchesPlan && matchesStatus && matchesKids;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col w-full p-4 lg:p-margin max-w-[1720px] mx-auto gap-space-lg">
        {/* Header & Quick Operational Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-xs">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-space-xs">
              <span className="px-2 py-0.5 rounded-full bg-primary-container/10 text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                Guardian Registry Ops
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm">Directory Node #US-EAST-4</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
              Parent Accounts Directory
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage 28,450 registered family primary and secondary guardian accounts, cross-device authorization policies, and enterprise family safety tiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={() => showToast('Guardian registry CSV archive downloaded', 'success')}
              className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-all active:scale-98 font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => showToast('Broadcast push banner sent to all 28,450 parents', 'info')}
              className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-all active:scale-98 font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">campaign</span>
              <span>Broadcast Push</span>
            </button>
            <button
              onClick={() => showToast('Manual parent registration modal opened', 'info')}
              className="flex items-center gap-space-xs px-4 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-xs hover:bg-primary-container transition-all active:scale-98 font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Manual Invite</span>
            </button>
          </div>
        </div>

        {/* Live KPI Metrics Strip with Visual Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Total Registered Guardians
              </span>
              <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">supervisor_account</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">28,450</span>
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>+12.4%
              </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>vs. 25,310 last month</span>
              <span className="text-tertiary font-bold">99.8% Sync</span>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Family Premium Tiers
              </span>
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed/30 flex items-center justify-center text-tertiary font-bold">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">22,180</span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm font-bold">
                78% Share
              </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>$14.99/mo standard plan</span>
              <span className="font-mono text-on-surface font-bold">$332.4k MRR</span>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Basic &amp; Trial Subscriptions
              </span>
              <div className="w-9 h-9 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary font-bold">
                <span className="material-symbols-outlined text-[20px]">family_star</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">6,270</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-bold">
                22% Base
              </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Conversion funnel healthy</span>
              <span className="text-secondary font-bold">8.4% Upgrades</span>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary-container h-full rounded-full" style={{ width: '22%' }}></div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                2FA Multi-Factor Shield
              </span>
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed/30 flex items-center justify-center text-tertiary font-bold">
                <span className="material-symbols-outlined text-[20px]">lock_clock</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">94.2%</span>
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[14px]">shield</span>Compliant
              </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>COPPA &amp; GDPR Compliant</span>
              <span className="text-error font-bold">1,650 Pending</span>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </div>
        </div>

        {/* Filter Control Center */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col gap-space-sm">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm">
            <div className="relative flex-1 min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-24 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/30 transition-all"
                placeholder="Search parent by name, email, phone number, guardian ID..."
                type="text"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] uppercase font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
              <div className="relative">
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="appearance-none h-11 pl-3.5 pr-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-colors border border-outline-variant/30"
                >
                  <option value="">All Subscription Plans</option>
                  <option value="premium">Family Premium ($14.99/mo)</option>
                  <option value="plus">Family Plus</option>
                  <option value="basic">Basic Tier</option>
                  <option value="trial">Free Trial</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none h-11 pl-3.5 pr-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-colors border border-outline-variant/30"
                >
                  <option value="">All Account Statuses</option>
                  <option value="active">Active &amp; Verified</option>
                  <option value="pending">Pending 2FA</option>
                  <option value="suspended">Suspended / Delinquent</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedChildrenFilter}
                  onChange={(e) => setSelectedChildrenFilter(e.target.value)}
                  className="appearance-none h-11 pl-3.5 pr-9 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-colors border border-outline-variant/30"
                >
                  <option value="">Children Count</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                  <option value="3+">3+ Children</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Action Banner */}
        {selectedRowIds.length > 0 && (
          <div className="flex items-center justify-between px-space-md py-2.5 rounded-xl bg-primary text-on-primary shadow-md transition-all">
            <div className="flex items-center gap-space-sm font-label-md text-label-md font-bold">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{selectedRowIds.length} account(s) selected</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => showToast('Re-verification push sent to selected parents', 'info')}
                className="px-3 py-1 rounded bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-label-sm text-label-sm font-bold transition-colors"
                type="button"
              >
                Force Re-verification
              </button>
              <button
                onClick={() => showToast('Policy compliance email dispatched', 'info')}
                className="px-3 py-1 rounded bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-label-sm text-label-sm font-bold transition-colors"
                type="button"
              >
                Send Policy Email
              </button>
              <button
                onClick={() => showToast('Selected accounts placed on hold', 'warning')}
                className="px-3 py-1 rounded bg-error text-on-error font-label-sm text-label-sm font-bold hover:brightness-110 transition-colors"
                type="button"
              >
                Suspend Selected
              </button>
            </div>
          </div>
        )}

        {/* Parents Data Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/70 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider select-none">
                  <th className="py-3.5 pl-space-md pr-3 w-10">
                    <input
                      checked={selectedRowIds.length === parentsList.length && parentsList.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                      type="checkbox"
                    />
                  </th>
                  <th className="py-3.5 px-space-md font-bold">Parent / Primary Guardian</th>
                  <th className="py-3.5 px-space-md font-bold">Contact &amp; Verification</th>
                  <th className="py-3.5 px-space-md font-bold">Monitored Children</th>
                  <th className="py-3.5 px-space-md font-bold">Subscription Tier</th>
                  <th className="py-3.5 px-space-md font-bold">Account Status</th>
                  <th className="py-3.5 px-space-md font-bold">Registered</th>
                  <th className="py-3.5 pr-space-md pl-space-sm text-right font-bold">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-md text-body-md text-on-surface">
                {filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-surface-container-low/40 transition-colors group">
                    <td className="py-4 pl-space-md pr-3">
                      <input
                        checked={selectedRowIds.includes(parent.id)}
                        onChange={() => handleRowSelect(parent.id)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-4 px-space-md">
                      <div className="flex items-center gap-space-sm min-w-[200px]">
                        <img
                          alt={parent.name}
                          className="w-10 h-10 rounded-full object-cover shadow-2xs"
                          src={parent.avatar}
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                              {parent.name}
                            </span>
                            {parent.isVIP && (
                              <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed/40 text-tertiary font-label-sm text-[10px] font-bold">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="font-label-sm text-label-sm text-primary font-medium">{parent.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-space-md min-w-[220px]">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-on-surface font-label-md text-label-md">
                          <span className="truncate">{parent.email}</span>
                          <span className="material-symbols-outlined text-[15px] text-tertiary shrink-0">verified</span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">{parent.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-space-md min-w-[230px]">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-md text-label-md text-on-surface font-bold">
                            {parent.childrenCount} {parent.childrenCount === 1 ? 'Child' : 'Children'}
                          </span>
                          <span className="text-outline-variant">•</span>
                          <span className="font-label-sm text-label-sm text-tertiary font-semibold">Active Geofences</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {parent.childrenNames.map((cName, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface font-semibold"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                              {cName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-space-md min-w-[170px]">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold w-fit ${
                            parent.status === 'Suspended'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-primary-container/10 text-primary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {parent.status === 'Suspended' ? 'credit_card_off' : 'star'}
                          </span>
                          {parent.subscriptionTier}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">{parent.pricing}</span>
                      </div>
                    </td>
                    <td className="py-4 px-space-md min-w-[160px]">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                          parent.status.includes('Active')
                            ? 'bg-tertiary-fixed/30 text-tertiary'
                            : parent.status.includes('Pending')
                            ? 'bg-surface-container-high text-on-surface'
                            : 'bg-error-container/30 text-error'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            parent.status.includes('Active')
                              ? 'bg-tertiary'
                              : parent.status.includes('Pending')
                              ? 'bg-outline'
                              : 'bg-error'
                          }`}
                        ></span>
                        <span>{parent.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-space-md text-on-surface-variant font-label-sm text-label-sm whitespace-nowrap">
                      <div className="font-semibold text-on-surface">{parent.registeredDate}</div>
                      <div className="text-[11px] text-outline font-mono">{parent.registeredTime}</div>
                    </td>
                    <td className="py-4 pr-space-md pl-space-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => showToast(`Opening profile for ${parent.name}`, 'info')}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                          title="View Profile"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        {parent.status === 'Suspended' ? (
                          <button
                            onClick={() => handleStatusChange(parent.id, 'Active & Verified')}
                            className="p-1.5 rounded-lg text-tertiary hover:bg-tertiary/10 transition-colors"
                            title="Unsuspend / Re-enable"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">lock_open</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => showToast(`Impersonating guardian session for ${parent.name}`, 'warning')}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                            title="Impersonate Guardian Session"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">switch_account</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
