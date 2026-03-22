import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscribers } from '../context/SubscriberContext';

export default function AdminSubscriberManagement() {
  const { subscribers } = useSubscribers();
  
  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    
    // Create CSV header
    const headers = ['Email', 'Source', 'Date'];
    const csvContent = [
      headers.join(','),
      ...subscribers.map(sub => `"${sub.email}","${sub.source}","${sub.date}"`)
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <Link className="flex items-center gap-3 px-4 py-3 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold" to="/admin/subscribers">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
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
        </div>
      </aside>

      {/* Main Content Shell */}
      <main className="ml-64 min-h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800/50 shadow-sm dark:shadow-none flex justify-between items-center h-16 px-8 ml-0">
          <div className="flex items-center gap-6 flex-1">
            <span className="hidden md:block text-lg font-bold text-slate-900 dark:text-white">Admin Central</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-primary hover:underline">View Site</Link>
          </div>
        </header>

        {/* Page Content */}
        <section className="p-8 max-w-7xl mx-auto w-full flex-1">
          {/* Page Header */}
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Subscriber Management</h1>
            <p className="text-on-surface-variant text-sm max-w-xl">Manage your email captures from unlocked features and newsletter signups.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">mail</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{subscribers.length}</h3>
                <p className="text-sm text-on-surface-variant">Total Captured Emails</p>
              </div>
            </div>
            <button 
              onClick={handleExportCSV}
              className="bg-surface-container-high hover:bg-surface-container-highest px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={subscribers.length === 0}
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export CSV
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Source / Trigger</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date Captured</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-on-surface">{sub.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary-container text-on-secondary-container">
                        {sub.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {sub.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                   <tr>
                     <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No subscribers yet.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
