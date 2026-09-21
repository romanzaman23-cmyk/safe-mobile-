import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';

export default function Permissions() {
  const navigate = useNavigate();
  const { guardian, permissions, togglePermission } = useApp();

  const allowedCount = permissions.filter(p => p.is_allowed).length;
  const totalCount = permissions.length || 8;
  const percent = Math.round((allowedCount / totalCount) * 100);
  const remaining = totalCount - allowedCount;

  return (
    <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl">
      <Header title="Permissions" showBack={true} onBack={() => navigate('/')} />

      <main className="flex-1 flex flex-col relative w-full px-margin pt-20 pb-32 bg-surface">
        <div className="flex flex-col w-full gap-y-6 pb-6">
          
          {/* Header Intro */}
          <div className="flex flex-col gap-y-1.5">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span>Device Transparency</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              Parent Monitoring Permissions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Your parent has requested access to selected device information and monitoring features. Review the permissions below and allow the requested access.
            </p>
          </div>

          {/* Connected Parent Card */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                    alt="Ahmed Al-Salem"
                    src={guardian?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvzI4ce3AKR8qVc_dMQzKOCXLWlFNeWdHq2fl-Lzss6gwZhgE4A5qlCHN-dLAryjQirMUCGYMP1GJy8fZptYn_wHefiQUribBLBZLkPWmsnHxXBh_Dxa2ktkDvbGlf4NaQP-cTQjG1ho7V_0xvt5FwqiIXrjo_Oxmm1ekdJIrOO5HDNVyO9uxJaxix7XWPhLv9Lv0fJ45SlMmlJU-Z39MWwn80eKYYbv53jGrNNI41KPcE3TsK8YI5jQ'}
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-on-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </span>
                </div>
                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-lg text-label-lg text-on-surface truncate font-bold">
                      {guardian?.name || 'Ahmed Al-Salem'}
                    </span>
                    <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {guardian?.email || 'ahmed@example.com'}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary mt-0.5 font-semibold">
                    Family Organizer • Primary Guardian
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm shadow-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span>Active</span>
              </div>
            </div>
            <div className="mt-4 pt-3.5 flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">info</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Changes to these permissions can always be viewed together in your Family Trust dashboard.
              </p>
            </div>
          </div>

          {/* Setup Progress */}
          <div className="flex flex-col gap-y-3 rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Device Setup Progress</h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {allowedCount} of {totalCount} permissions enabled
                  </span>
                </div>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">{percent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-container transition-all duration-500"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span>{allowedCount} Approved</span>
              </div>
              {remaining > 0 ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[14px]">pending</span>
                  <span>{remaining} Pending Authorization</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Permissions List */}
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
                Required Privileges
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Updated Just Now</span>
            </div>

            <div className="flex flex-col gap-y-3">
              {permissions.map(perm => (
                <div
                  key={perm.id}
                  className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          perm.is_allowed
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                            : 'bg-surface-container text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">{perm.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-label-lg text-label-lg text-on-surface font-bold">{perm.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold flex items-center gap-0.5 ${
                              perm.is_allowed
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                : 'bg-error-container text-on-error-container'
                            }`}
                          >
                            {perm.is_allowed ? (
                              <>
                                <span className="material-symbols-outlined text-[12px]">check</span>
                                <span>Allowed</span>
                              </>
                            ) : (
                              'Not Allowed'
                            )}
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {perm.category}
                        </span>
                      </div>
                    </div>

                    {perm.is_allowed ? (
                      <button
                        onClick={() => togglePermission(perm.id, perm.is_allowed)}
                        className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1 flex-shrink-0 font-medium hover:bg-surface-container-high transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                        <span>Configured</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => togglePermission(perm.id, perm.is_allowed)}
                        className="px-4 py-1.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm active:scale-95 transition-all flex items-center gap-1 flex-shrink-0 font-bold cursor-pointer hover:bg-primary"
                      >
                        <span>Allow</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{perm.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="rounded-xl bg-surface-container-low p-4.5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-on-surface font-bold">
              <span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
              <span className="font-label-lg text-label-lg">Privacy Commitment</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              SafeShield protects your autonomy. Your personal messages, passwords, and private browsing data are never stored or transmitted without transparent end-to-end security flags.
            </p>
          </div>

          {/* Sticky Bottom Action */}
          <div className="sticky bottom-16 -mx-margin px-margin py-3.5 bg-surface/95 backdrop-blur-md z-40 shadow-lg flex flex-col gap-2">
            <Link
              to="/permission-success"
              className={`w-full h-12 rounded-full font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all font-bold ${
                remaining === 0
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-primary-container text-on-primary'
              }`}
            >
              <span>{remaining === 0 ? 'Complete Device Setup' : 'Continue to Confirmation'}</span>
              <span className="material-symbols-outlined text-[20px]">
                {remaining === 0 ? 'task_alt' : 'arrow_forward'}
              </span>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
              {remaining === 0
                ? 'All permissions configured! Ready for next step.'
                : `${remaining} permission${remaining > 1 ? 's' : ''} remain unconfigured.`}
            </p>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}
