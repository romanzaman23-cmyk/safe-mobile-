import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function AdminAddAdmin() {
  const { showToast } = useApp();
  const [adminsList, setAdminsList] = useState([]);
  const [formData, setFormData] = useState({
    name: 'Jordan Miller',
    email: 'jordan.miller@guardiannest.internal',
    phone: '+1 (555) 019-2831',
    department: 'secops',
    role: 'safety_analyst',
    password: 'GuardNest#2025!SecOps',
    forceRotation: true,
    mandatoryFido: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await api.getAdminList();
      if (res.success && res.data) {
        setAdminsList(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.addAdminUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        role: formData.role,
        mfaType: formData.mandatoryFido ? 'YubiKey FIDO2 (Active)' : 'TOTP App (Enforced)'
      });

      if (res.success) {
        showToast(res.message, 'success');
        fetchAdmins();
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: 'secops',
          role: 'safety_analyst',
          password: 'GuardNest#2025!SecOps',
          forceRotation: true,
          mandatoryFido: true
        });
      }
    } catch (err) {
      showToast('Failed to add administrator', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-space-xl py-space-lg flex flex-col gap-space-xl">
        {/* Top Action Breadcrumb & System State Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md mb-1">
              <span className="text-secondary font-bold">Access Control</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>Internal Identity &amp; IAM</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-bold">New Provisioning</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">
              Add New Administrator
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-1">
              Provision internal staff, security analysts, and support admins with granular role-based access control (RBAC), enforced multi-factor authentication, and strict compliance logging.
            </p>
          </div>

          {/* Quick Telemetry Badge Cluster */}
          <div className="flex items-center gap-space-sm self-start md:self-auto bg-surface-container-low p-2 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded-lg shadow-2xs">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Active Super Admins</span>
                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                  {adminsList.length} / 10 Max
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded-lg shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface font-bold">FIPS 140-2 Compliant</span>
            </div>
          </div>
        </div>

        {/* Main Creation Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: Identity, Credentials (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Primary Identity Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      1. Identity &amp; Organizational Placement
                    </h2>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Internal legal details &amp; high-priority escalation routing
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-mono font-bold">
                  STEP 1 OF 2
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-label-lg text-label-lg text-on-surface font-bold flex items-center justify-between" htmlFor="adminName">
                    <span>Full Legal Name <span className="text-error">*</span></span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">First &amp; Last</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">person</span>
                    <input
                      id="adminName"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jordan Miller"
                      className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 shadow-2xs transition-all"
                      type="text"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface font-bold" htmlFor="adminEmail">
                      Work Email Address <span className="text-error">*</span>
                    </label>
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/25 px-2 py-0.5 rounded font-bold">
                      <span className="material-symbols-outlined text-[13px]">domain_verification</span> Domain Verified
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">mail</span>
                    <input
                      id="adminEmail"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jordan.miller@guardiannest.internal"
                      className="w-full h-11 pl-10 pr-24 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 shadow-2xs transition-all"
                    />
                    <span className="absolute right-3 font-label-sm text-label-sm text-outline uppercase font-mono font-bold">
                      INTERNAL
                    </span>
                  </div>
                </div>

                {/* Emergency Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface font-bold" htmlFor="adminPhone">
                    Escalation Mobile <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">phone_iphone</span>
                    <input
                      id="adminPhone"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2831"
                      className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 shadow-2xs transition-all"
                    />
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Used for direct Level-3 SOS paging overrides.
                  </span>
                </div>

                {/* Operational Unit */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface font-bold" htmlFor="adminDept">
                    Operational Unit <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">corporate_fare</span>
                    <select
                      id="adminDept"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 shadow-2xs appearance-none transition-all cursor-pointer"
                    >
                      <option value="secops">SecOps / Child Safety Escalations</option>
                      <option value="support">Customer Success &amp; Parents Support</option>
                      <option value="compliance">Compliance &amp; Legal Regulatory</option>
                      <option value="devops">Infrastructure &amp; Platform DevOps</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 pointer-events-none text-outline text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Initial Access Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm pb-space-xs">
                <div className="w-9 h-9 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary font-bold">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Initial Password &amp; Cryptographic Guardrails
                  </h2>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Sets temporary seed passphrase adhering to SecOps password policy
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-label-lg text-label-lg text-on-surface font-bold" htmlFor="adminPassword">
                    Temporary Master Passphrase
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">key</span>
                    <input
                      id="adminPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md font-mono border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-2xs transition-all"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-outline hover:text-on-surface p-1"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Complexity Matrix */}
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                    Passphrase Complexity Benchmark
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary font-bold">100% Meets Strict Standards</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden flex gap-1">
                  <div className="h-full w-1/4 bg-tertiary rounded-full"></div>
                  <div className="h-full w-1/4 bg-tertiary rounded-full"></div>
                  <div className="h-full w-1/4 bg-tertiary rounded-full"></div>
                  <div className="h-full w-1/4 bg-tertiary rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-bold text-tertiary font-label-sm text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span> Min. 12 Chars
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span> Uppercase (A-Z)
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span> Digits (0-9)
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span> Symbols (!@#$)
                  </div>
                </div>
              </div>

              {/* Security Flags */}
              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <input
                    checked={formData.forceRotation}
                    onChange={(e) => setFormData({ ...formData, forceRotation: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    type="checkbox"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                      Force Immediate Password Rotation on First Session
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      The administrator will be locked into an ephemeral credential-swap terminal upon initial sign-in.
                    </span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <input
                    checked={formData.mandatoryFido}
                    onChange={(e) => setFormData({ ...formData, mandatoryFido: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    type="checkbox"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                      Mandatory Hardware Security Key / FIDO2 Authenticator Setup
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Access will be blocked until hardware token (YubiKey) or TOTP authenticator is bonded.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Role Selection & Overrides (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold">
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      2. Role Selection (RBAC)
                    </h2>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Assign administrative operational scope
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-mono font-bold">
                  PRESET
                </span>
              </div>

              {/* Roles Stack */}
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    id: 'super_admin',
                    title: 'Super Admin',
                    badge: 'Root Clearance',
                    badgeColor: 'text-error bg-error-container/30',
                    desc: 'Full unrestricted root authorization across all child records, raw geofencing telemetries, infrastructure provisioning, and billing vaults.'
                  },
                  {
                    id: 'safety_analyst',
                    title: 'Safety & Security Analyst',
                    badge: 'SecOps Live',
                    badgeColor: 'text-tertiary bg-tertiary-fixed/20',
                    desc: 'Live real-time SOS feeds, geofence breaches, hardware tamper pings, and emergency parent dispatches. Excludes billing modifications.'
                  },
                  {
                    id: 'parent_support',
                    title: 'Parent Support Specialist',
                    badge: 'L2 Triage',
                    badgeColor: 'text-secondary bg-secondary-fixed/50',
                    desc: 'Ticket triage, device pairing troubleshooting, account resets. Child geo-location is strictly masked for privacy assurance.'
                  },
                  {
                    id: 'compliance_officer',
                    title: 'Compliance & Audit Officer',
                    badge: 'Read-Only',
                    badgeColor: 'text-on-surface-variant bg-surface-container-high',
                    desc: 'Read-only immutable access to COPPA, GDPR-K, and FERPA regulatory logs, staff audit trails, and automated deletion confirmations.'
                  }
                ].map((role) => (
                  <label
                    key={role.id}
                    className={`relative flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                      formData.role === role.id
                        ? 'bg-primary/5 border-primary/40 shadow-xs'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <input
                      name="adminRole"
                      type="radio"
                      value={role.id}
                      checked={formData.role === role.id}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mt-1 accent-primary text-primary"
                    />
                    <div className="flex flex-col flex-1 pr-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-lg text-label-lg text-on-surface font-bold">{role.title}</span>
                        <span className={`font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${role.badgeColor}`}>
                          {role.badge}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{role.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions (12 cols) */}
          <div className="lg:col-span-12 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-start gap-space-sm max-w-2xl">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">mark_email_read</span>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">Automated Credential Dispatch</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  An invitation email with a time-sensitive setup link (strictly expires in 24 hours) will be dispatched to the address above. All onboarding steps are signed by the GuardianNest HSM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-sm w-full md:w-auto shrink-0 justify-end">
              <button
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] font-label-lg text-label-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer font-bold"
                type="submit"
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                <span>{submitting ? 'Provisioning...' : 'Add Admin User'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Audit Table Section */}
        <div className="flex flex-col gap-space-sm mt-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Recently Added Administrators
                </h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Immutable administrative staff ledger for security compliance audits
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-3 px-space-md font-bold">Administrator Identity</th>
                    <th className="py-3 px-space-md font-bold">Assigned Role &amp; Clearances</th>
                    <th className="py-3 px-space-md font-bold">Department</th>
                    <th className="py-3 px-space-md font-bold">MFA &amp; Key Status</th>
                    <th className="py-3 px-space-md font-bold">Provisioned Timestamp</th>
                    <th className="py-3 px-space-md font-bold text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/50 font-body-sm text-body-sm text-on-surface">
                  {adminsList.map((adm) => (
                    <tr key={adm.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <img alt={adm.name} className="w-9 h-9 rounded-full object-cover shadow-2xs" src={adm.avatar} />
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-bold">{adm.name}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">{adm.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-space-md">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                            adm.role === 'Super Admin'
                              ? 'bg-error-container/30 text-error'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {adm.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-space-md font-bold text-on-surface">{adm.department}</td>
                      <td className="py-3.5 px-space-md">
                        <span className="inline-flex items-center gap-1 text-tertiary font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[16px]">token</span>
                          {adm.mfaStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-space-md text-on-surface-variant font-mono">{adm.timestamp}</td>
                      <td className="py-3.5 px-space-md text-right">
                        <button
                          onClick={() => showToast(`Audit log opened for ${adm.name}`, 'info')}
                          className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant"
                          title="View Audit Logs"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">history</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
