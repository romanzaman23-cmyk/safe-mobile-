import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast.show) return null;

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-2 z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
        toast.type === 'error'
          ? 'bg-error text-on-error'
          : 'bg-inverse-surface text-inverse-on-surface'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
          {toast.type === 'error' ? 'error' : 'check_circle'}
        </span>
        <span className="font-body-sm text-body-sm font-medium">{toast.message}</span>
      </div>
      <button onClick={hideToast} className="hover:opacity-75">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
