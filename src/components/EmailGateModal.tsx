import React, { useState } from 'react';
import { useSubscribers } from '../context/SubscriberContext';

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  source?: string;
}

export default function EmailGateModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Unlock Full Access",
  description = "Enter your email to unlock all external tool links and premium AI curations.",
  source = "Email Gate"
}: EmailGateModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { addSubscriber } = useSubscribers();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    // Simulate a brief delay
    setTimeout(() => {
      addSubscriber(email, source);
      setLoading(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 pt-10 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            {description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 transition-all outline-none"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Unlock Now
                  <span className="material-symbols-outlined text-lg">bolt</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            No spam, just pure AI value.
          </p>
        </div>
      </div>
    </div>
  );
}
