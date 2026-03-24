import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Grid, Brain, Sparkles, Video, PenTool, ArrowRight, BookmarkPlus, ChevronLeft, ChevronRight, Send, Folder } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCategories, Category } from '../context/CategoryContext';
import { useNotification } from '../context/NotificationContext';
import { useArticles } from '../context/ArticleContext';

const getInitials = (name: string) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Topics');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const { categories } = useCategories();
  const { showToast } = useNotification();
  const { articles } = useArticles();

  const BLOG_CATEGORIES = useMemo(() => {
    const flattenCategories = (cats: Category[], level = 0, parentId = ''): any[] => {
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

    const defaultCats = [{ id: 'All Topics', label: 'All Topics', icon: Grid, level: 0, hasChildren: false }];
    const mappedCats = flattenCategories(categories);
    return [...defaultCats, ...mappedCats];
  }, [categories]);

  const visibleCategories = useMemo(() => {
    return BLOG_CATEGORIES.filter(cat => {
      if (cat.id === 'All Topics' || cat.level === 0) return true;
      
      // Check if all ancestors are expanded
      let currentParentId = cat.parentId;
      while (currentParentId) {
        if (!expandedCategories[currentParentId]) return false;
        const parent = BLOG_CATEGORIES.find(c => c.id === currentParentId);
        currentParentId = parent?.parentId || '';
      }
      return true;
    });
  }, [BLOG_CATEGORIES, expandedCategories]);

  // Sync URL params -> state (only on URL change from external navigation)
  const isInternalUpdate = React.useRef(false);

  React.useEffect(() => {
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
      let currentCat = BLOG_CATEGORIES.find(c => c.id === cat);
      while (currentCat && currentCat.parentId) {
        parentIdsToExpand[currentCat.parentId] = true;
        currentCat = BLOG_CATEGORIES.find(c => c.id === currentCat?.parentId);
      }
      if (Object.keys(parentIdsToExpand).length > 0) {
        setExpandedCategories(prev => ({ ...prev, ...parentIdsToExpand }));
      }
    } else if (cat === null && selectedCategory !== 'All Topics') {
      setSelectedCategory('All Topics');
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state -> URL params
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'All Topics') params.set('category', selectedCategory);
    isInternalUpdate.current = true;
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, setSearchParams]);

  const filteredPosts = useMemo(() => {
    return articles.filter(post => {
      if (post.type !== 'blog' || post.status !== 'published') return false;

      if (selectedCategory !== 'All Topics' && post.category !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return post.title.toLowerCase().includes(query) || 
               ((post as any).excerpt || '').toLowerCase().includes(query) ||
               (post.tags || []).some(tag => tag.toLowerCase().includes(query));
      }
      return true;
    });
  }, [searchQuery, selectedCategory, articles]);

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased font-body flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 max-w-7xl mx-auto px-6 md:px-8 w-full">
        {/* Featured Post (Asymmetrical Dynamic Layout) */}
        {featuredPost && (
        <section className="mb-20">
          <Link to={`/blog/${featuredPost.id}`} className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden bg-surface-container-lowest shadow-xl shadow-black/5 border border-outline-variant/20 group">
            <div className="lg:col-span-7 relative h-[400px] lg:h-[520px] overflow-hidden">
              <img 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={featuredPost.title}
                src={featuredPost.image}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent lg:hidden"></div>
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">Featured Article</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:p-12 bg-white">
              <div className="flex items-center gap-2 text-primary font-bold text-xs mb-4 uppercase tracking-widest">
                <span>{featuredPost.category}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mb-6 leading-[1.15] group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h1>
              <p className="text-on-surface-variant text-lg mb-10 line-clamp-3 font-medium leading-relaxed">
                {(featuredPost as any).excerpt || 'Nội dung đang được cập nhật...'}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                    {getInitials(featuredPost.author)}
                  </div>
                  <div>
                    <p className="text-on-surface font-bold text-sm">{featuredPost.author}</p>
                    <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">{featuredPost.date} • 5 min read</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wider hover:gap-3 transition-all">
                  Read Full Story <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Link>
        </section>
        )}

        {/* Content Search and Filters Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 border-b border-outline-variant/30 pb-8">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl font-black tracking-tight text-on-surface mb-2">Knowledge Archive</h2>
            <p className="text-on-surface-variant text-sm font-medium">Browse our latest insights and tutorials on the AI landscape.</p>
          </div>
        </div>

        {/* Main Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar (Modern & Clean) */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 flex flex-col h-[calc(100vh-96px)]">
              {/* Fixed Search Bar */}
              <div className="shrink-0 pb-8">
                <div className="relative w-full group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant/50 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" 
                    placeholder="Search articles, topics or authors..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-10 pb-10 pr-4">
                <div>
                  <h3 className="font-headline text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/70 mb-6">Categories</h3>
                  <div className="flex flex-col gap-2">
                    {visibleCategories.map(cat => {
                      const Icon = cat.icon;
                      const isExpanded = expandedCategories[cat.id];
                      return (
                        <button 
                          key={cat.id} 
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            if (cat.hasChildren) {
                              setExpandedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }));
                            }
                          }} 
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all group ${selectedCategory === cat.id ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                          style={{ marginLeft: `${cat.level * 16}px`, width: `calc(100% - ${cat.level * 16}px)` }}
                        >
                          <span className="flex items-center gap-3">
                            {cat.hasChildren ? (
                              <ChevronRight 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedCategories(prev => ({ ...prev, [cat.id]: !prev[cat.id] }));
                                }}
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                              />
                            ) : (
                              <Icon className="w-5 h-5 opacity-50" />
                            )}
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-headline text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/70 mb-6">Trending Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['#LLM', '#StableDiffusion', '#Ethics', '#Productivity', '#Workflow'].map(tag => (
                      <button key={tag} onClick={() => setSearchQuery(tag)} className="px-3 py-1.5 bg-surface-container rounded-lg text-xs font-bold text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-primary rounded-2xl text-on-primary mt-auto shrink-0">
                  <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-80">Submit Guest Post</p>
                  <h4 className="text-lg font-extrabold mb-4 leading-snug">Share your AI expertise with our 50k+ readers.</h4>
                  <button onClick={() => showToast('Tính năng gửi bài viết sắp ra mắt!', 'info')} className="w-full py-2.5 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all">Learn More</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Blog Grid */}
          <div className="flex-1 min-w-0 min-h-[calc(100vh-64px)] flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
              {regularPosts.length > 0 ? regularPosts.map(post => (
                <Link key={post.id} to={`/blog/${post.id}`} className="flex flex-col group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-surface-container mb-6 aspect-[16/10] shadow-sm">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={post.title}
                      src={post.image}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-primary text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm border border-primary/10">{post.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant text-[11px] font-black uppercase tracking-widest mb-3">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                    <span>5 min read</span>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                    {(post as any).excerpt || 'Nội dung đang được cập nhật...'}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-black border border-primary/20">{getInitials(post.author)}</div>
                      <span className="text-xs font-bold text-on-surface">{post.author}</span>
                    </div>
                    <BookmarkPlus onClick={(e) => { e.preventDefault(); showToast('Đã lưu bài viết!', 'success'); }} className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-xl font-bold text-on-surface mb-2">No articles found</h3>
                  <p className="text-on-surface-variant">Try adjusting your search or category filter.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Topics');
                    }}
                    className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-full font-bold text-sm hover:shadow-md transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination (Modern Styled) */}
            <div className="mt-20 pt-12 flex items-center justify-center border-t border-outline-variant/30">
              <nav className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-sm border border-outline-variant/20">
                <button onClick={() => showToast('Đang ở trang đầu tiên', 'info')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-on-primary font-black text-sm">1</button>
                <button onClick={() => showToast('Trang 2 sắp ra mắt!', 'info')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container text-on-surface-variant font-bold text-sm">2</button>
                <button onClick={() => showToast('Trang 3 sắp ra mắt!', 'info')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container text-on-surface-variant font-bold text-sm">3</button>
                <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant font-bold text-sm">...</span>
                <button onClick={() => showToast('Trang 12 sắp ra mắt!', 'info')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container text-on-surface-variant font-bold text-sm">12</button>
                <button onClick={() => showToast('Trang tiếp theo sắp ra mắt!', 'info')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
