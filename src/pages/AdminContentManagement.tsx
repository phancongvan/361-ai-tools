import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';
import { useNotification } from '../context/NotificationContext';

export default function AdminContentManagement() {
  const { articles, deleteArticle, toggleFeatured } = useArticles();
  const { showConfirm, showToast } = useNotification();
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'blog' | 'listicle'>('all');

  const filteredArticles = React.useMemo(() => {
    return articles.filter(article => {
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
      const matchesType = typeFilter === 'all' || article.type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [articles, statusFilter, typeFilter]);

  const handleDelete = (id: string, title: string) => {
    showConfirm(
      'Xóa Bài Viết',
      `Bạn có chắc chắn muốn xóa bài viết "${title}" không? Hành động này không thể hoàn tác.`,
      'danger',
      () => {
        deleteArticle(id);
        showToast('Đã xóa bài viết thành công!', 'success');
      }
    );
  };
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-50 dark:bg-slate-900 font-['Manrope'] antialiased text-sm font-medium flex flex-col p-4 z-40">
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
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" to="/admin/tools">
            <span className="material-symbols-outlined">handyman</span>
            Tool Management
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200" to="/admin/categories">
            <span className="material-symbols-outlined">category</span>
            Category Management
          </Link>
          {/* Active Tab: Content Management */}
          <Link className="flex items-center gap-3 px-4 py-3 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold" to="/admin/content">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>article</span>
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
      <div className="ml-64 min-h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800/50 shadow-sm dark:shadow-none flex justify-between items-center h-16 px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400" placeholder="Search articles, tags, or authors..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/" className="text-slate-500 hover:text-indigo-600 transition-all font-medium text-sm">View Site</Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <img alt="Admin Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEJxf3DHmbc6zo2lLnaTlEKYP_UnWRVgc17OchYMbgd6ZuN7xmI_0hxm2Ug1EFDIPe_pq-MGDaxACAJO78J96DpXjq-t3uH8QuAIq89fc1tXNwwlZ6YrEGFh9hl-U81i0Yq9T7I37td9rmUAg0OR_vyEj-5wY1mQgXLv6PR8N_5mnjOpDe8ABl7BFHIFhcYjAL6u05jGX9Pfh-CZbUIMZFYipZ5ZN8o3VLoaaw2MXhQALRZuud9dXI_aEPt4BNzbIlU6lT7dUKwNs" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1 w-full max-w-7xl mx-auto">
          {/* Dashboard Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Content Management</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">Create, edit, and organize your editorial pieces. Curate the future of AI through high-quality insights.</p>
            </div>
            <Link to="/admin/content/new" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap">
              <span className="material-symbols-outlined text-lg">add</span>
              Create New Post
            </Link>
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Total Articles</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{articles.length}</span>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Total Views</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">84.2k</span>
                <span className="text-xs text-emerald-600 font-bold">+5.4k</span>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Drafts</p>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">14</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Engagement</p>
                <span className="material-symbols-outlined text-indigo-600 text-lg">trending_up</span>
              </div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">4.8%</span>
            </div>
          </section>

          {/* Filters & Tools Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setStatusFilter('published')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === 'published' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}`}
                  >
                    Live
                  </button>
                  <button 
                    onClick={() => setStatusFilter('draft')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === 'draft' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}`}
                  >
                    Drafts
                  </button>
                  <button 
                    onClick={() => setStatusFilter('scheduled')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === 'scheduled' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}`}
                  >
                    Scheduled
                  </button>
                </div>
                
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button 
                    onClick={() => setTypeFilter('all')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${typeFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}`}
                  >
                    Any Type
                  </button>
                  <button 
                    onClick={() => setTypeFilter('blog')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${typeFilter === 'blog' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}`}
                  >
                    Blog
                  </button>
                  <button 
                    onClick={() => setTypeFilter('listicle')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${typeFilter === 'listicle' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}`}
                  >
                    Listicle
                  </button>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  More Filters
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Sort by: <span className="text-slate-900 dark:text-white font-bold">Newest First</span></span>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <span className="material-symbols-outlined">list</span>
              </button>
            </div>
          </div>

          {/* Editorial Content Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Article</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Featured</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Type</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Author</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Views</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img className="w-16 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" alt="Article thumbnail" src={article.image || 'https://picsum.photos/seed/placeholder/100/60'} />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{article.title}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tight font-medium">ai-curator.com/{article.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => {
                            toggleFeatured(article.id, article.type);
                            showToast(`Đã ghi nhận bài viết "${article.title}" là tiêu biểu!`, 'success');
                          }}
                          className={`transition-all hover:scale-110 active:scale-95 ${article.featured ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-200'}`}
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: article.featured ? "'FILL' 1" : "'FILL' 0" }}>
                            star
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${article.type === 'listicle' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'}`}>
                          {article.type === 'listicle' ? 'Listicle' : 'Blog'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {article.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{article.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-bold">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          <span className={`text-xs font-bold ${article.status === 'published' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                            {article.status === 'published' ? 'Live' : 'Draft'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">0</td>
                      <td className="px-6 py-5 text-xs text-slate-500 dark:text-slate-400">
                        {article.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a 
                            href={`/${article.type === 'listicle' ? 'listicle' : 'blog'}/${article.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors text-slate-400"
                            title="View Live"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </a>
                          <Link to={`/admin/content/edit/${article.id}`} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-slate-400" title="Edit">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>
                          <button onClick={() => handleDelete(article.id, article.title)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors text-slate-400">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-slate-900 dark:text-white">1-{filteredArticles.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredArticles.length}</span> entries</p>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-bold shadow-sm">1</button>
                <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer Note */}
          <footer className="mt-12 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold opacity-50">© 2024 Admin Central • AI Curator Content Management System</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
