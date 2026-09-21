import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function Home() {
  const { user, guardian, usage, telemetry, permissions, showToast } = useApp();
  const [requesting, setRequesting] = useState(false);

  const handleAskTime = async () => {
    setRequesting(true);
    try {
      const res = await api.requestTimeExtension(30);
      showToast(res.message || 'Request for +30 mins sent to parent!');
    } catch (err) {
      showToast('Error sending extension request', 'error');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl">
      <Header title="Home" />

      <main className="flex-1 flex flex-col relative w-full px-margin pt-20 pb-24 bg-surface">
        <div className="flex flex-col w-full gap-y-4">
          
          {/* Real-time Device Locked Overlay Banner */}
          {user?.isLocked && (
            <div className="w-full bg-error-container text-on-error-container rounded-2xl p-space-md shadow-lg border-2 border-error/40 flex flex-col gap-2.5 animate-pulse">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[28px] text-error font-bold">lock</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-error font-bold">Device Locked by Parent</h3>
                  <p className="font-body-sm text-body-sm text-on-error-container">
                    {guardian?.name || 'Your Parent'} has temporarily locked this device. Emergency dial is still active.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Welcome User Banner */}
          <div className="flex items-center justify-between w-full pt-1">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                  src={user?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVkF5KNU6QvzBmGaIlNppvSMvpeWYpDf69rkcfJp_E8TdJTKHgYdrtVcqk3rb-KNXscVTbRt6LveBICubGbeAIGQElq9JTlVqAmre_H7vwaEA9wpqK5xxJRHqpeFlcWgsaeBud7tohMNmpwVUaWQt_4oKWR9fn84APbe0CjqOh1N0aMF1gIup_BPewKdtci3P3_lWvNnqMM7NiB9wyfhgA4wPLDSXpjWKZ0m8uagM9mjW1z0yf2TiT'}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary rounded-full ring-2 ring-surface-container-lowest"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                  Hello, {user?.name ? user.name.split(' ')[0] : 'Companion'}! 👋
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified_user
                    </span>
                    {guardian?.name || 'Active Guardian'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/permission-success"
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2 w-4 h-4 bg-error text-on-error rounded-full font-label-sm text-[10px] flex items-center justify-center leading-none font-bold">
                  1
                </span>
              </Link>
              <Link
                to="/settings"
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">settings</span>
              </Link>
            </div>
          </div>

          {/* Hero Device Status Card */}
          <Link
            to="/device-info"
            className="w-full rounded-2xl bg-gradient-to-br from-primary to-secondary p-space-md text-on-primary shadow-lg relative overflow-hidden block transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-surface-container-lowest/10 pointer-events-none blur-xl"></div>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-container-lowest/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-fixed text-[18px]">phone_android</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold">Device Status</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/40 text-on-tertiary font-label-sm text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
                <span>{user?.isLocked ? 'Locked' : 'Connected'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center text-tertiary-fixed">
                  <span className="material-symbols-outlined text-[20px]">battery_charging_full</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-primary-fixed/80">Battery</span>
                  <span className="font-label-lg text-label-lg font-bold text-on-primary truncate">
                    {user?.battery || telemetry?.battery_percent || 90}% {telemetry?.battery_status || 'Good'}
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center text-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">wifi</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-primary-fixed/80">Network</span>
                  <span className="font-label-lg text-label-lg font-bold text-on-primary truncate">
                    {telemetry?.network_name || 'Home-Fiber-5G'}
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center text-secondary-fixed">
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-primary-fixed/80">Last Sync</span>
                  <span className="font-label-lg text-label-lg font-bold text-on-primary truncate">Live</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center text-tertiary-fixed">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-primary-fixed/80">Monitoring</span>
                  <span className="font-label-lg text-label-lg font-bold text-on-primary truncate">
                    {user?.isLocked ? 'Lock Enforced' : 'Protection Active'}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Screen Time Today Card */}
          <Link
            to="/usage"
            className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm block hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">timelapse</span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">Screen Time Today</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                1h 15m <span className="text-outline">/ 3h 30m</span>
              </span>
            </div>
            <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-secondary-container h-full rounded-full transition-all duration-500"
                style={{ width: `${usage?.screenTime?.percentUsed || 35}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2.5 pt-1 text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">bedtime</span>
                <span className="font-body-sm text-body-sm">Bedtime lock at 21:30</span>
              </div>
              <span className="font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                2h 15m left
              </span>
            </div>
          </Link>

          {/* Connected Parent Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Connected Parent</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed/30 text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-surface-container-low rounded-xl p-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  alt={guardian?.name || 'David Miller'}
                  className="w-11 h-11 rounded-full object-cover shadow-sm flex-shrink-0"
                  src={guardian?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKiKXstfjeOZrHO1qTfezZSD638hLho5uuQRsg5zDCKeN2sSnW-ZbbSEXytpBDy7az2kvAgUY_L9OgVv4BVX7eDwx8Be2nyYqMOZ6iV-FbzgGxLr8a_lh_tgBlMZe_7UFRGOC_r6q4kJu_pT4f5p7Dknk9P4YuaCRNSZDwgLTUHM463AdtlPD4Is6QQuBf8L2_GyUSlSFNDRRVeTjAxEsuy9QIssE3jb8BCOYxpLd8vs89Oj35zL6w'}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                    {guardian?.name || 'David Miller'}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {guardian?.email || 'david.miller@familycloud.org'}
                  </span>
                </div>
              </div>
              <Link
                to="/permissions"
                className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors shadow-sm font-label-md text-label-md font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">shield</span>
                <span>View</span>
              </Link>
            </div>
          </div>

          {/* Monitoring Status Grid */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Monitoring Status</h2>
              <Link to="/permissions" className="font-label-sm text-label-sm text-primary font-medium hover:underline">
                8 features live &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {permissions.slice(0, 8).map(perm => (
                <div
                  key={perm.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-[17px]">{perm.icon}</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">
                      {perm.name}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 font-label-sm text-label-sm font-bold ${
                      perm.is_allowed ? 'text-tertiary' : 'text-primary'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        perm.is_allowed ? 'bg-tertiary' : 'bg-primary animate-pulse'
                      }`}
                    ></span>
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Extension Request Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Need more time?</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Send a gentle request to {guardian?.name ? guardian.name.split(' ')[0] : 'Parent'} for 15, 30, or 60 extra minutes today.
                </p>
              </div>
            </div>
            <button
              onClick={handleAskTime}
              disabled={requesting}
              className="w-full h-12 rounded-full bg-gradient-to-r from-secondary-container to-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform font-bold cursor-pointer disabled:opacity-70"
            >
              <span className={`material-symbols-outlined text-[20px] ${requesting ? 'animate-spin' : ''}`}>
                {requesting ? 'sync' : 'hourglass_bottom'}
              </span>
              <span>{requesting ? 'Sending Request...' : 'Ask for More Time'}</span>
            </button>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}
