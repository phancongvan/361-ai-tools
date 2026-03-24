import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
  children?: Category[];
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  addSubCategory: (parentId: string, category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  loading: boolean;
}

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Generative AI',
    slug: 'generative-ai',
    description: 'Tools that generate text, images, or other media.',
    count: 124,
    children: [
      {
        id: '1-1',
        name: 'Software',
        slug: 'software',
        description: 'Comprehensive reviews of software solutions for business and personal use, covering productivity, security, and creative tools.',
        count: 86,
        children: [
          { id: '1-1-1', name: 'Productivity', slug: 'productivity', description: '', count: 42 },
          { id: '1-1-2', name: 'Design', slug: 'design', description: '', count: 28 },
          { id: '1-1-3', name: 'Development', slug: 'development', description: '', count: 16 },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Hardware',
    slug: 'hardware',
    description: 'Hardware tools and devices.',
    count: 12,
  }
];

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

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  // Fetch from API on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const apiCats = await apiFetch<Category[]>('/categories');
      if (mounted && apiCats && apiCats.length > 0) {
        setCategories(apiCats);
      }
      if (mounted) setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const addCategory = useCallback(async (category: Category) => {
    setCategories(prev => [...prev, category]);
    await apiFetch('/categories', { method: 'POST', body: JSON.stringify(category) });
  }, []);

  const addSubCategory = useCallback(async (parentId: string, category: Category) => {
    const addRecursive = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === parentId) {
          return { ...cat, children: [...(cat.children || []), category] };
        }
        if (cat.children) {
          return { ...cat, children: addRecursive(cat.children) };
        }
        return cat;
      });
    };
    setCategories(prev => addRecursive(prev));
    await apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify({ ...category, parentId }),
    });
  }, []);

  const updateCategory = useCallback(async (id: string, updatedFields: Partial<Category>) => {
    let updatedCat: Category | null = null;
    const updateRecursive = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === id) {
          updatedCat = { ...cat, ...updatedFields };
          return updatedCat;
        }
        if (cat.children) return { ...cat, children: updateRecursive(cat.children) };
        return cat;
      });
    };
    setCategories(prev => updateRecursive(prev));
    if (updatedCat) {
      await apiFetch('/categories', { method: 'PUT', body: JSON.stringify(updatedCat) });
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    const deleteRecursive = (cats: Category[]): Category[] => {
      return cats.filter(cat => cat.id !== id).map(cat => {
        if (cat.children) return { ...cat, children: deleteRecursive(cat.children) };
        return cat;
      });
    };
    setCategories(prev => deleteRecursive(prev));
    await apiFetch(`/categories?id=${id}`, { method: 'DELETE' });
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, addCategory, addSubCategory, updateCategory, deleteCategory, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
