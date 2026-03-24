import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  LayoutGrid, Brain, Sparkles, Video, PenTool,
  Wand2, Terminal, Mic, BarChart, Star, Search,
  Settings, HelpCircle, Folder, ChevronRight
} from 'lucide-react';
import { TOOLS } from '../data/tools';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCategories } from '../context/CategoryContext';
import { useNotification } from '../context/NotificationContext';

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid, Brain, Sparkles, Video, PenTool, Wand2, Terminal, Mic, BarChart, Folder
};

const PRICING_OPTIONS = ['Free', 'Freemium', 'Paid', 'Enterprise'];
const SPEC_OPTIONS = ['API Available', 'Open Source', 'Mobile App'];

export default function Directory() {
  const { categories } = useCategories();
  const { showToast } = useNotification();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const CATEGORIES = useMemo(() => {
    const flattenCategories = (cats: any[], level = 0, parentId = ''): any[] => {
      let result: any[] = [];
      cats.forEach(cat => {
        result.push({ 
          id: cat.name, 
          label: cat.name, 
          icon: Folder, 
          level,
          parentId,
          hasChildren: cat.children && cat.children.length > 0
        });
        if (cat.children) {
          result = result.concat(flattenCategories(cat.children, level + 1, cat.name));
        }
      });
      return result;
    };

    const defaultCats = [{ id: 'all', label: 'All Tools', icon: LayoutGrid, level: 0, hasChildren: false }];
    const mappedCats = flattenCategories(categories);
    return [...defaultCats, ...mappedCats];
  }, [categories]);

  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter(cat => {
      if (cat.id === 'all' || cat.level === 0) return true;
      
      let currentParentId = cat.parentId;
      while (currentParentId) {
        if (!expandedCategories[currentParentId]) return false;
        const parent = CATEGORIES.find(c => c.id === currentParentId);
        currentParentId = parent?.parentId || '';
      }
      return true;
    });
  }, [CATEGORIES, expandedCategories]);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  // Sync URL params -> state (only on URL change from external navigation)
  const isInternalUpdate = React.useRef(false);

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const q = searchParams.get('q');
    const cat = searchParams.get('category');

    if (q !== null && q !== searchQuery) setSearchQuery(q);
    if (cat !== null && cat !== selectedCategory) {
      setSelectedCategory(cat);
      // Auto-expand parents
      const parentIdsToExpand: Record<string, boolean> = {};
      let currentCat = CATEGORIES.find(c => c.id === cat);
      while (currentCat && currentCat.parentId) {
        parentIdsToExpand[currentCat.parentId] = true;
        currentCat = CATEGORIES.find(c => c.id === currentCat?.parentId);
      }
      if (Object.keys(parentIdsToExpand).length > 0) {
        setExpandedCategories(prev => ({ ...prev, ...parentIdsToExpand }));
      }
    } else if (cat === null && selectedCategory !== 'all') {
      setSelectedCategory('all');
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state -> URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    isInternalUpdate.current = true;
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, setSearchParams]);

  const togglePricing = (pricing: string) => {
    setSelectedPricing(prev => 
      prev.includes(pricing) ? prev.filter(p => p !== pricing) : [...prev, pricing]
    );
  };

  const toggleSpec = (spec: string) => {
    setSelectedSpecs(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = tool.name.toLowerCase().includes(query) || 
                              tool.description.toLowerCase().includes(query) ||
                              tool.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Pricing
      if (selectedPricing.length > 0 && !selectedPricing.includes(tool.pricing)) {
        return false;
      }

      // Rating
      if (minRating > 0 && tool.rating < minRating) {
        return false;
      }

      // Specs (Features)
      if (selectedSpecs.length > 0) {
        const hasAllSpecs = selectedSpecs.every(spec => 
          tool.features.some(f => f.toLowerCase().includes(spec.toLowerCase())) ||
          tool.tags.some(t => t.toLowerCase().includes(spec.toLowerCase()))
        );
        if (!hasAllSpecs) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedPricing, minRating, selectedSpecs]);

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Navbar />

      {/* Page Layout Container */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-8 flex pt-16 min-h-screen relative">
        {/* SideNavBar (Filters) */}
        <aside className="hidden lg:flex flex-col h-[calc(100vh-64px)] w-72 shrink-0 sticky top-16 left-0 border-r border-slate-200/20 dark:border-slate-800/20 font-manrope text-sm font-medium">
          {/* Fixed Search Bar */}
          <div className="pt-10 pb-6 pr-8 shrink-0">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                className="w-full pl-10 pr-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium" 
                placeholder="Search tools..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Scrollable Filters */}
          <div className="flex-1 overflow-y-auto pr-8 pb-6">
            <div className="mb-8">
              <h3 className="text-on-surface font-bold text-lg mb-1">Filters</h3>
              <p className="text-on-surface-variant text-xs mb-6">Refine your search</p>
              <nav className="space-y-1">
                {visibleCategories.map(category => {
                  const CategoryIcon = category.icon;
                  const isExpanded = expandedCategories[category.id];
                  return (
                  <div 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id 
                        ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:translate-x-1'
                    } rounded-xl px-4 py-3 mb-1 cursor-pointer transition-all flex items-center justify-between group`}
                    style={{ marginLeft: `${category.level * 16}px` }}
                  >
                    <div className="flex items-center gap-3">
                      {category.hasChildren ? (
                        <ChevronRight 
                          onClick={(e) => toggleExpand(e, category.id)}
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        />
                      ) : (
                        <CategoryIcon className="w-5 h-5 opacity-50" />
                      )}
                      <span>{category.label}</span>
                    </div>
                  </div>
                  );
                })}
              </nav>
            </div>
            <div className="space-y-6">
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Pricing</span>
                <div className="space-y-2">
                  {PRICING_OPTIONS.map(pricing => (
                    <label key={pricing} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        className="rounded border-outline-variant text-primary focus:ring-primary" 
                        type="checkbox" 
                        checked={selectedPricing.includes(pricing)}
                        onChange={() => togglePricing(pricing)}
                      />
                      <span className="group-hover:text-on-surface transition-colors">{pricing}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Rating</span>
                <div className="flex gap-1 text-tertiary cursor-pointer">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star}
                      onClick={() => setMinRating(star === minRating ? 0 : star)}
                      className={`w-5 h-5 ${star <= minRating ? 'fill-primary text-primary' : 'text-outline-variant'}`} 
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Technical Specs</span>
                <div className="space-y-2">
                  {SPEC_OPTIONS.map(spec => (
                    <label key={spec} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        className="rounded border-outline-variant text-primary focus:ring-primary" 
                        type="checkbox" 
                        checked={selectedSpecs.includes(spec)}
                        onChange={() => toggleSpec(spec)}
                      />
                      <span className="group-hover:text-on-surface transition-colors">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Actions */}
          <div className="shrink-0 py-6 pr-8 border-t border-slate-200/20 dark:border-slate-800/20">
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedPricing([]);
                setSelectedSpecs([]);
                setMinRating(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm transition-all hover:shadow-lg active:scale-95"
            >
              Clear Filters
            </button>
            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-3 py-2 text-slate-500 hover:text-on-surface transition-colors cursor-pointer" onClick={() => showToast('Tính năng cài đặt sắp ra mắt!', 'info')}>
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
              <div className="flex items-center gap-3 py-2 text-slate-500 hover:text-on-surface transition-colors cursor-pointer" onClick={() => showToast('Trung tâm hỗ trợ sắp ra mắt!', 'info')}>
                <HelpCircle className="w-5 h-5" />
                <span>Help</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-10 lg:pl-10 flex flex-col min-h-[calc(100vh-64px)]">
          {/* Search & Header Section */}
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tighter mb-2">The Directory</h1>
                <p className="text-on-surface-variant max-w-md text-lg">Curated intelligence for the next generation of digital builders.</p>
              </div>
            </div>
            {/* Featured Categories Chips */}
            <div className="flex flex-wrap gap-2">
              {['Trending', 'Productivity', 'Developer Tools', 'Marketing', 'UI Design'].map(chip => (
                <span 
                  key={chip}
                  onClick={() => setSearchQuery(chip)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    searchQuery === chip 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-secondary-container text-on-secondary-container hover:bg-primary-container hover:text-on-primary-container'
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>
          </header>

          {/* Tools Grid (Asymmetric/Editorial feel) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => {
                const IconComponent = iconMap[tool.icon] || LayoutGrid;
                return (
                  <article key={tool.id} className="bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(25,28,29,0.06)] group border border-outline-variant/10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center">
                        <IconComponent className="text-primary w-6 h-6" />
                      </div>
                      <div className="flex gap-1 text-tertiary items-center">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold text-on-surface-variant">{tool.rating}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{tool.name}</h2>
                    <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">{tool.description}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {tool.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 rounded bg-surface-container-high text-[10px] font-bold uppercase tracking-wider text-on-secondary-fixed-variant">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link to={`/tool/${tool.id}`} className="block w-full text-center py-3 bg-surface-container-high text-on-surface font-bold text-xs rounded-full hover:bg-primary hover:text-on-primary transition-all active:scale-95">
                      View Details
                    </Link>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-variant mb-4">
                  <Search className="w-8 h-8 text-on-surface-variant" />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">No tools found</h3>
                <p className="text-on-surface-variant">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedPricing([]);
                    setSelectedSpecs([]);
                    setMinRating(0);
                  }}
                  className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-full font-bold text-sm hover:shadow-md transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination/Footer Spacer */}
          <div className="mt-16 flex justify-center">
            <button onClick={() => showToast('Đã hiển thị tất cả công cụ', 'info')} className="px-8 py-4 bg-surface-container-high text-on-surface font-bold text-sm rounded-full hover:shadow-md transition-all">Load More Discoveries</button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
