import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────
export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId?: string;
  badge: string;
  pricingTier: string;
  pricingAmount: string;
  verdict: string;
  features: string[];
  pros: string[];
  cons: string[];
  externalLink: string;
  image: string;
  rating: number;
  apiAvailable: boolean;
  openSource: boolean;
  mobileApp: boolean;
  popular?: boolean;
}

export interface ListicleItem {
  toolId?: string; // Reference to unified Tool

  // Legacy fallback properties
  name?: string;
  badge?: string;
  pricingTier?: string;
  pricingAmount?: string;
  verdict?: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  externalLink?: string;
  rating?: number;
  popular?: boolean;
  image?: string;
}

export interface Article {
  id: string;
  type: 'blog' | 'listicle';
  title: string;
  slug: string;
  category: string;
  categoryId?: string;
  excerpt: string;
  subtitle?: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  status: 'draft' | 'published' | 'scheduled';
  tags: string[];
  featured?: boolean;
  // Listicle-specific
  introduction?: string;
  conclusion?: string;
  items?: ListicleItem[];
  // Blog-specific
  content?: string;
}

interface ArticleContextValue {
  articles: Article[];
  listicles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticle: (id: string) => Article | undefined;
  toggleFeatured: (id: string, type: 'blog' | 'listicle') => void;
  togglePopularTool: (toolId: string) => boolean;

  tools: Tool[];
  addTool: (tool: Tool) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;

  loading: boolean;
}

const ArticleContext = createContext<ArticleContextValue | null>(null);

export function useArticles() {
  const ctx = useContext(ArticleContext);
  if (!ctx) throw new Error('useArticles must be used within ArticleProvider');
  return ctx;
}

// ─── API Helpers ─────────────────────────────────────────────
const API_BASE = '/api';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
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

// ─── Mock Data Fallbacks (for local dev without DB) ─────────
const MOCK_TOOLS: Tool[] = [
  {
    id: 'tool-omnimind-pro',
    name: 'OmniMind Pro',
    slug: 'omnimind-pro',
    category: 'Productivity',
    badge: 'Most Versatile',
    pricingTier: 'Free + Premium',
    pricingAmount: '$20/mo',
    verdict: 'The best all-around AI assistant for daily workflows.',
    features: ['Multi-modal reasoning', 'Real-time collaboration', 'Plugin ecosystem'],
    pros: ['Extremely versatile', 'Great API documentation'],
    cons: ['Can be slow on complex tasks', 'Premium pricing'],
    externalLink: 'https://example.com/omnimind',
    image: '',
    rating: 4.8,
    apiAvailable: true,
    openSource: false,
    mobileApp: true,
    popular: true,
  },
  {
    id: 'tool-codepilot-x',
    name: 'CodePilot X',
    slug: 'codepilot-x',
    category: 'Productivity',
    badge: 'Best for Developers',
    pricingTier: 'Freemium',
    pricingAmount: '$15/mo',
    verdict: 'The most powerful AI coding assistant on the market.',
    features: ['Context-aware completions', 'Multi-file editing', 'Test generation'],
    pros: ['Lightning fast', 'Supports 50+ languages'],
    cons: ['Requires good prompting skills'],
    externalLink: 'https://example.com/codepilot',
    image: '',
    rating: 4.5,
    apiAvailable: true,
    openSource: true,
    mobileApp: false,
    popular: true,
  }
];

const SAMPLE_LISTICLES: Article[] = [
  {
    id: 'listicle-1',
    type: 'listicle',
    title: 'Top 10 Best AI Tools for 2026: The Productivity Revolution',
    slug: 'top-10-best-ai-tools-2026',
    category: 'Productivity',
    excerpt: 'Explore the next generation of LLMs and autonomous agents that are redefining what it means to work in the mid-decade digital landscape.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5cHwHZAEQtG-DGb1WiOs-QecmLOiBIFNPwwmR4ak9ELScpoBygBeUY9y--hqvkw3ONm60YwGe4nBZONhcPOdCJhVrMMOXOt2l-YCWAwuYlyEe0LPoESqqWOywsRXGHyGqZK1lmTqthZyz22IbKSCY4UHZ-MFPWxHftjWHDBqIgBCsRaflJlewrSBPTflFEArfjKUApsZ-nLxbSCjpVDHx75kKvaq0NBLZTx2-iFJdntyYlZoMUoi88NU8JVL4RcYm5vhmBpG5PKk',
    author: 'Alex Rivera',
    authorAvatar: '',
    date: 'March 12, 2024',
    status: 'published',
    tags: ['AI', 'Productivity', 'Tools'],
    featured: true,
    introduction: 'The landscape of artificial intelligence is evolving at terminal velocity.',
    conclusion: 'The AI tools landscape in 2026 is more exciting than ever.',
    items: [
      { toolId: 'tool-omnimind-pro', name: 'OmniMind Pro', badge: 'Most Versatile', pricingTier: 'Free + Premium', pricingAmount: '$20/mo', verdict: 'The best all-around AI assistant for daily workflows.', features: ['Multi-modal reasoning', 'Real-time collaboration', 'Plugin ecosystem'], pros: ['Extremely versatile', 'Great API documentation'], cons: ['Can be slow on complex tasks', 'Premium pricing'], externalLink: 'https://example.com/omnimind', rating: 4.8 },
      { toolId: 'tool-codepilot-x', name: 'CodePilot X', badge: 'Best for Developers', pricingTier: 'Freemium', pricingAmount: '$15/mo', verdict: 'The most powerful AI coding assistant on the market.', features: ['Context-aware completions', 'Multi-file editing', 'Test generation'], pros: ['Lightning fast', 'Supports 50+ languages'], cons: ['Requires good prompting skills'], externalLink: 'https://example.com/codepilot', rating: 4.5 },
    ],
  },
];

