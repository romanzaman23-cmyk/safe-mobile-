import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function AdminAllChildren() {
  const { showToast } = useApp();
  const [childrenList, setChildrenList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');

  const fetchChildren = async () => {
    try {
      const res = await api.getAdminChildren();
      if (res.success && res.data) {
        setChildrenList(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDeviceFilter('all');
    setAgeFilter('all');
    setZoneFilter('all');
    showToast('Filters reset', 'info');
  };

  const filteredList = childrenList.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.parentName.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.device.toLowerCase().includes(query);

    const matchesDevice = !deviceFilter || deviceFilter === 'all' || c.deviceType === deviceFilter;

    return matchesQuery && matchesDevice;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col w-full max-w-[1720px] mx-auto pb-space-xl">
        {/* Dynamic Top Ambient Accent & Header */}
        <div className="relative w-full overflow-hidden px-4 lg:px-space-lg pt-space-lg pb-space-md">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  ENTERPRISE DIRECTORY FLEET
                </span>
                <span className="text-outline font-label-sm text-label-sm">•</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">SecOps Console v4.19</span>
              </div>
              <div className="flex items-baseline gap-space-sm">
                <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                  Registered Children Directory
                </h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-label-md shadow-2xs">
                  <span className="material-symbols-outlined text-[15px] text-primary">groups_3</span>
                  <span className="font-bold text-on-surface">{childrenList.length}</span>
                  <span className="text-on-surface-variant font-normal">Enrolled</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Real-time hardware telemetry, parental liaison records, and boundary governance across the connected ecosystem.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
              <button
                onClick={() => showToast('Exported children directory CSV', 'success')}
                className="inline-flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all font-label-lg text-label-lg shadow-xs font-bold"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Broadcast emergency alert to all 42,190 monitored child endpoints?')) {
                    showToast('Emergency push alert broadcasted!', 'warning');
                  }
                }}
                className="inline-flex items-center gap-space-xs px-4 py-2 rounded-lg bg-error text-on-error hover:bg-error/90 transition-all font-label-lg text-label-lg shadow-xs font-bold"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
                <span className="tracking-wide">Emergency Broadcast</span>
              </button>
            </div>
          </div>

          {/* Key Telemetry Spark Cards Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mt-space-lg">
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Active GPS Tracing
                </span>
                <span className="w-8 h-8 rounded-lg bg-tertiary-fixed/30 text-tertiary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">38,842</span>
                <span className="text-tertiary font-label-sm text-label-sm font-bold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 92.1%
                </span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-tertiary h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Geofence Compliance
                </span>
                <span className="w-8 h-8 rounded-lg bg-primary-container/15 text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">41,908</span>
                <span className="text-primary font-label-sm text-label-sm font-bold">In Safe Haven</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '99.3%' }}></div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Low Battery Warning
                </span>
                <span className="w-8 h-8 rounded-lg bg-secondary-container/20 text-on-secondary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">battery_alert</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">312</span>
                <span className="text-outline font-label-sm text-label-sm">&lt; 20% SoC</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-secondary-container h-full rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Zone Anomalies
                </span>
                <span className="w-8 h-8 rounded-lg bg-error-container/40 text-error flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">fmd_bad</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-headline-xl text-headline-xl text-error font-bold tracking-tight">14</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
                  ATTN REQ
                </span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-error h-full rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Multifaceted Query Console */}
        <div className="px-4 lg:px-space-lg pb-space-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-md flex flex-col gap-space-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm">
              <div className="lg:col-span-5 relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                  manage_search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-20 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all"
                  placeholder="Search by child name, parent, device ID, IMEI..."
                  type="text"
                />
                <div className="absolute right-2.5 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] font-mono uppercase">
                    ESC
                  </span>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="relative">
                  <select
                    value={deviceFilter}
                    onChange={(e) => setDeviceFilter(e.target.value)}
                    className="w-full h-11 px-3 py-2 appearance-none rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 cursor-pointer pr-9"
                  >
                    <option value="all">Device: All Types</option>
                    <option value="ios">Device: iOS Devices</option>
                    <option value="android">Device: Android Ecosystem</option>
                    <option value="tablet">Device: School Tablet</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-outline text-[18px] pointer-events-none">
                    devices
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex items-center justify-end">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-bold transition-colors"
                  type="button"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Fleet Directory Table */}
        <div className="px-4 lg:px-space-lg py-space-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none">
                    <th className="py-3.5 pl-6 pr-3 w-12 font-bold">Select</th>
                    <th className="py-3.5 px-4 font-bold">Child &amp; Identity</th>
                    <th className="py-3.5 px-4 font-bold">Parent / Guardian Contact</th>
                    <th className="py-3.5 px-4 font-bold">Primary Device &amp; OS</th>
                    <th className="py-3.5 px-4 font-bold">Hardware Telemetry</th>
                    <th className="py-3.5 px-4 font-bold">Supervision State</th>
                    <th className="py-3.5 px-4 font-bold">Last Ping</th>
                    <th className="py-3.5 pr-6 pl-4 text-right font-bold">Quick SecOps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-body-md text-body-md text-on-surface">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-on-surface-variant font-body-md">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[36px] text-outline">devices_other</span>
                          <span className="font-bold text-on-surface text-title-sm">No Child Endpoints Found</span>
                          <span className="text-body-sm text-on-surface-variant">Child devices paired by parents in the Parent Portal will reflect here in real-time.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((child) => (
                    <tr key={child.id} className="hover:bg-surface-container-low/60 transition-colors group">
                      <td className="py-4 pl-6 pr-3">
                        <input className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary" type="checkbox" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            alt={child.name}
                            className="w-10 h-10 rounded-full object-cover shadow-2xs"
                            src={child.avatar}
                          />
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                                {child.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] uppercase font-bold">
                                {child.age}y • {child.gender}
                              </span>
                            </div>
                            <span className="font-body-sm text-body-sm text-outline font-mono">{child.code}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">{child.parentName}</span>
                          <span className="font-body-sm text-body-sm text-primary">{child.parentEmail}</span>
                          <span className="font-body-sm text-body-sm text-outline font-mono">{child.parentPhone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant font-bold">
                            <span className="material-symbols-outlined text-[18px]">
                              {child.deviceType === 'ios' ? 'phone_iphone' : child.deviceType === 'tablet' ? 'tablet_android' : 'smartphone'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface font-bold">{child.device}</span>
                            <span className="font-body-sm text-body-sm text-outline">{child.os}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-label-md text-label-md font-bold ${child.battery < 20 ? 'text-error' : 'text-on-surface'}`}>
                              {child.battery}%
                            </span>
                            <div className="w-16 bg-surface-container rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${child.battery < 20 ? 'bg-error' : 'bg-tertiary'}`}
                                style={{ width: `${child.battery}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-outline font-label-sm text-[11px]">
                            <span>{child.signal}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                              child.battery < 20
                                ? 'bg-error-container text-on-error-container'
                                : 'bg-tertiary-fixed/20 text-tertiary'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {child.supervisionState}
                          </span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-primary">pin_drop</span>
                            {child.safeZone}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-semibold">{child.lastPing}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-6 pl-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => showToast(`Live GPS tracing opened for ${child.name}`, 'info')}
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                            title="View Live Telemetry Map"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">share_location</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
