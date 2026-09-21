import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/parent/ParentLayout';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function ParentProfile() {
  const { showToast } = useApp();
  const [profile, setProfile] = useState({
    id: 'GKD-94022-FAM',
    name: 'David Miller',
    email: 'david.miller@familycloud.org',
    phone: '+1 (555) 349-2810',
    role: 'Primary Family Administrator',
    location: 'Maplewood, NJ',
    address: '42 Elmwood Terrace, Maplewood, NJ',
    memberSince: 'Jan 2023',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKiKXstfjeOZrHO1qTfezZSD638hLho5uuQRsg5zDCKeN2sSnW-ZbbSEXytpBDy7az2kvAgUY_L9OgVv4BVX7eDwx8Be2nyYqMOZ6iV-FbzgGxLr8a_lh_tgBlMZe_7UFRGOC_r6q4kJu_pT4f5p7Dknk9P4YuaCRNSZDwgLTUHM463AdtlPD4Is6QQuBf8L2_GyUSlSFNDRRVeTjAxEsuy9QIssE3jb8BCOYxpLd8vs89Oj35zL6w',
    securityScore: 98,
    is2FAEnforced: true,
    lastPasswordRotation: '3 weeks ago',
    activePlan: 'Family Shield Premium (5/5 Devices Paired)',
    emergencyContact: {
      name: 'Sarah Miller',
      relationship: 'Spouse / Secondary Guardian',
      phone: '+1 (555) 349-2811'
    }
  });

  const [guardians, setGuardians] = useState([
    {
      id: 2,
      name: 'Sarah Miller',
      email: 'sarah.miller@familycloud.org',
      role: 'Secondary Admin',
      initials: 'SM',
      permissions: ['Live Screen View', 'App Approvals']
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getParentProfile();
        if (res.success && res.data) {
          setProfile(res.data.profile);
          setGuardians(res.data.guardians);
          setFormData(res.data.profile);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateParentProfile(formData);
      if (res.success) {
        setProfile(res.data);
        setIsEditing(false);
        showToast('Parent Profile changes saved successfully!', 'success');
      }
    } catch (err) {
      showToast('Profile updated locally', 'success');
      setProfile(formData);
      setIsEditing(false);
    }
  };

  return (
    <ParentLayout>
      <div className="flex flex-col w-full max-w-7xl mx-auto gap-space-lg pb-space-xl">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Parent Profile &amp; Account
              </h1>
              <span className="inline-flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Primary Family Administrator
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage your personal credentials, family administrator role, and linked guardian accounts.
            </p>
          </div>

          {/* Active Plan Pill Badge */}
          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-sm rounded-xl self-start lg:self-auto shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Active Protection Tier</span>
              <span className="font-title-sm text-title-sm text-on-surface font-bold">
                Family Shield Premium <span className="text-tertiary font-semibold">(5/5 Devices Paired)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Profile Overview Header Card */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-xs p-space-lg">
          <div className="absolute -right-16 -top-16 w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-space-lg">
            <div className="flex flex-col md:flex-row items-center gap-space-lg text-center md:text-left">
              {/* Avatar with Overlay Button */}
              <div className="relative group">
                <img
                  alt="David Miller profile photo"
                  className="w-28 h-28 rounded-full object-cover shadow-md ring-4 ring-surface-container-low"
                  src={profile.avatarUrl}
                />
                <button
                  onClick={() => showToast('Avatar upload dialog opened', 'info')}
                  className="absolute inset-0 rounded-full bg-inverse-surface/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-inverse-on-surface gap-0.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                  <span className="font-label-sm text-[10px]">Update</span>
                </button>
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary ring-2 ring-surface-container-lowest shadow-2xs font-bold">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-center md:justify-start gap-space-sm flex-wrap">
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">{profile.name}</h2>
                  <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
                    Primary Guardian / Billing Owner
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center md:justify-start gap-1">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  ID: {profile.id} • {profile.location}
                </p>

                {/* Quick Stats Row */}
                <div className="flex items-center justify-center md:justify-start gap-space-md pt-space-xs text-on-surface-variant flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">child_care</span>
                    <span className="font-title-sm text-title-sm text-on-surface font-bold">3</span>
                    <span className="font-body-sm text-body-sm">Connected Children</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary">devices</span>
                    <span className="font-title-sm text-title-sm text-on-surface font-bold">4</span>
                    <span className="font-body-sm text-body-sm">Paired Devices</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">calendar_month</span>
                    <span className="font-body-sm text-body-sm">
                      Member since <strong className="text-on-surface font-bold">{profile.memberSince}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-space-sm self-stretch md:self-auto justify-center">
              <button
                onClick={() => showToast('Password reset link dispatched to your verified email', 'info')}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 bg-surface-container-low text-primary px-4 py-2.5 rounded-xl font-title-sm text-title-sm font-bold hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>Change Password</span>
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-title-sm text-title-sm font-bold hover:bg-primary-container transition-colors shadow-md cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>{isEditing ? 'Close Editing' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Profile Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* COLUMN 1: Personal & Contact Information Card */}
          <div className="lg:col-span-6 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-xs">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">Personal &amp; Contact Information</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Authorized parental identity details
                  </span>
                </div>
              </div>
              <span className="bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded-md font-label-sm text-label-sm font-bold">
                Primary
              </span>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-space-md">
              {/* Full Name */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="full-name">
                  Full Legal Name
                </label>
                <div className="relative">
                  <input
                    id="full-name"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/30 transition-colors"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-[18px]">
                    edit
                  </span>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="email-address">
                    Email Address
                  </label>
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-bold">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Verified
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="email-address"
                    readOnly
                    value={formData.email}
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none cursor-not-allowed opacity-80"
                    type="email"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-tertiary text-[18px]">
                    check_circle
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  All real-time breach warnings and billing receipts are dispatched here.
                </p>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="phone-number">
                    Mobile Phone (Emergency SMS)
                  </label>
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-bold">
                    <span className="material-symbols-outlined text-[14px]">sms</span>
                    SMS Alert Enabled
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="phone-number"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none border border-outline-variant/30"
                    type="tel"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-tertiary text-[18px]">
                    check_circle
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Receives instantaneous SOS notifications and geofence breach pings.
                </p>
              </div>

              {/* Home Address / Primary Geofence */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="address">
                    Home Address / Primary Geofence Hub
                  </label>
                  <span className="font-label-sm text-label-sm text-primary font-bold">Radius: 300m Safe Zone</span>
                </div>
                <div className="relative">
                  <input
                    id="address"
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none border border-outline-variant/30"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-primary text-[18px]">
                    home_pin
                  </span>
                </div>
              </div>

              {/* Emergency Contact Card Sub-block */}
              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                    Primary Emergency Contact
                  </span>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                    Automated Failover
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-bold">
                      {profile.emergencyContact.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {profile.emergencyContact.relationship} • {profile.emergencyContact.phone}
                    </span>
                  </div>
                  <button
                    onClick={() => showToast('Edit emergency contact modal opened', 'info')}
                    className="p-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </div>

              {/* Save button row */}
              {isEditing && (
                <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                  <button
                    onClick={() => {
                      setFormData(profile);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-title-sm text-title-sm transition-colors"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-primary text-on-primary px-5 py-2 rounded-lg font-title-sm text-title-sm font-bold hover:bg-primary-container transition-colors shadow-2xs"
                    type="submit"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* COLUMN 2: Family Security & Linked Guardians */}
          <div className="lg:col-span-6 flex flex-col gap-space-lg">
            {/* Co-Parent / Secondary Guardian Access Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">supervisor_account</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      Co-Parent &amp; Guardian Access
                    </h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Manage delegate oversight permissions
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Invitation code generated for secondary guardian', 'success')}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-md text-label-md font-bold transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">group_add</span>
                  <span>Invite</span>
                </button>
              </div>

              {/* Linked Guardian List Item */}
              {guardians.map((g) => (
                <div
                  key={g.id}
                  className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-space-md"
                >
                  <div className="flex items-center gap-space-md">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-secondary-container text-on-secondary-container font-title-sm text-title-sm flex items-center justify-center font-bold">
                        {g.initials}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary rounded-full ring-2 ring-surface-container-lowest"></span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-title-sm text-title-sm text-on-surface font-bold">{g.name}</span>
                        <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {g.role}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{g.email}</span>
                      <div className="flex items-center gap-2 pt-1">
                        {g.permissions.map((perm, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 font-label-sm text-[11px] text-tertiary font-semibold"
                          >
                            <span className="material-symbols-outlined text-[14px]">check</span> {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => showToast(`Guardian permissions modal opened for ${g.name}`, 'info')}
                      className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface transition-colors"
                      title="Edit Permissions"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">tune</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add guardian CTA button */}
              <button
                onClick={() => showToast('Invite link generated and copied to clipboard!', 'success')}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-outline-variant hover:bg-surface-container-low text-primary font-title-sm text-title-sm flex items-center justify-center gap-2 transition-colors font-bold"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Invite Co-Parent, Grandparent, or Babysitter</span>
              </button>
            </div>

            {/* Account Security Status Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">Account Security Status</h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Two-factor credentials &amp; health diagnostics
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[14px]">verified</span> 98% High
                </span>
              </div>

              {/* Security Gauge + Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Security Health</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-sm text-headline-sm text-tertiary font-bold">98%</span>
                    <span className="font-label-sm text-label-sm text-tertiary font-bold">Optimal</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-tertiary-container h-full rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Last Password Rotation</span>
                  <span className="font-title-md text-title-md text-on-surface font-bold">3 weeks ago</span>
                  <span className="font-body-sm text-body-sm text-tertiary font-semibold">Strong Entropy</span>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Active 2FA Method</span>
                  <div className="flex items-center gap-1 text-primary font-title-sm text-title-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">phonelink_lock</span>
                    <span>Google Auth</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-tertiary font-semibold">Enforced</span>
                </div>
              </div>
            </div>

            {/* Data Privacy, COPPA Compliance & Danger Zone */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">policy</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      Data Privacy &amp; COPPA Compliance
                    </h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Cryptographic keying and statutory compliance
                    </span>
                  </div>
                </div>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">
                  COPPA Certified
                </span>
              </div>

              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between p-space-md bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-[22px]">enhanced_encryption</span>
                    <div className="flex flex-col">
                      <span className="font-title-sm text-title-sm text-on-surface font-bold">
                        Child Data Encryption Key
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Valid (AES-256 P2P Zero-Knowledge Architecture)
                      </span>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span> Active Key
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-space-md bg-surface-container-low rounded-xl gap-space-sm">
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-bold">
                      Export Family Activity Logs
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Download tamper-evident telemetry archives (CSV / PDF format).
                    </span>
                  </div>
                  <button
                    onClick={() => showToast('Activity log archive dispatched to downloads', 'success')}
                    className="inline-flex items-center gap-1.5 bg-surface-container-lowest text-primary px-3.5 py-2 rounded-lg font-title-sm text-title-sm hover:bg-surface-container transition-colors shadow-2xs whitespace-nowrap font-bold"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Download Logs</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone Section */}
              <div className="mt-space-xs p-space-md rounded-xl bg-error-container/40 flex flex-col gap-space-sm border border-error/20">
                <div className="flex items-center gap-space-sm text-error">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span className="font-title-sm text-title-sm font-bold">Administrative Danger Zone</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Transferring ownership assigns billing and master override rights to another verified guardian. Account deactivation severs all child device monitoring connections immediately.
                </p>
                <div className="flex items-center gap-space-sm pt-1 flex-wrap">
                  <button
                    onClick={() => showToast('Ownership transfer dialog opened', 'info')}
                    className="bg-surface-container-lowest text-on-surface hover:text-error px-3.5 py-2 rounded-lg font-title-sm text-title-sm shadow-2xs transition-colors cursor-pointer font-bold"
                    type="button"
                  >
                    Transfer Ownership
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to deactivate parental management?')) {
                        showToast('Deactivation request logged', 'warning');
                      }
                    }}
                    className="bg-error text-on-error px-3.5 py-2 rounded-lg font-title-sm text-title-sm hover:bg-on-error-container transition-colors shadow-2xs cursor-pointer font-bold"
                    type="button"
                  >
                    Deactivate Parent Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
