/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Directory from './pages/Directory';
import ToolDetail from './pages/ToolDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminToolManagement from './pages/AdminToolManagement';
import AdminToolForm from './pages/AdminToolForm';
import AdminCategoryManagement from './pages/AdminCategoryManagement';
import AdminContentManagement from './pages/AdminContentManagement';
import AdminArticleEditor from './pages/AdminArticleEditor';
import AdminSubscriberManagement from './pages/AdminSubscriberManagement';
import ListicleDetail from './pages/ListicleDetail';
import TopLists from './pages/TopLists';
import { CategoryProvider } from './context/CategoryContext';
import { NotificationProvider } from './context/NotificationContext';
import { ArticleProvider } from './context/ArticleContext';
import { SubscriberProvider } from './context/SubscriberContext';

export default function App() {
  return (
    <NotificationProvider>
    <CategoryProvider>
    <ArticleProvider>
    <SubscriberProvider>
      <BrowserRouter>
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
          <Route path="/admin/content/edit/:id" element={<AdminArticleEditor />} />
        </Routes>
      </BrowserRouter>
    </SubscriberProvider>
    </ArticleProvider>
    </CategoryProvider>
    </NotificationProvider>
  );
}
