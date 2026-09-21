import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/parent/ParentLayout';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export default function ParentContacts() {
  const { showToast } = useApp();
  const [contacts, setContacts] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', category: 'Family / Whitelisted' });

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [contactsRes, childrenRes] = await Promise.all([
        api.getParentContacts(selectedChildId === 'all' ? null : selectedChildId),
        api.getParentChildren()
      ]);
      if (contactsRes.success) setContacts(contactsRes.data || []);
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

  const handleToggleBlock = async (contact) => {
    try {
      const res = await api.toggleBlockContact(contact.id);
      if (res.success) {
        showToast(res.message, res.data.isBlocked ? 'warning' : 'success');
        setContacts(prev => prev.map(c => c.id === contact.id ? res.data : c));
      }
    } catch (err) {
      showToast('Failed to toggle contact block status', 'error');
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) {
      showToast('Please enter contact name and phone number', 'error');
      return;
    }
    try {
      const res = await api.addParentContact({
        ...newContact,
        childId: selectedChildId === 'all' ? (children[0]?.id || 1) : selectedChildId
      });
      if (res.success) {
        showToast(res.message, 'success');
        setContacts(prev => [res.data, ...prev]);
        setShowAddModal(false);
        setNewContact({ name: '', phone: '', category: 'Family / Whitelisted' });
      }
    } catch (err) {
      showToast('Error adding contact to whitelist', 'error');
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ParentLayout>
      <div className="flex flex-col w-full max-w-7xl mx-auto gap-space-lg pb-space-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary-fixed text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">contacts</span>
              </span>
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-bold">
                Family Address Book &amp; Whitelist
              </h1>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Inspect all child phonebook contacts, manage safe calling lists, and instantly block suspicious telemarketers or predators.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-title-sm text-title-sm font-bold shadow-xs hover:bg-primary-container transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Add Whitelisted Contact</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-lowest p-space-sm rounded-2xl shadow-xs">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search contact name, phone, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-label-sm font-bold text-on-surface-variant">Filter Device:</span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 py-2 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
            >
              <option value="all">All Child Devices ({children.length})</option>
              {children.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.deviceModel})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contacts Grid */}
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant">Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/40">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">contact_phone</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">No Contacts Found</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">No contacts matching the current filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-2xl border shadow-xs transition-all ${
                  contact.isBlocked ? 'border-error/40 bg-error-container/10' : 'border-outline-variant/20'
                }`}
              >
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[22px] shrink-0 ${
                    contact.isBlocked ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed text-primary'
                  }`}>
                    {contact.avatar || '👤'}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-title-md text-[16px] font-bold text-on-surface truncate">
                        {contact.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        contact.isBlocked ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}>
                        {contact.isBlocked ? 'Blocked' : 'Allowed'}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-mono mt-0.5">
                      {contact.phone}
                    </span>
                    <span className="text-[11px] text-primary font-medium mt-1">
                      🏷️ {contact.category}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low/50 border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">history</span>
                    {contact.lastCall || 'No recent calls'}
                  </span>

                  <button
                    onClick={() => handleToggleBlock(contact)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                      contact.isBlocked
                        ? 'bg-tertiary text-on-tertiary hover:bg-tertiary/90'
                        : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {contact.isBlocked ? 'check_circle' : 'block'}
                    </span>
                    <span>{contact.isBlocked ? 'Unblock Caller' : 'Block Number'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Contact Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant/30 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">person_add</span>
                  <h3 className="font-headline-sm text-[18px] font-bold text-on-surface">Add Whitelisted Contact</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddContact} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-label-sm font-bold text-on-surface">Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grandma Helen"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="px-3.5 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-label-sm font-bold text-on-surface">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 392-1099"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="px-3.5 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-label-sm font-bold text-on-surface">Category Tag</label>
                  <select
                    value={newContact.category}
                    onChange={(e) => setNewContact({ ...newContact, category: e.target.value })}
                    className="px-3.5 py-2.5 bg-surface-container-low rounded-xl text-body-md text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary"
                  >
                    <option value="Family / Whitelisted">Family / Whitelisted</option>
                    <option value="School / Teacher">School / Teacher</option>
                    <option value="Friend / Classmate">Friend / Classmate</option>
                    <option value="Emergency Contact">Emergency Contact</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-bold text-body-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-body-md shadow-xs hover:bg-primary-container"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
