import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, LayoutGrid, Brain, Sparkles, Video, PenTool, 
  Settings, HelpCircle, ArrowRight, Wand2, Terminal, 
  Mic, BarChart, ChevronLeft, ChevronRight, Globe, 
  Share2, Compass, Folder, Bookmark, User
} from 'lucide-react';
import { TOOLS } from '../data/tools';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCategories } from '../context/CategoryContext';
import { useArticles } from '../context/ArticleContext';
import { useNotification } from '../context/NotificationContext';

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid, Brain, Sparkles, Video, PenTool, Wand2, Terminal, Mic, BarChart, Folder
};

// --- Mock Data ---

const FEATURED_TOOLS = TOOLS.slice(0, 4);

const RECENT_INSIGHTS = [
  {
    id: 1,
    date: 'March 12, 2024',
    category: 'Future of Work',
    title: 'The Rise of Multi-Modal Agents in Product Design',
    author: 'Elena Vance',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUUUe7eZ7k5M75OFa76RWeszW217b_1DDNbgn7jLg1bupttka_I5eKjgDwBTDfHqM1IE2kB_pgnLxH-1aq-aVZwWnShBGJincizhSKf0zK4oANU8VALTrUZJorm8OI-HusRBFvExbugBkSbXUFgmDVegZFMGybzfRJYcIwE6zGfqvNjlAPz5iPIB9dzJr3IAeDRM3kshss717hv8XjmR-C95NzBLAS7xX9oJ_-iw4Zz0VmkzI-Cx-2ct17u1zP2rb87j6DGR6F98s',
  },
  {
    id: 2,
    date: 'March 08, 2024',
    category: 'Development',
    title: 'Why Custom Models are Outperforming General Purpose APIs',
    author: 'Marcus Thorne',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaANer_T7ByQSBQbFHIn9VKZ11XolgtQUVALSdvXu-ZH4eLQ_MgJpH9IfiVu-k8tLCQfIrzJmaOxH9ge5YgFUrKlA-erM0CUNNuk2U6kSToFmHCcCaEf4h9yOPbI6fcjeZk0bCTc3vXtgV4QE1ukvlvli2yNImEUK17MMbvnBogfzxStZr2Uk1LdWqpZu72XGIiAIL85d2yz7XIRpQXOB1aHdWf7mg0vpG_OmODKIjF9GFdSu2TctO85rgvAm5LGB9pyWpWV_elw0',
  },
  {
    id: 3,
    date: 'March 05, 2024',
    category: 'Ethics',
    title: 'Navigating the Regulatory Landscape for AI in 2024',
    author: 'Sarah Chen',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAraef6-T7mbPTuQOg9MoYT1W_Cexk3blTIPOL3vPRa-DHPg89mxMUqGVXQxUOGY66jnWgzQAn6kMwRPnzhDXI2fDQBXf-ZOYp3ESPJDfJ2auVIA8qFVC7YZ2PnjOp_crrSuzo-D11DpOzjTooPveO6QlkWbieF5X7jsrNLxx8gbTNrlHAe_xfRZ2yAkW5TGKuWZ1qYfZS8uHV5cNgrP_Z8YOhqq3bjsJc9UMGxYxrMozyfqcrxfxZOJKpRz7tW7NoRQGvE2poEP14',
  },
];

// --- Components ---

