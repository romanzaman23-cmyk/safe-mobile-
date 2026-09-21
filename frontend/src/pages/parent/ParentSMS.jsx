import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/parent/ParentLayout';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export default function ParentSMS() {
  const { showToast } = useApp();
  const [messages, setMessages] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [smsRes, childrenRes] = await Promise.all([
        api.getParentSMS(selectedChildId === 'all' ? null : selectedChildId),
        api.getParentChildren()
      ]);
      if (smsRes.success) setMessages(smsRes.data || []);
      if (childrenRes.success) setChildren(childrenRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 3000);
    return () => clearInterval(interval);
  }, [selectedChildId]);

  const handleBlockSender = async (msg) => {
    try {
      const res = await api.blockSMSSender(msg.id);
      if (res.success) {
        showToast(res.message, 'warning');
        setMessages(prev => prev.map(m => m.id === msg.id ? res.data : m));
      }
    } catch (err) {
      showToast('Failed to block SMS sender', 'error');
    }
  };

  const filteredSMS = messages.filter(m => {
    const sender = (m.sender || '').toLowerCase();
    const phone = (m.phone || '');
    const message = (m.message || '').toLowerCase();
    const search = (searchTerm || '').toLowerCase();

    const matchesSearch = !search || sender.includes(search) || phone.includes(search) || message.includes(search);
    if (!matchesSearch) return false;

    const status = (m.status || '').toLowerCase();
    if (filterType === 'flagged') return status.includes('phishing') || status.includes('blocked') || status.includes('threat');
    if (filterType === 'safe') return status.includes('safe') || status.includes('whitelisted');
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
                <span className="material-symbols-outlined text-[20px]">sms</span>
              </span>
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-bold">
                Live SMS &amp; Message Safety Stream
              </h1>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              End-to-end screened incoming &amp; outgoing SMS text messages with real-time phishing, spam, and cyberbullying alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadData();
                showToast('SMS telemetry refreshed from connected child devices', 'info');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-sm text-title-sm font-bold shadow-xs transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
              <span>Refresh Logs</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-lowest p-space-sm rounded-2xl shadow-xs">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search sender, phone, or message body..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all ${
                  filterType === 'all' ? 'bg-surface-container-lowest text-on-surface shadow-2xs' : 'text-on-surface-variant'
                }`}
                type="button"
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilterType('flagged')}
                className={`px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all ${
                  filterType === 'flagged' ? 'bg-error-container text-on-error-container shadow-2xs' : 'text-on-surface-variant'
                }`}
                type="button"
              >
                Flagged / Blocked
              </button>
              <button
                onClick={() => setFilterType('safe')}
                className={`px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all ${
                  filterType === 'safe' ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-2xs' : 'text-on-surface-variant'
                }`}
                type="button"
              >
                Verified Safe
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

        {/* SMS Feed List */}
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant">Scanning SMS logs...</div>
        ) : filteredSMS.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/40">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">mark_chat_read</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">No SMS Messages</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">No messages recorded for the selected device filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredSMS.map(msg => {
              const isFlagged = msg.status.toLowerCase().includes('phishing') || msg.status.toLowerCase().includes('blocked');
              return (
                <div
                  key={msg.id}
                  className={`p-space-md bg-surface-container-lowest rounded-2xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isFlagged ? 'border-error/40 bg-error-container/10' : 'border-outline-variant/20'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-[20px] ${
                      isFlagged ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed text-primary'
                    }`}>
                      <span className="material-symbols-outlined">
                        {isFlagged ? 'report' : 'chat'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-title-md text-title-md font-bold text-on-surface">
                          {msg.sender}
                        </span>
                        <span className="text-body-sm font-mono text-on-surface-variant">
                          ({msg.phone})
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isFlagged ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                        }`}>
                          {msg.status}
                        </span>
                        <span className="text-[11px] font-medium text-on-surface-variant ml-auto">
                          🕒 {msg.time}
                        </span>
                      </div>

                      <div className="p-3 bg-surface-container-low/70 rounded-xl text-body-md text-on-surface mt-1 border border-outline-variant/20">
                        {msg.message}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-on-surface-variant">
                          Shield Threat Analysis: <strong className={isFlagged ? 'text-error' : 'text-tertiary'}>{msg.riskScore}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {!isFlagged ? (
                      <button
                        onClick={() => handleBlockSender(msg)}
                        className="px-3.5 py-2 rounded-xl bg-error-container hover:bg-error hover:text-on-error text-on-error-container text-[12px] font-bold transition-all flex items-center gap-1.5"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">block</span>
                        <span>Block Sender</span>
                      </button>
                    ) : (
                      <span className="px-3.5 py-2 rounded-xl bg-surface-container text-outline text-[12px] font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">shield_locked</span>
                        <span>Sender Blocked</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
