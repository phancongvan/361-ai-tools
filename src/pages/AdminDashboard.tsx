import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  Users, 
  BarChart, 
  Settings, 
  Search, 
  ExternalLink, 
  Bell, 
  HelpCircle, 
  Sparkles, 
  Banknote, 
  Rocket 
} from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { useArticles } from '../context/ArticleContext';

export default function AdminDashboard() {
  const { categories } = useCategories();
  const { articles, tools } = useArticles();
  
  // Real calculations
  const totalTools = tools.length;
  const activePosts = articles.filter(a => a.status === 'published').length;

  const getToolCountForCategory = (catName: string): number => {
    return tools.filter(t => t.category === catName).length;
  };

  const getToolCountRecursive = (cat: any): number => {
    let count = getToolCountForCategory(cat.name);
    if (cat.children) {
      count += cat.children.reduce((total: number, child: any) => total + getToolCountRecursive(child), 0);
    }
    return count;
  };

  const totalCount = categories.reduce((sum, cat) => sum + getToolCountRecursive(cat), 0);
  const topCategories = categories
    .map(cat => ({
      name: cat.name,
      percentage: totalCount > 0 ? Math.round((getToolCountRecursive(cat) / totalCount) * 100) : 0
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  const colors = ['bg-primary', 'bg-tertiary', 'bg-primary-container', 'bg-secondary'];
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-50 dark:bg-slate-900 flex flex-col p-4 font-['Manrope'] antialiased text-sm font-medium z-40">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">AI Curator</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">Admin Console</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center gap-3 px-4 py-3 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold" to="/admin">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            Dashboard
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" to="/admin/tools">
            <span className="material-symbols-outlined">handyman</span>
            Tool Management
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" to="/admin/categories">
            <span className="material-symbols-outlined">category</span>
            Category Management
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" to="/admin/content">
            <span className="material-symbols-outlined">article</span>
            Content Management
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" to="/admin/subscribers">
            <span className="material-symbols-outlined">group</span>
            Subscriber Management
          </Link>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined">analytics</span>
            Analytics
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
        </nav>
        <div className="mt-auto p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex items-center gap-3">
          <img alt="Admin Avatar" className="w-8 h-8 rounded-full bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3yN2xVBZQlCn-eaCuIWjIWypu-0IyaEsvjb_TewRo0a03NETDS3z66gWA91o0E5WKHf3pBBBJk_cH2MNWPvgQrJChG9L7FnOHxX-pRIlrca3_J4OEduHcaripZRE6F1JLuOo-hB4zFheTIggDf6eR9YvLb9TOWhcnNivLJuHUw1lwXURNghjf34TI3cydg58-KUP9thIdgFNTL6urkG88VG97cMtM-MFp03pW1b4TDU5mhF1_rNLTqjPrQnE-MJ6uSRUKuPsOwIo" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Alex Rivers</span>
            <span className="text-[10px] text-slate-500">Super Admin</span>
          </div>
          <button className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="ml-64 min-h-screen">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center h-16 px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-high border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search tools, users, or reports..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-500 hover:text-indigo-600 transition-all flex items-center gap-2 text-sm font-medium">
              View Site
              <ExternalLink className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-4">
              <button className="relative text-slate-500 hover:text-primary">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
              </button>
              <button className="text-slate-500 hover:text-primary">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <main className="p-8 max-w-[1280px] mx-auto">
          {/* Hero Title */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Network Overview</h2>
            <p className="text-on-surface-variant max-w-2xl">Real-time performance metrics and submission management for the AI Curator ecosystem.</p>
          </div>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">Total Tools</p>
              <h3 className="text-2xl font-extrabold tracking-tight">{totalTools}</h3>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+8.4%</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">Total Users</p>
              <h3 className="text-2xl font-extrabold tracking-tight">42.5k</h3>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Banknote className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">+15.2%</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">Monthly Revenue</p>
              <h3 className="text-2xl font-extrabold tracking-tight">$18,240</h3>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">-2.1%</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant mb-1">Active Posts</p>
              <h3 className="text-2xl font-extrabold tracking-tight">{activePosts}</h3>
            </div>
          </section>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Chart Section (Asymmetric 2/3) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="text-lg font-bold">Growth vs Engagement</h4>
                    <p className="text-sm text-on-surface-variant">Last 30 days performance</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                      <span className="text-xs font-medium">Tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                      <span className="text-xs font-medium">Users</span>
                    </div>
                  </div>
                </div>
                
                {/* Chart Visualization Placeholder */}
                <div className="relative h-64 w-full flex items-end justify-between gap-2 px-2">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="border-t border-slate-100 w-full h-px"></div>
                    <div className="border-t border-slate-100 w-full h-px"></div>
                    <div className="border-t border-slate-100 w-full h-px"></div>
                    <div className="border-t border-slate-100 w-full h-px"></div>
                    <div className="border-t border-slate-100 w-full h-px"></div>
                  </div>
                  
                  {/* Mock Data Bars/Lines */}
                  <div className="flex-1 flex flex-col justify-end gap-1">
                    <div className="w-full bg-primary/20 h-1/4 rounded-t-sm"></div>
                    <div className="w-full bg-tertiary h-1/2 rounded-t-sm"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end gap-1">
                    <div className="w-full bg-primary/20 h-2/4 rounded-t-sm"></div>
                    <div className="w-full bg-tertiary h-2/5 rounded-t-sm"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end gap-1">
                    <div className="w-full bg-primary/20 h-3/4 rounded-t-sm"></div>
                    <div className="w-full bg-tertiary h-3/5 rounded-t-sm"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end gap-1">
                    <div className="w-full bg-primary h-5/6 rounded-t-sm"></div>
                    <div className="w-full bg-tertiary h-4/6 rounded-t-sm"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end gap-1">
                    <div className="w-full bg-primary/20 h-4/5 rounded-t-sm"></div>
                    <div className="w-full bg-tertiary h-5/6 rounded-t-sm"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end gap-1">
                    <div className="w-full bg-primary/20 h-3/5 rounded-t-sm"></div>
                    <div className="w-full bg-tertiary h-full rounded-t-sm"></div>
                  </div>
                </div>
                <div className="flex justify-between mt-4 px-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] overflow-hidden">
                <div className="p-6 border-b border-surface-container">
                  <h4 className="text-lg font-bold">Recent Tool Submissions</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Submitter</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      <tr className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold">Lumina AI</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">Image Gen</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">mark.dev</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-fixed text-on-tertiary-fixed">Pending</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary font-bold text-sm hover:underline">Review</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold">CodeWhisper</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">Coding</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">sarah_k</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Approved</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary font-bold text-sm hover:underline">Review</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold">Flux Flow</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">Workflow</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">admin_alex</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-fixed text-on-tertiary-fixed">Pending</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary font-bold text-sm hover:underline">Review</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar Content (1/3) */}
            <div className="space-y-8">
              {/* Top Categories */}
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)]">
                <h4 className="text-lg font-bold mb-6">Top Performing Categories</h4>
                <div className="space-y-6">
                  {topCategories.map((cat, index) => (
                    <div key={cat.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">{cat.name}</span>
                        <span className="text-xs font-bold text-on-surface-variant">{cat.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full ${colors[index % colors.length]} rounded-full`} style={{ width: `${cat.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-surface-container-high rounded-full text-sm font-bold hover:bg-surface-container-highest transition-colors">
                  View All Categories
                </button>
              </div>

              {/* Upgrade / Notification Box */}
              <div className="bg-primary rounded-xl p-8 text-on-primary relative overflow-hidden group">
                {/* Abstract Background Decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl"></div>
                
                <Rocket className="w-8 h-8 mb-4 block" />
                <h4 className="text-xl font-bold mb-2">Pro Plan Analytics</h4>
                <p className="text-sm text-primary-fixed-dim leading-relaxed mb-6">Unlock deep demographic insights and cross-network tool performance comparison.</p>
                <button className="px-6 py-3 bg-white text-primary rounded-full text-sm font-bold shadow-lg active:scale-[0.98] transition-all">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
