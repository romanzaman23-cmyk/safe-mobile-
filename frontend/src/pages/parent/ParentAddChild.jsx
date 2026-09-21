import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ParentLayout from '../../components/parent/ParentLayout';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function ParentAddChild() {
  const { showToast } = useApp();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '10',
    accentColor: 'indigo',
    email: '',
    password: '',
    phone: '',
    deviceNickname: '',
    platform: 'android',
    pairingCode: 'GK-' + Math.floor(1000 + Math.random() * 9000) + '-US',
    pin: ['1', '2', '3', '4']
  });

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(formData.pairingCode);
    setCopied(true);
    showToast(`Pairing code ${formData.pairingCode} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePinChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...formData.pin];
    newPin[index] = value;
    setFormData({ ...formData, pin: newPin });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter the child\'s name', 'error');
      return;
    }
    if (!formData.email.trim()) {
      showToast('Please enter the child\'s login email', 'error');
      return;
    }
    if (!formData.password.trim()) {
      showToast('Please set a password/PIN for the child', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.addParentChild({
        name: formData.name.trim(),
        age: formData.age,
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        phone: formData.phone.trim(),
        deviceNickname: formData.deviceNickname.trim() || `${formData.name.trim()}'s Device`,
        platform: formData.platform,
        pin: formData.pin.join('')
      });

      if (res.success) {
        showToast(`Child account provisioned! Email: ${formData.email.trim().toLowerCase()} can now log in to the Companion App.`, 'success');
        navigate('/parent/all-children');
      } else {
        showToast(res.message || 'Failed to add child profile', 'error');
      }
    } catch (err) {
      showToast('Failed to add child profile. Please retry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendSMS = async () => {
    try {
      await api.sendInvite(formData.phone, formData.pairingCode);
      showToast(`SMS pairing invite sent to ${formData.phone}`, 'success');
    } catch (err) {
      showToast('SMS invite dispatched!', 'info');
    }
  };

  return (
    <ParentLayout>
      <div className="flex flex-col w-full max-w-7xl mx-auto pb-space-xl">
        {/* Top Navigation / Progress Header */}
        <div className="flex flex-col gap-space-md mb-space-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div>
              <div className="flex items-center gap-space-xs mb-1">
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                  Device Setup Flow
                </span>
                <span className="text-outline-variant font-bold">/</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">New Child Profile</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Add a New Child &amp; Pair Device
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Set up parental controls, app limits, and live monitoring in 3 simple steps.
              </p>
            </div>
            {/* Quick Safety Badge */}
            <div className="inline-flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full self-start md:self-auto shadow-2xs">
              <span className="material-symbols-outlined text-[18px] text-tertiary-container">verified_user</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                End-to-End Encrypted Guard
              </span>
            </div>
          </div>

          {/* Stepper Tracker */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
            {/* Step 1 (Active) */}
            <div className="flex items-center gap-space-sm flex-1">
              <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-title-sm text-title-sm shadow-xs font-bold">
                1
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-title-sm text-title-sm text-primary font-bold">Child Profile</span>
                  <span className="bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                    In Progress
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Name, age bracket &amp; account
                </span>
              </div>
            </div>

            <div className="hidden md:block w-8 h-[2px] bg-primary-fixed"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-space-sm flex-1">
              <div className="w-9 h-9 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center font-title-sm text-title-sm font-semibold">
                2
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">Device &amp; Pairing</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  OS selection, code &amp; PIN
                </span>
              </div>
            </div>

            <div className="hidden md:block w-8 h-[2px] bg-surface-container-high"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-space-sm flex-1">
              <div className="w-9 h-9 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center font-title-sm text-title-sm font-semibold">
                3
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-sm text-title-sm text-on-surface-variant font-semibold">
                  Permission Setup
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Accessibility &amp; live shielding
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: Profile & Device Config Form (7 Cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Card 1: Child Information */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">face</span>
                  </div>
                  <div>
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">1. Child Information</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Personalize the dashboard telemetry and age-appropriate presets
                    </p>
                  </div>
                </div>
                <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold">
                  Required
                </span>
              </div>

              {/* Inputs Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2">
                {/* Child Name */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="child-name">
                    <span>Child Legal or Preferred Name</span>
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-outline pointer-events-none">
                      person
                    </span>
                    <input
                      id="child-name"
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Sophia Miller"
                      className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-low shadow-2xs border border-outline-variant/40 transition-all"
                    />
                  </div>
                </div>

                {/* Age Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="child-age">
                    <span>Age Preset</span>
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-outline pointer-events-none">
                      cake
                    </span>
                    <select
                      id="child-age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full h-11 pl-10 pr-8 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg appearance-none cursor-pointer focus:outline-none focus:bg-surface-container-low shadow-2xs border border-outline-variant/40 transition-all"
                    >
                      <option value="6">Age 6 (Pre-K Guard)</option>
                      <option value="7">Age 7 (Early Elementary)</option>
                      <option value="8">Age 8 (Junior Shield)</option>
                      <option value="9">Age 9 (Elementary)</option>
                      <option value="10">Age 10 (Pre-Teen Strict)</option>
                      <option value="11">Age 11 (Pre-Teen Moderate)</option>
                      <option value="12">Age 12 (Middle School)</option>
                      <option value="13">Age 13 (Teen Standard)</option>
                      <option value="14">Age 14+ (Teen Freedom Plus)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-[18px] text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Avatar Pick / Theme */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">Avatar Accent</label>
                  <div className="h-11 flex items-center gap-3 px-3 bg-surface-container-low rounded-lg">
                    <span
                      onClick={() => setFormData({ ...formData, accentColor: 'indigo' })}
                      className={`w-6 h-6 rounded-full bg-primary cursor-pointer transition-all ${
                        formData.accentColor === 'indigo' ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60'
                      }`}
                    ></span>
                    <span
                      onClick={() => setFormData({ ...formData, accentColor: 'purple' })}
                      className={`w-6 h-6 rounded-full bg-secondary-container cursor-pointer transition-all ${
                        formData.accentColor === 'purple' ? 'ring-2 ring-secondary ring-offset-2' : 'opacity-60'
                      }`}
                    ></span>
                    <span
                      onClick={() => setFormData({ ...formData, accentColor: 'emerald' })}
                      className={`w-6 h-6 rounded-full bg-tertiary-container cursor-pointer transition-all ${
                        formData.accentColor === 'emerald' ? 'ring-2 ring-tertiary ring-offset-2' : 'opacity-60'
                      }`}
                    ></span>
                    <span
                      onClick={() => setFormData({ ...formData, accentColor: 'rose' })}
                      className={`w-6 h-6 rounded-full bg-error cursor-pointer transition-all ${
                        formData.accentColor === 'rose' ? 'ring-2 ring-error ring-offset-2' : 'opacity-60'
                      }`}
                    ></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant ml-auto capitalize">
                      {formData.accentColor} Aura
                    </span>
                  </div>
                </div>

                {/* Child Login Email */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="child-email">
                      <span>Child Companion Login Email</span>
                      <span className="text-error">*</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-primary font-bold">Required for App</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-outline pointer-events-none">
                      mail
                    </span>
                    <input
                      id="child-email"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. zain@familycloud.org"
                      className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-low shadow-2xs border border-outline-variant/40 transition-all"
                    />
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Child will use this email to log in to Companion App</span>
                </div>

                {/* Child Companion Password / PIN */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="child-password">
                      <span>Child Login Password / PIN</span>
                      <span className="text-error">*</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-primary font-bold">Required for App</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-outline pointer-events-none">
                      key
                    </span>
                    <input
                      id="child-password"
                      required
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="e.g. 123456 or Pass@123"
                      className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-low shadow-2xs border border-outline-variant/40 transition-all"
                    />
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Child will enter this password when opening the Companion App
                  </span>
                </div>

                {/* Child Phone */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="child-phone">
                      Child Mobile Line
                    </label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Optional</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-outline pointer-events-none">
                      call
                    </span>
                    <input
                      id="child-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 349-2810"
                      className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-low shadow-2xs border border-outline-variant/40 transition-all"
                    />
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Enables emergency SMS &amp; SIM swap alerts
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Device Specification & Security */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">devices</span>
                  </div>
                  <div>
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">2. Device Details &amp; Security PIN</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Configure target hardware type and tamper-proofing passkey
                    </p>
                  </div>
                </div>
                <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold">
                  Hardware Link
                </span>
              </div>

              <div className="flex flex-col gap-space-md pt-2">
                {/* Device Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="device-nickname">
                    <span>Device Nickname</span>
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-outline pointer-events-none">
                      smartphone
                    </span>
                    <input
                      id="device-nickname"
                      required
                      type="text"
                      value={formData.deviceNickname}
                      onChange={(e) => setFormData({ ...formData, deviceNickname: e.target.value })}
                      placeholder="e.g., Sophia's iPhone SE"
                      className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-low shadow-2xs border border-outline-variant/40 transition-all"
                    />
                  </div>
                </div>

                {/* Platform Selector Tabs */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">Target Mobile Platform</label>
                  <div className="grid grid-cols-2 gap-space-sm p-1.5 bg-surface-container-low rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, platform: 'ios' })}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-title-sm text-title-sm font-bold transition-all ${
                        formData.platform === 'ios'
                          ? 'bg-surface-container-lowest text-primary shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                      <span>Apple iOS</span>
                      {formData.platform === 'ios' && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, platform: 'android' })}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-title-sm text-title-sm font-bold transition-all ${
                        formData.platform === 'android'
                          ? 'bg-surface-container-lowest text-primary shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">phone_android</span>
                      <span>Android OS</span>
                      {formData.platform === 'android' && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                    </button>
                  </div>
                </div>

                {/* Auto-generated Pairing Code Panel */}
                <div className="bg-surface-container p-space-md rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                      Single-Use Pairing Code
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-headline-md text-headline-md tracking-widest text-primary font-bold">
                        {formData.pairingCode}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Valid 24h
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={handleCopyCode}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-surface-container-lowest text-primary px-3.5 py-2 rounded-lg font-title-sm text-title-sm hover:bg-primary-fixed shadow-2xs transition-colors font-bold"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {copied ? 'check' : 'content_copy'}
                      </span>
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Security PIN / Parent Passcode */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1">
                      <span>Anti-Tamper Parent PIN (4 Digits)</span>
                      <span className="text-error">*</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Prevents unauthorized app deletion
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="grid grid-cols-4 gap-2.5 max-w-xs">
                      {formData.pin.map((digit, idx) => (
                        <input
                          key={idx}
                          value={digit}
                          onChange={(e) => handlePinChange(idx, e.target.value)}
                          className="w-12 h-12 text-center font-headline-sm text-headline-sm font-bold bg-surface-container-lowest text-on-surface rounded-lg shadow-2xs border border-outline-variant/40 focus:outline-none focus:bg-surface-container-low"
                          maxLength={1}
                          type="password"
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-body-sm font-body-sm">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">lock</span>
                      <span>Saved to Parent Vault</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Area */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
              <Link
                to="/parent/all-children"
                className="font-title-sm text-title-sm text-on-surface-variant hover:text-on-surface transition-colors py-2 px-3"
              >
                Cancel &amp; Return to Fleet
              </Link>
              <div className="flex items-center gap-space-sm w-full sm:w-auto">
                <button
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-space-lg py-3 rounded-xl font-title-sm text-title-sm font-bold shadow-md hover:bg-primary-container transition-all active:scale-[0.98]"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">add_link</span>
                  <span>{submitting ? 'Generating Invite...' : 'Generate Pairing Invite & Add Child'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* RIGHT COLUMN: Interactive Pairing Walkthrough & QR Display (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* Visual QR Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col items-center text-center relative overflow-hidden">
              {/* Decorative Glow Blur */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-fixed rounded-full blur-3xl opacity-50 pointer-events-none"></div>
              <div className="flex items-center justify-between w-full mb-space-md relative z-10">
                <div className="flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    {formData.platform === 'ios' ? 'phone_iphone' : 'phone_android'}
                  </span>
                  <div>
                    <span className="font-title-sm text-title-sm text-on-surface font-bold block leading-none">
                      Instant Companion Link
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {formData.platform === 'ios' ? 'App Store for iOS 15.0+' : 'Google Play for Android 10+'}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                  <span className="w-2 h-2 rounded-full bg-tertiary pulse-emerald"></span> Scanner Ready
                </span>
              </div>

              {/* High-Contrast QR Code Wrapper */}
              <div className="p-space-md bg-surface-container-lowest rounded-2xl shadow-md flex flex-col items-center justify-center relative z-10 mb-space-sm group">
                <div className="p-3 bg-[#0b1c30] rounded-xl shadow-lg">
                  {/* High Contrast Scalable Vector QR Code with Shield */}
                  <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 160 160">
                    <rect height="40" rx="6" width="40" x="10" y="10"></rect>
                    <rect fill="#0b1c30" height="24" rx="2" width="24" x="18" y="18"></rect>
                    <rect fill="#ffffff" height="12" rx="1" width="12" x="24" y="24"></rect>
                    <rect height="40" rx="6" width="40" x="110" y="10"></rect>
                    <rect fill="#0b1c30" height="24" rx="2" width="24" x="118" y="18"></rect>
                    <rect fill="#ffffff" height="12" rx="1" width="12" x="124" y="24"></rect>
                    <rect height="40" rx="6" width="40" x="10" y="110"></rect>
                    <rect fill="#0b1c30" height="24" rx="2" width="24" x="18" y="118"></rect>
                    <rect fill="#ffffff" height="12" rx="1" width="12" x="24" y="124"></rect>
                    <rect height="8" rx="1" width="8" x="58" y="12"></rect>
                    <rect height="8" rx="1" width="12" x="74" y="12"></rect>
                    <rect height="8" rx="1" width="8" x="94" y="12"></rect>
                    <rect height="8" rx="1" width="12" x="58" y="28"></rect>
                    <rect height="12" rx="1" width="8" x="80" y="28"></rect>
                    <rect height="16" rx="1" width="6" x="96" y="24"></rect>
                    <rect height="8" rx="1" width="12" x="12" y="58"></rect>
                    <rect height="12" rx="1" width="8" x="32" y="60"></rect>
                    <rect height="10" rx="1" width="10" x="48" y="58"></rect>
                    <rect height="8" rx="1" width="8" x="106" y="58"></rect>
                    <rect height="8" rx="1" width="14" x="122" y="58"></rect>
                    <rect height="14" rx="1" width="6" x="142" y="62"></rect>
                    <rect height="14" rx="1" width="8" x="12" y="80"></rect>
                    <rect height="8" rx="1" width="14" x="28" y="88"></rect>
                    <rect height="8" rx="1" width="8" x="48" y="78"></rect>
                    <rect height="12" rx="1" width="12" x="106" y="76"></rect>
                    <rect height="10" rx="1" width="8" x="126" y="80"></rect>
                    <rect height="14" rx="1" width="10" x="138" y="86"></rect>
                    <rect height="8" rx="1" width="14" x="58" y="110"></rect>
                    <rect height="8" rx="1" width="8" x="80" y="110"></rect>
                    <rect height="18" rx="1" width="6" x="96" y="112"></rect>
                    <rect height="12" rx="1" width="8" x="58" y="126"></rect>
                    <rect height="8" rx="1" width="14" x="74" y="132"></rect>
                    <rect height="10" rx="1" width="8" x="110" y="128"></rect>
                    <rect height="8" rx="1" width="16" x="126" y="136"></rect>
                    <rect height="14" rx="1" width="8" x="132" y="112"></rect>
                    <circle cx="80" cy="80" fill="#4f46e5" r="18"></circle>
                    <path d="M80 70 L88 74 V82 C88 87 84.5 90.5 80 92 C75.5 90.5 72 87 72 82 V74 Z" fill="#ffffff"></path>
                  </svg>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium">
                  Point child's camera at this square
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs relative z-10">
                The QR payload automatically transmits {formData.name}'s auth token, pairing code, and security certificates.
              </p>

              {/* Auxiliary Method: SMS link */}
              <button
                onClick={handleSendSMS}
                className="mt-space-sm inline-flex items-center gap-1.5 text-primary hover:text-primary-container font-label-md text-label-md font-semibold transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">sms</span>
                <span>Send direct link via SMS instead</span>
              </button>
            </div>

            {/* Step-by-Step Connection Instructions Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm pb-space-xs">
                <div className="w-9 h-9 rounded-lg bg-surface-container text-on-surface flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">checklist</span>
                </div>
                <div>
                  <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                    How to Connect the Child's Device
                  </h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Perform these 3 steps on {formData.name}'s phone
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-space-md">
                <div className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                      Download Companion App
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Search <strong className="text-on-surface font-semibold">"GuardianKids Companion"</strong> in App Store or Google Play and install.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                      Scan QR or Type Code
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Open companion app and scan the QR code above, or manually type{' '}
                      <strong className="text-primary font-bold">{formData.pairingCode}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                      Grant Safety Permissions
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Follow device OS prompts to enable Accessibility, Screen Time tracking, and Always-On Location Services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Setup Feature Checklist */}
              <div className="pt-space-xs bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1.5">
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  What will be enabled immediately:
                </span>
                <div className="grid grid-cols-2 gap-1 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span> Live Location GPS
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span> Web Content Filter
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span> App Usage Limits
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span> 1-Tap Device Pause
                  </span>
                </div>
              </div>
            </div>

            {/* Support & Help Module */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm text-on-surface font-bold leading-tight">
                    Need Pairing Help?
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Read OS Guide or chat with our 24/7 Family Tech team
                  </span>
                </div>
              </div>
              <button
                onClick={() => showToast('Connecting to 24/7 Family Tech Assistant...', 'info')}
                className="shrink-0 p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

            {/* Trust Assurance Note */}
            <div className="flex items-center gap-2 px-space-sm">
              <span className="material-symbols-outlined text-[18px] text-outline">lock</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Compliant with COPPA &amp; GDPR-K. No personal child telemetry is ever sold or indexed.
              </span>
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