const Hero = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const { tools } = useArticles();
  
  const popularTools = React.useMemo(() => {
    return tools.filter(t => t.popular).map(t => ({
      name: t.name,
      url: `/tool/${t.slug || t.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`
    }));
  }, [tools]);

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter mb-8 leading-[1.1]">
          Find the best AI for your <br className="hidden md:block" /> <span className="text-primary">next project.</span>
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Discover, compare, and implement the world's most advanced artificial intelligence tools curated by experts.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="text-outline w-5 h-5" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-32 py-5 bg-surface-container-highest border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all shadow-sm outline-none" 
            placeholder="Search for tools, categories, or use cases..." 
          />
          <button type="submit" className="absolute right-3 top-2 bottom-2 px-6 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:shadow-md transition-all">
            Search
          </button>
        </form>
        
        {popularTools.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
            <span className="text-on-surface-variant text-sm font-medium">Popular:</span>
            {popularTools.map(tool => (
              <button 
                key={tool.name} 
                onClick={() => navigate(tool.url)}
                className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
              >
                {tool.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Abstract background elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/2 bg-gradient-to-br from-primary/5 to-transparent blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/3 bg-gradient-to-tr from-primary-container/5 to-transparent blur-3xl rounded-full"></div>
    </section>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { showToast } = useNotification();

  const SIDEBAR_CATEGORIES = React.useMemo(() => {
    const defaultCats = [{ id: 'all', label: 'All Tools', icon: LayoutGrid, active: true }];
    const mappedCats = categories.map(cat => ({
      id: cat.name,
      label: cat.name,
      icon: Folder,
      active: false
    }));
    return [...defaultCats, ...mappedCats];
  }, [categories]);

  return (
  <aside className="hidden lg:block w-64 flex-shrink-0">
    <div className="sticky top-24 space-y-8">
      <div>
        <h3 className="text-on-surface font-bold text-lg">Filters</h3>
        <p className="text-on-surface-variant text-xs">Refine your search</p>
      </div>
      <nav className="space-y-1">
        {SIDEBAR_CATEGORIES.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => navigate(`/directory${cat.id === 'all' ? '' : `?category=${encodeURIComponent(cat.id)}`}`)}
            className={`px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
              cat.active 
                ? 'bg-surface-container-lowest text-primary shadow-sm' 
                : 'text-on-surface-variant hover:bg-surface-container-low hover:translate-x-1'
            }`}
          >
            <cat.icon className="w-5 h-5" />
            <span className={`text-sm ${cat.active ? 'font-semibold' : 'font-medium'}`}>{cat.label}</span>
          </div>
        ))}
      </nav>
      <div className="pt-6 border-t border-surface-container-highest">
        <button onClick={() => navigate('/directory')} className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold mb-6 hover:shadow-md transition-all">
          Explore Directory
        </button>
        <div className="space-y-1">
          <div className="text-on-surface-variant px-4 py-2 hover:text-primary flex items-center gap-3 cursor-pointer transition-colors" onClick={() => showToast('Tính năng cài đặt sắp ra mắt!', 'info')}>
            <Settings className="w-4 h-4" />
            <span className="text-xs font-medium">Settings</span>
          </div>
          <div className="text-on-surface-variant px-4 py-2 hover:text-primary flex items-center gap-3 cursor-pointer transition-colors" onClick={() => showToast('Trung tâm hỗ trợ sắp ra mắt!', 'info')}>
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Help</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
  );
};

const FeaturedTools = () => (
  <div className="mb-20">
    <div className="flex justify-between items-end mb-8">
      <div>
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Curation</span>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Featured Tools</h2>
      </div>
      <Link to="/directory" className="text-primary font-bold text-sm flex items-center gap-1 group">
        View Directory 
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {FEATURED_TOOLS.map((tool) => {
        const IconComponent = iconMap[tool.icon] || LayoutGrid;
        return (
          <Link to={`/tool/${tool.id}`} key={tool.id} className="block group bg-surface-container-lowest p-8 rounded-2xl hover:shadow-[0_8px_24px_rgba(25,28,29,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-surface-variant flex items-center justify-center rounded-xl">
                <IconComponent className="text-primary w-7 h-7" />
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-3 py-1 rounded-full">
                {tool.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);

const TrendingNow = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();

  const TOP_CATEGORIES = React.useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      count: cat.count || 0
    })).slice(0, 4);
  }, [categories]);

  return (
  <div className="mb-20">
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Trending Now</h2>
      <div className="h-px flex-1 bg-surface-container-highest"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-12 rounded-3xl text-on-primary flex flex-col justify-between min-h-[400px]">
        <div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-6 inline-block">Weekly Spotlight</span>
          <h3 className="text-4xl font-extrabold tracking-tighter mb-4 leading-tight">Mastering LLMs in the <br/>Modern Enterprise</h3>
          <p className="text-on-primary-container text-lg max-w-md opacity-90 leading-relaxed">
            Our comprehensive guide on deploying large language models securely within private corporate infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-8">
          <button onClick={() => navigate('/blog/1')} className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-bold text-sm hover:bg-surface-container transition-colors">
            Read Whitepaper
          </button>
          <span className="text-sm font-medium opacity-80">12 min read</span>
        </div>
      </div>
      <div className="bg-surface-container flex flex-col gap-6 p-8 rounded-3xl">
        <h4 className="font-bold text-on-surface">Top Categories</h4>
        <div className="space-y-4">
          {TOP_CATEGORIES.map(cat => (
            <div key={cat.name} onClick={() => navigate(`/directory?category=${encodeURIComponent(cat.name)}`)} className="flex justify-between items-center group cursor-pointer">
              <span className="text-on-surface-variant group-hover:text-primary transition-colors font-medium">{cat.name}</span>
              <span className="text-xs font-bold text-outline">{cat.count} tools</span>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZNz5ud5b00N3SMvDnaoGeerv6Ji_4rjJKDO8FBvT4j97mCeBTfH8crEq0BooL3iFT16paHCx_2xLQG2DgRzguQdZRBN2GGIBmO2WJgds_LTmB9RWVBZkmrpn7NRMtrdF_3A_FwB1pE0qvAjQe6ViZTVoHSjCaU-5DqtO4CbnpstY5TS6xfYouSyaLu5KREpTv_OMXxtuqiV8IW-2-ptHH-jDcCxksKF9fQzKB0ym1jBZy4Z_MlVTqHwCz7x4nxVZy2lYhXgNIoQI" 
            alt="Abstract AI visual" 
            className="w-full h-32 object-cover rounded-2xl grayscale opacity-30 group-hover:grayscale-0 transition-all"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  </div>
  );
};

const RecentInsights = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  return (
  <div className="mb-20">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Recent Insights</h2>
      <div className="flex gap-2">
        <button onClick={() => showToast('Đang ở trang đầu tiên', 'info')} className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-outline hover:text-primary transition-colors shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => showToast('Thêm bài viết sắp ra mắt!', 'info')} className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-outline hover:text-primary transition-colors shadow-sm">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {RECENT_INSIGHTS.map((post) => (
        <div key={post.id} onClick={() => navigate(`/blog/${post.id}`)} className="group cursor-pointer">
          <div className="overflow-hidden rounded-2xl mb-6 aspect-[16/10] bg-surface-container">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
            <span>{post.date}</span>
            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
            <span>{post.category}</span>
          </div>
          <h3 className="text-xl font-bold text-on-surface leading-tight mb-4 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-surface-container-highest"></div>
            <span className="text-xs font-semibold text-on-surface-variant">{post.author}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

const MobileNav = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  return (
  <div className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-surface-container flex justify-around py-3 px-4 z-50">
    <div onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-primary cursor-pointer">
      <Compass className="w-5 h-5" />
      <span className="text-[10px] font-bold">Explore</span>
    </div>
    <div onClick={() => navigate('/directory')} className="flex flex-col items-center gap-1 text-outline hover:text-on-surface transition-colors cursor-pointer">
      <Folder className="w-5 h-5" />
      <span className="text-[10px] font-bold">Directory</span>
    </div>
    <div onClick={() => showToast('Tính năng lưu sắp ra mắt!', 'info')} className="flex flex-col items-center gap-1 text-outline hover:text-on-surface transition-colors cursor-pointer">
      <Bookmark className="w-5 h-5" />
      <span className="text-[10px] font-bold">Saved</span>
    </div>
    <div onClick={() => showToast('Tính năng hồ sơ sắp ra mắt!', 'info')} className="flex flex-col items-center gap-1 text-outline hover:text-on-surface transition-colors cursor-pointer">
      <User className="w-5 h-5" />
      <span className="text-[10px] font-bold">Profile</span>
    </div>
  </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-16 md:pb-0">
        <Hero />
        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
          <div className="flex flex-col lg:flex-row gap-12">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <FeaturedTools />
              <TrendingNow />
              <RecentInsights />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
