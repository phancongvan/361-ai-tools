import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories, Category } from '../context/CategoryContext';
import { useArticles } from '../context/ArticleContext';
import { useNotification } from '../context/NotificationContext';
import TreeSelect from '../components/TreeSelect';

export default function AdminToolManagement() {
  const { categories } = useCategories();
  const { tools, togglePopularTool, deleteTool } = useArticles();
  const { showToast, showConfirm } = useNotification();
  const [categoryFilter, setCategoryFilter] = useState('');

  let allTools = [...tools];

  if (categoryFilter) {
    allTools = allTools.filter(t => t.category === categoryFilter);
  }

  const handleTogglePopular = (tool: any) => {
    const success = togglePopularTool(tool.id);
    if (!success) {
      showToast('Chỉ được chọn tối đa 4 tool Nổi bật (Popular)!', 'error');
    } else {
      showToast(tool.popular ? `Đã bỏ chọn ${tool.name} khỏi danh sách Popular` : `Đã thêm ${tool.name} vào danh sách Popular`, 'success');
    }
  };

  const handleDeleteTool = async (tool: any) => {
    const confirmed = await showConfirm(`Are you sure you want to delete ${tool.name}? This action cannot be undone.`);
    if (confirmed) {
      deleteTool(tool.id);
      showToast(`${tool.name} removed successfully`, 'success');
    }
  };

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
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" to="/admin">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold" to="/admin/tools">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>handyman</span>
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

      {/* Main Content Shell */}
      <main className="ml-64 min-h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800/50 shadow-sm dark:shadow-none flex justify-between items-center h-16 px-8 ml-0">
          <div className="flex items-center gap-6 flex-1">
            <span className="hidden md:block text-lg font-bold text-slate-900 dark:text-white">Admin Central</span>
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input className="w-full pl-10 pr-4 py-1.5 bg-surface-container-high/50 border-0 rounded-full text-sm focus:ring-2 focus:ring-primary/20 placeholder-slate-400" placeholder="Global search..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
            <Link to="/" className="text-sm font-medium text-primary hover:underline">View Site</Link>
            <img alt="Admin Profile" className="w-8 h-8 rounded-full ring-2 ring-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEJxf3DHmbc6zo2lLnaTlEKYP_UnWRVgc17OchYMbgd6ZuN7xmI_0hxm2Ug1EFDIPe_pq-MGDaxACAJO78J96DpXjq-t3uH8QuAIq89fc1tXNwwlZ6YrEGFh9hl-U81i0Yq9T7I37td9rmUAg0OR_vyEj-5wY1mQgXLv6PR8N_5mnjOpDe8ABl7BFHIFhcYjAL6u05jGX9Pfh-CZbUIMZFYipZ5ZN8o3VLoaaw2MXhQALRZuud9dXI_aEPt4BNzbIlU6lT7dUKwNs" />
          </div>
        </header>

        {/* Page Content */}
        <section className="p-8 max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Tool Management</h1>
              <p className="text-on-surface-variant text-sm max-w-xl">Curate, update, and manage the AI directory listings. Ensure all technical specifications and pricing models are accurate for the end-users.</p>
            </div>
            <Link to="/admin/tools/new" className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              <span className="material-symbols-outlined text-lg">add</span>
              Add New Tool
            </Link>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">filter_list</span>
                <input className="w-full pl-10 pr-4 py-2 bg-surface-container border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" placeholder="Filter by tool name..." type="text" />
              </div>
            </div>
            <TreeSelect 
              value={categoryFilter} 
              onChange={setCategoryFilter} 
              categories={categories} 
              placeholder="All Categories" 
              className="min-w-[180px]" 
            />
            <select className="bg-surface-container border-0 rounded-lg text-sm py-2 px-4 focus:ring-2 focus:ring-primary/20 min-w-[140px]">
              <option>Pricing</option>
              <option>Free</option>
              <option>Freemium</option>
              <option>Paid</option>
            </select>
            <select className="bg-surface-container border-0 rounded-lg text-sm py-2 px-4 focus:ring-2 focus:ring-primary/20 min-w-[140px]">
              <option>Tech Specs</option>
              <option>API Available</option>
              <option>Open Source</option>
              <option>Enterprise</option>
            </select>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>

          {/* Data Table Container */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tool Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pricing</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-center">Popular</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {allTools.length > 0 ? allTools.map((tool, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{tool.name}</div>
                          <div className="text-[11px] text-on-surface-variant">Added: {tool.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface-variant">{tool.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary-fixed text-on-tertiary-fixed">{tool.pricingTier || 'Free'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleTogglePopular(tool)}
                        className={`p-1.5 rounded-lg transition-colors ${tool.popular ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        title={tool.popular ? "Remove from Popular" : "Mark as Popular"}
                      >
                        <span className="material-symbols-outlined border-none text-xl" style={tool.popular ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`/tool/${tool.slug || tool.name.toLowerCase().replace(/[^\w-]+/g, '-')}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1.5 text-on-surface-variant hover:text-emerald-600 transition-colors"
                          title="View on Site"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </a>
                        <Link to={`/admin/tools/edit/${tool.id}`} className="p-1.5 text-on-surface-variant hover:text-primary transition-colors" title="Edit Tool"><span className="material-symbols-outlined text-lg">edit</span></Link>
                        <button onClick={() => handleDeleteTool(tool)} className="p-1.5 text-on-surface-variant hover:text-error transition-colors" title="Delete Tool">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No tools found. Click "Add New Tool" to create one.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low/20">
              <span className="text-xs text-on-surface-variant">Showing 1 to {allTools.length} of {allTools.length} results</span>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-xs font-medium flex items-center justify-center">2</button>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-xs font-medium flex items-center justify-center">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-xs font-medium flex items-center justify-center">6</button>
                <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Stats Summary (Extra context) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl shadow-indigo-900/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1">Total Tools Managed</div>
                <div className="text-xl font-bold">{allTools.length} Tools</div>
              </div>
              <span className="material-symbols-outlined text-3xl opacity-30">palette</span>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Pending / Drafts</div>
                <div className="text-xl font-bold text-on-surface">{allTools.filter(t => t.status !== 'published').length} Tools</div>
              </div>
              <span className="material-symbols-outlined text-3xl text-primary/40">pending_actions</span>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Published Tools</div>
                <div className="text-xl font-bold text-on-surface">{allTools.filter(t => t.status === 'published').length}</div>
              </div>
              <span className="material-symbols-outlined text-3xl text-primary/40">trending_up</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