const SAMPLE_BLOGS: Article[] = [
  {
    id: 'blog-1', type: 'blog', title: 'The Rise of Agentic AI: Why LLMs are Becoming Workers, Not Just Assistants',
    slug: 'rise-of-agentic-ai', category: 'Artificial Intelligence',
    excerpt: 'Exploring the transition from prompt-response patterns to autonomous goal-seeking agents.',
    image: 'https://picsum.photos/seed/brain/1200/800', author: 'Marcus Chen',
    authorAvatar: 'https://picsum.photos/seed/marcus/100/100', date: 'Nov 14, 2024',
    status: 'published', tags: ['LLM', 'Workflow', 'AI'], featured: true,
  },
  {
    id: 'blog-2', type: 'blog', title: "The Designer's Guide to Stable Diffusion 3.0",
    slug: 'designers-guide-stable-diffusion-3', category: 'Generative AI',
    excerpt: 'A deep dive into the new architecture for commercial work.',
    image: 'https://picsum.photos/seed/network/800/500', author: 'Elena Rodriguez',
    authorAvatar: 'https://picsum.photos/seed/elena/100/100', date: 'Nov 12, 2024',
    status: 'published', tags: ['StableDiffusion', 'Design'],
  },
];

// ─── Provider ────────────────────────────────────────────────
export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([...SAMPLE_LISTICLES, ...SAMPLE_BLOGS]);
  const [tools, setTools] = useState<Tool[]>([...MOCK_TOOLS]);
  const [loading, setLoading] = useState(true);

  // Fetch from API on mount, fallback to mock data
  useEffect(() => {
    let mounted = true;

    async function loadFromApi() {
      setLoading(true);

      // Fetch tools
      const apiTools = await apiFetch<Tool[]>('/tools');
      if (mounted && apiTools && apiTools.length > 0) {
        setTools(apiTools);
      }

      // Fetch articles
      const apiArticles = await apiFetch<Article[]>('/articles');
      if (mounted && apiArticles && apiArticles.length > 0) {
        setArticles(apiArticles);
      }

      if (mounted) setLoading(false);
    }

    loadFromApi();
    return () => { mounted = false; };
  }, []);

  const listicles = articles.filter(a => a.type === 'listicle' && a.status === 'published');

  const addArticle = useCallback(async (article: Article) => {
    setArticles(prev => [...prev, article]);
    await apiFetch('/articles', { method: 'POST', body: JSON.stringify(article) });
  }, []);

  const updateArticle = useCallback(async (id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    const current = articles.find(a => a.id === id);
    if (current) {
      await apiFetch('/articles', { method: 'PUT', body: JSON.stringify({ ...current, ...updates }) });
    }
  }, [articles]);

  const deleteArticle = useCallback(async (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    await apiFetch(`/articles?id=${id}`, { method: 'DELETE' });
  }, []);

  const getArticle = useCallback((id: string) => {
    return articles.find(a => a.id === id);
  }, [articles]);

  const toggleFeatured = useCallback(async (id: string, type: 'blog' | 'listicle') => {
    setArticles(prev => prev.map(article => {
      if (article.type === type) {
        return { ...article, featured: article.id === id };
      }
      return article;
    }));
    // Update via API
    const article = articles.find(a => a.id === id);
    if (article) {
      await apiFetch('/articles', { method: 'PUT', body: JSON.stringify({ ...article, featured: true }) });
    }
  }, [articles]);

  const togglePopularTool = useCallback((toolId: string): boolean => {
    let success = true;
    
    setTools(prev => {
      let currentPopularCount = 0;
      let isTargetCurrentlyPopular = false;
      
      prev.forEach(t => {
        if (t.id === toolId) isTargetCurrentlyPopular = !!t.popular;
        if (t.popular) currentPopularCount++;
      });
      
      if (!isTargetCurrentlyPopular && currentPopularCount >= 4) {
        success = false;
        return prev;
      }
      
      const updated = prev.map(t => {
        if (t.id === toolId) return { ...t, popular: !t.popular };
        return t;
      });

      // Fire-and-forget API update
      const target = updated.find(t => t.id === toolId);
      if (target) {
        apiFetch('/tools', { method: 'PUT', body: JSON.stringify(target) });
      }

      return updated;
    });
    
    return success;
  }, []);

  const addTool = useCallback(async (tool: Tool) => {
    setTools(prev => [...prev, tool]);
    await apiFetch('/tools', { method: 'POST', body: JSON.stringify(tool) });
  }, []);

  const updateTool = useCallback(async (id: string, updates: Partial<Tool>) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    const current = tools.find(t => t.id === id);
    if (current) {
      await apiFetch('/tools', { method: 'PUT', body: JSON.stringify({ ...current, ...updates }) });
    }
  }, [tools]);

  const deleteTool = useCallback(async (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
    await apiFetch(`/tools?id=${id}`, { method: 'DELETE' });
  }, []);

  return (
    <ArticleContext.Provider value={{
      articles,
      listicles,
      addArticle,
      updateArticle,
      deleteArticle,
      getArticle,
      toggleFeatured,
      togglePopularTool,
      tools,
      addTool,
      updateTool,
      deleteTool,
      loading,
    }}>
      {children}
    </ArticleContext.Provider>
  );
}
