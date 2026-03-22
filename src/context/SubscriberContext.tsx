import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Subscriber {
  id: string;
  email: string;
  source: string;
  name?: string;
  date: string;
  status?: string;
}

interface SubscriberContextType {
  subscribers: Subscriber[];
  addSubscriber: (email: string, source: string) => void;
  hasUnlocked: boolean;
  setHasUnlocked: (value: boolean) => void;
  loading: boolean;
}

// ─── API Helpers ─────────────────────────────────────────────
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`/api${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`API call failed: ${url}`, e);
    return null;
  }
}

const SubscriberContext = createContext<SubscriberContextType | undefined>(undefined);

export const SubscriberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: 'sub-1', email: 'early.adopter@example.com', source: 'Home Page Newsletter', date: 'Oct 10, 2023' },
    { id: 'sub-2', email: 'dev.tester@example.com', source: 'Listicle: Top 10 Best AI', date: 'Oct 12, 2023' }
  ]);
  const [loading, setLoading] = useState(true);

  const [hasUnlocked, setHasUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('ai_curator_unlocked') === 'true';
  });

  // Fetch from API on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const apiSubs = await apiFetch<Subscriber[]>('/subscribers');
      if (mounted && apiSubs && apiSubs.length > 0) {
        setSubscribers(apiSubs);
      }
      if (mounted) setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const addSubscriber = useCallback(async (email: string, source: string) => {
    const newSub: Subscriber = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      source,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setSubscribers(prev => [newSub, ...prev]);
    
    // Auto-unlock when they subscribe
    setHasUnlocked(true);
    localStorage.setItem('ai_curator_unlocked', 'true');

    // Fire API call
    await apiFetch('/subscribers', { method: 'POST', body: JSON.stringify({ id: newSub.id, email, name: '' }) });
  }, []);

  const updateHasUnlocked = useCallback((value: boolean) => {
    setHasUnlocked(value);
    localStorage.setItem('ai_curator_unlocked', value ? 'true' : 'false');
  }, []);

  return (
    <SubscriberContext.Provider value={{ subscribers, addSubscriber, hasUnlocked, setHasUnlocked: updateHasUnlocked, loading }}>
      {children}
    </SubscriberContext.Provider>
  );
};

export const useSubscribers = () => {
  const context = useContext(SubscriberContext);
  if (context === undefined) {
    throw new Error('useSubscribers must be used within a SubscriberProvider');
  }
  return context;
};
