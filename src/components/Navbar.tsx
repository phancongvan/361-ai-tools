import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export default function Navbar() {
  const { showToast } = useNotification();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinkClass = (path: string) =>
    `${isActive(path) ? 'text-indigo-700 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'} transition-colors`;

  // Close mobile menu on navigation
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm font-manrope antialiased tracking-tight">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">AI Curator</Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/directory" className={navLinkClass('/directory')}>Directory</Link>
            <Link to="/blog" className={navLinkClass('/blog')}>Blog</Link>
            <Link to="/top-lists" className={navLinkClass('/top-lists')}>Top Lists</Link>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/admin" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:scale-95 duration-200">CMS Login</Link>
          <button onClick={() => showToast('Sign in coming soon!', 'info')} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:scale-95 duration-200">Sign In</button>
          <button onClick={() => showToast('Sign up coming soon!', 'info')} className="px-5 py-2 text-sm font-bold bg-primary text-on-primary rounded-full hover:shadow-lg transition-all active:scale-95 duration-200">Get Started</button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 space-y-3">
          <Link to="/directory" className={`block py-2 ${navLinkClass('/directory')}`}>Directory</Link>
          <Link to="/blog" className={`block py-2 ${navLinkClass('/blog')}`}>Blog</Link>
          <Link to="/top-lists" className={`block py-2 ${navLinkClass('/top-lists')}`}>Top Lists</Link>
          <hr className="border-slate-100 dark:border-slate-800" />
          <Link to="/admin" className="block py-2 text-sm font-medium text-slate-600">CMS Login</Link>
          <button onClick={() => showToast('Sign up coming soon!', 'info')} className="w-full py-2 text-sm font-bold bg-primary text-on-primary rounded-full">Get Started</button>
        </div>
      )}
    </nav>
  );
}
