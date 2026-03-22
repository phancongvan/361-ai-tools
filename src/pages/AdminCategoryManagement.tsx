import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories, Category } from '../context/CategoryContext';
import { useNotification } from '../context/NotificationContext';
import { useArticles } from '../context/ArticleContext';

export default function AdminCategoryManagement() {
  const { categories, addCategory, addSubCategory, updateCategory, deleteCategory } = useCategories();
  const { showConfirm, showToast } = useNotification();
  const { articles, tools } = useArticles();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categories.length > 0 && categories[0].children ? categories[0].children[0] : categories[0]
  );
  
  const [categoryName, setCategoryName] = useState(selectedCategory?.name || '');
  const [categorySlug, setCategorySlug] = useState(selectedCategory?.slug || '');
  const [categoryDescription, setCategoryDescription] = useState(selectedCategory?.description || '');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({ '1': true });

  const getToolCountForCategory = (catName: string): number => {
    return tools.filter(t => t.category === catName).length;
  };

  const getToolCountRecursive = (cat: Category): number => {
    let count = getToolCountForCategory(cat.name);
    if (cat.children) {
      count += cat.children.reduce((total: number, child: Category) => total + getToolCountRecursive(child), 0);
    }
    return count;
  };

  const handleNewCategory = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newCat: Category = {
      id: newId,
      name: 'New Category',
      slug: 'new-category',
      description: '',
      count: 0
    };
    addCategory(newCat);
    handleSelectCategory(newCat);
  };

  const handleSaveCategory = () => {
    if (selectedCategory) {
      updateCategory(selectedCategory.id, {
        name: categoryName,
        slug: categorySlug,
        description: categoryDescription
      });
      // Optionally show a success toast here
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      const confirmed = await showConfirm({
        title: 'Xoá danh mục',
        message: `Bạn có chắc chắn muốn xoá danh mục "${selectedCategory.name}"? Hành động này không thể hoàn tác.`,
        confirmText: 'Xoá',
        cancelText: 'Huỷ',
        variant: 'danger',
      });
      if (confirmed) {
        deleteCategory(selectedCategory.id);
        setSelectedCategory(null);
        setCategoryName('');
        setCategorySlug('');
        setCategoryDescription('');
        showToast('Danh mục đã được xoá', 'success');
      }
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setCategoryName(cat.name);
    setCategorySlug(cat.slug);
    setCategoryDescription(cat.description || '');
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return (
      <ul className={`text-sm ${level === 0 ? 'space-y-0.5' : 'relative'}`}>
        {/* Vertical connector line for sub-levels */}
        {level > 0 && (
          <div 
            className="absolute left-3 top-0 bottom-0 border-l-2 border-slate-200 dark:border-slate-700" 
            style={{ marginLeft: `${(level - 1) * 40 + 16}px` }} 
          />
        )}
        {cats.map((cat, catIndex) => {
          const isExpanded = expandedCats[cat.id];
          const isSelected = selectedCategory?.id === cat.id;
          const hasChildren = cat.children && cat.children.length > 0;
          const isLastChild = catIndex === cats.length - 1;

          return (
            <li key={cat.id} className="relative">
              <div 
                onClick={() => handleSelectCategory(cat)}
                className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl cursor-pointer group transition-all duration-150 ${
                  isSelected 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 shadow-sm' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                style={{ paddingLeft: `${level * 40 + 12}px` }}
              >
                {/* Expand/Collapse chevron or leaf arrow */}
                {hasChildren ? (
                  <span 
                    onClick={(e) => toggleExpand(cat.id, e)}
                    className={`material-symbols-outlined text-lg transition-transform duration-200 cursor-pointer select-none ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'
                    } ${isExpanded ? '' : ''}`}
                    style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                  >
                    expand_more
                  </span>
                ) : (
                  <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-600'}`}>
                    subdirectory_arrow_right
                  </span>
                )}
                
                {/* Folder icon for parent categories */}
                {hasChildren && (
                  <span 
                    className={`material-symbols-outlined text-xl ${
                      isSelected 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : level === 0 ? 'text-indigo-500' : 'text-indigo-400 dark:text-indigo-500'
                    }`} 
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isExpanded ? 'folder_open' : 'folder'}
                  </span>
                )}

                {/* Category name */}
                <span className={`flex-1 truncate ${
                  isSelected 
                    ? 'font-bold text-indigo-700 dark:text-indigo-300' 
                    : hasChildren 
                      ? 'font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900' 
                      : 'font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}>
                  {cat.name}
                </span>
                
                {/* Tool count badge */}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full min-w-[28px] text-center ${
                  isSelected 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40' 
                    : getToolCountRecursive(cat) > 0 
                      ? 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400'
                      : 'text-slate-300 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-600'
                }`}>
                  {getToolCountRecursive(cat)}
                </span>

                {/* Add subcategory button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const newId = Math.random().toString(36).substr(2, 9);
                    const newCat: Category = {
                      id: newId,
                      name: 'New Subcategory',
                      slug: 'new-subcategory',
                      description: '',
                      count: 0
                    };
                    addSubCategory(cat.id, newCat);
                    setExpandedCats(prev => ({ ...prev, [cat.id]: true }));
                    handleSelectCategory(newCat);
                  }}
                  className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-sm text-slate-400 hover:text-indigo-600 transition-all ml-0.5"
                  title="Add Subcategory"
                >
                  add
                </button>
              </div>
              
              {hasChildren && isExpanded && renderCategoryTree(cat.children!, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-50 dark:bg-slate-900 flex flex-col p-4 z-40 font-['Manrope'] antialiased text-sm font-medium">
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
          <Link className="flex items-center gap-3 px-4 py-3 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold" to="/admin/categories">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
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
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800/50 shadow-sm dark:shadow-none flex justify-between items-center h-16 px-8">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-96 hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input type="text" placeholder="Search categories..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-xl">help</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 flex flex-col max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">Category Management</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Organize and structure your AI tool directory.</p>
            </div>
            <button 
              onClick={handleNewCategory}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New Category
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-start">
            
            {/* Left Column: Category Hierarchy */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sticky top-24">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Hierarchy</h3>
                <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <span className="material-symbols-outlined text-sm">unfold_more</span>
                </button>
              </div>
              <div className="p-3 overflow-y-auto max-h-[calc(100vh-280px)]">
                {/* Tree View */}
                {renderCategoryTree(categories)}
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <p className="text-xs text-slate-500 text-center">Drag and drop to reorder</p>
              </div>
            </div>

            {/* Right Column: Category Details & Products */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Category Settings Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500">settings</span>
                    Category Settings
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDeleteCategory}
                      className="px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={handleSaveCategory}
                      className="px-4 py-2 text-sm font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category Name</label>
                      <input 
                        type="text" 
                        value={categoryName} 
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">URL Slug</label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-sm text-slate-500">/category/</span>
                        <input 
                          type="text" 
                          value={categorySlug} 
                          onChange={(e) => setCategorySlug(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-r-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-slate-600 dark:text-slate-300" 
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                    <textarea 
                      rows={3} 
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-300 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Linked Products Card */}
              {(() => {
                const linkedTools = tools.filter(t => t.category === selectedCategory?.name);

                return (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/10">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-indigo-500">inventory_2</span>
                          Linked Products
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{linkedTools.length} tool{linkedTools.length !== 1 ? 's' : ''} currently in this category (from Listicles)</p>
                      </div>
                  <Link 
                    to="/admin/tools/new"
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add_link</span>
                    Add Tool
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-6 py-3">Tool Name</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Added Date</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {linkedTools.length > 0 ? linkedTools.map((tool: any, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">{tool.name.charAt(0)}</div>
                              <span className="font-bold text-slate-900 dark:text-white">{tool.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {tool.status === 'published' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                {tool.status === 'draft' ? 'Draft' : 'Scheduled'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-500">{tool.date}</td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/admin/content-edit/${tool.listicleId}`} className="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100" title="Go to Listicle">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No tools found in this category. Generate a listicle to see tools here.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-center">
                  <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">View All {linkedTools.length} Products</button>
                </div>
              </div>
            );
          })()}

            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
