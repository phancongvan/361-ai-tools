/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { CategoryProvider } from './context/CategoryContext';
import { NotificationProvider } from './context/NotificationContext';
import { ArticleProvider } from './context/ArticleContext';
import { SubscriberProvider } from './context/SubscriberContext';

// Lazy load all page components for better initial load
const Home = lazy(() => import('./pages/Home'));
const Directory = lazy(() => import('./pages/Directory'));
const ToolDetail = lazy(() => import('./pages/ToolDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const TopLists = lazy(() => import('./pages/TopLists'));
const ListicleDetail = lazy(() => import('./pages/ListicleDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminToolManagement = lazy(() => import('./pages/AdminToolManagement'));
const AdminToolForm = lazy(() => import('./pages/AdminToolForm'));
const AdminCategoryManagement = lazy(() => import('./pages/AdminCategoryManagement'));
const AdminContentManagement = lazy(() => import('./pages/AdminContentManagement'));
const AdminArticleEditor = lazy(() => import('./pages/AdminArticleEditor'));
const AdminSubscriberManagement = lazy(() => import('./pages/AdminSubscriberManagement'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// 404 Page
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-on-surface-variant text-lg mb-8">Page not found</p>
        <Link to="/" className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:shadow-md transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
    <CategoryProvider>
    <ArticleProvider>
    <SubscriberProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/tool/:id" element={<ToolDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/top-lists" element={<TopLists />} />
            <Route path="/listicle/:id" element={<ListicleDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tools" element={<AdminToolManagement />} />
            <Route path="/admin/tools/new" element={<AdminToolForm />} />
            <Route path="/admin/tools/edit/:id" element={<AdminToolForm />} />
            <Route path="/admin/categories" element={<AdminCategoryManagement />} />
            <Route path="/admin/content" element={<AdminContentManagement />} />
            <Route path="/admin/subscribers" element={<AdminSubscriberManagement />} />
            <Route path="/admin/content/new" element={<AdminArticleEditor />} />
            <Route path="/admin/content/edit/:id" element={<AdminArticleEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SubscriberProvider>
    </ArticleProvider>
    </CategoryProvider>
    </NotificationProvider>
  );
}
