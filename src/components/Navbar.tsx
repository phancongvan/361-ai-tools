import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export default function Navbar() {
  const { showToast } = useNotification();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm font-manrope antialiased tracking-tight">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">AI Curator</Link>
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/directory" 
              className={`${isActive('/directory') ? 'text-indigo-700 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-1' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'} transition-colors`}
            >
              Directory
            </Link>
            <Link 
              to="/blog" 
              className={`${isActive('/blog') ? 'text-indigo-700 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-1' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'} transition-colors`}
            >
              Blog
            </Link>
            <Link 
              to="/top-lists" 
              className={`${isActive('/top-lists') ? 'text-indigo-700 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-1' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'} transition-colors`}
            >
              Top Lists
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:scale-95 duration-200">CMS Login</Link>
          <button onClick={() => showToast('Tính năng đăng nhập sắp ra mắt!', 'info')} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:scale-95 duration-200">Sign In</button>
          <button onClick={() => showToast('Tính năng đăng ký sắp ra mắt!', 'info')} className="px-5 py-2 text-sm font-bold bg-primary text-on-primary rounded-full hover:shadow-lg transition-all active:scale-95 duration-200">Get Started</button>
        </div>
      </div>
    </nav>
  );
}
