import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCategories, Category } from '../context/CategoryContext';
import { useArticles } from '../context/ArticleContext';
import { useNotification } from '../context/NotificationContext';
import TreeSelect from '../components/TreeSelect';

export default function AdminToolForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { tools, addTool, updateTool } = useArticles();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    category: categories[0]?.name || 'Generative Text',
    websiteUrl: '',
    fullDescription: '',
    features: [] as string[],
    pros: [] as string[],
    cons: [] as string[],
    image: '',
    pricingModel: 'Free',
    priceRange: '',
    pricingUrl: '',
    apiAvailable: true,
    openSource: false,
    mobileApp: true,
    rating: 0,
  });

  React.useEffect(() => {
    if (isEdit && id) {
      const tool = tools.find(t => t.id === id);
      if (tool) {
        setFormData({
          name: tool.name || '',
          slug: tool.slug || '',
          shortDescription: tool.badge || '',
          category: tool.category || (categories[0]?.name || 'Generative Text'),
          websiteUrl: tool.externalLink || '',
          fullDescription: tool.verdict || '',
          features: tool.features || [],
          pros: tool.pros || [],
          cons: tool.cons || [],
          image: tool.image || '',
          pricingModel: tool.pricingTier || 'Free',
          priceRange: tool.pricingAmount || '',
          pricingUrl: '',
          apiAvailable: tool.apiAvailable ?? true,
          openSource: tool.openSource ?? false,
          mobileApp: tool.mobileApp ?? true,
          rating: tool.rating || 0,
        });
      }
    }
  }, [isEdit, id, tools, categories]);

  const [newFeature, setNewFeature] = useState('');
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  const handleAddList = (field: 'features' | 'pros' | 'cons', value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter('');
    }
  };

  const handleRemoveList = (field: 'features' | 'pros' | 'cons', itemToRemove: string) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((f: string) => f !== itemToRemove) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleToggle = (field: 'apiAvailable' | 'openSource' | 'mobileApp') => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleSaveDraft = () => {
    showToast('Draft saved successfully', 'info');
    navigate('/admin/tools');
  };

  const handleSubmit = () => {
    const newToolData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[\s\W-]+/g, '-'),
      badge: formData.shortDescription,
      category: formData.category,
      externalLink: formData.websiteUrl,
      verdict: formData.fullDescription,
      features: formData.features,
      pros: formData.pros,
      cons: formData.cons,
      image: formData.image,
      pricingTier: formData.pricingModel,
      pricingAmount: formData.priceRange,
      apiAvailable: formData.apiAvailable,
      openSource: formData.openSource,
      mobileApp: formData.mobileApp,
      rating: parseFloat(String(formData.rating)) || 0
    };

    if (isEdit && id) {
      updateTool(id, newToolData);
      showToast('Tool updated successfully', 'success');
    } else {
      addTool({
        id: `tool-${Date.now()}`,
        ...newToolData
      } as any);
      showToast('New tool added successfully', 'success');
    }
    navigate('/admin/tools');
  };

  const handleDiscard = () => {
    navigate('/admin/tools');
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen">
      {/* Side Navigation Shell */}
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

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* Top Navigation */}
        <header className="w-full h-16 sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/20 shadow-sm flex items-center justify-between px-8">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Search resources..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="material-symbols-outlined text-slate-500 group-hover:text-indigo-600 transition-colors">account_circle</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Admin Console</span>
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="p-10 max-w-6xl mx-auto">
          {/* Breadcrumbs & Header */}
          <div className="mb-10">
            <Link className="inline-flex items-center text-primary font-semibold text-sm mb-4 hover:gap-2 transition-all" to="/admin/tools">
              <span className="material-symbols-outlined text-base mr-1">arrow_back</span>
              Back to Tool Management
            </Link>
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">{isEdit ? 'Edit AI Tool' : 'Add New AI Tool'}</h2>
                <p className="text-on-surface-variant mt-2 text-lg">{isEdit ? 'Update the details of the existing AI solution.' : 'Onboard a new artificial intelligence solution to the directory.'}</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleSaveDraft} className="px-6 py-2.5 bg-surface-container-high text-on-surface font-bold rounded-full hover:bg-surface-variant transition-colors">Save as Draft</button>
                <button type="button" onClick={handleSubmit} className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">{isEdit ? 'Update Tool' : 'Publish Tool'}</button>
              </div>
            </div>
          </div>

          {/* Form Content: Bento Grid Style Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (Main Form) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Basic Information Card */}
              <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">info</span>
                  <h3 className="text-xl font-bold">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Tool Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Jasper AI" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Slug</label>
                    <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" placeholder="jasper-ai" type="text" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-on-surface-variant">Short Description</label>
                    <input name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Brief tagline of what the tool does..." type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Category</label>
                    <TreeSelect 
                      value={formData.category} 
                      onChange={(val) => setFormData(prev => ({ ...prev, category: val }))} 
                      categories={categories} 
                      placeholder="Select Category" 
                      className="w-full" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Website URL</label>
                    <input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" placeholder="https://..." type="url" />
                  </div>
                </div>
              </section>

              {/* Detailed Content Card */}
              <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">description</span>
                  <h3 className="text-xl font-bold">Detailed Content</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Full Description</label>
                    <textarea 
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleChange}
                      className="w-full bg-surface-container rounded-lg border-none min-h-[200px] p-4 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none resize-y"
                      placeholder="Enter the full description of the tool here. You can use Markdown formatting."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Features (Multi-input)</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold flex items-center gap-1">
                          {feature} <span className="material-symbols-outlined text-xs cursor-pointer" onClick={() => handleRemoveList('features', feature)}>close</span>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" 
                        placeholder="Add a feature and press Enter" 
                        type="text" 
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddList('features', newFeature, setNewFeature);
                          }
                        }}
                      />
                      <button type="button" onClick={() => handleAddList('features', newFeature, setNewFeature)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm">Add</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-600">Pros (Ưu điểm)</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.pros.map((pro, idx) => (
                        <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
                          {pro} <span className="material-symbols-outlined text-xs cursor-pointer" onClick={() => handleRemoveList('pros', pro)}>close</span>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" 
                        placeholder="Add a pro and press Enter" 
                        type="text" 
                        value={newPro}
                        onChange={(e) => setNewPro(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddList('pros', newPro, setNewPro);
                          }
                        }}
                      />
                      <button type="button" onClick={() => handleAddList('pros', newPro, setNewPro)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm">Add</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-rose-500">Cons (Nhược điểm)</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.cons.map((con, idx) => (
                        <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 rounded-full text-xs font-bold flex items-center gap-1">
                          {con} <span className="material-symbols-outlined text-xs cursor-pointer" onClick={() => handleRemoveList('cons', con)}>close</span>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" 
                        placeholder="Add a con and press Enter" 
                        type="text" 
                        value={newCon}
                        onChange={(e) => setNewCon(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddList('cons', newCon, setNewCon);
                          }
                        }}
                      />
                      <button type="button" onClick={() => handleAddList('cons', newCon, setNewCon)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm">Add</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Media Assets Card */}
              <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">image</span>
                  <h3 className="text-xl font-bold">Media</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-on-surface-variant">Featured Image</label>
                    <div className="aspect-video w-full rounded-xl bg-surface-container overflow-hidden group relative cursor-pointer flex items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-all">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-3xl text-slate-300">cloud_upload</span>
                        <p className="text-xs text-slate-400 mt-2">16:9 Aspect Ratio Recommended</p>
                      </div>
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-on-surface-variant">Screenshot Gallery</label>
                    <div className="grid grid-cols-2 gap-3 h-full">
                      <div className="aspect-square bg-surface-container rounded-lg border-2 border-dashed border-outline-variant/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined text-xl text-slate-300">add</span>
                      </div>
                      <div className="aspect-square bg-surface-container rounded-lg border-2 border-dashed border-outline-variant/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined text-xl text-slate-300">add</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column (Settings & Attributes) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Pricing Model Card */}
              <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">payments</span>
                  <h3 className="text-xl font-bold">Pricing</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Model Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Free', 'Freemium', 'Paid'].map((model) => (
                        <button 
                          key={model}
                          type="button"
                          onClick={() => setFormData({ ...formData, pricingModel: model })}
                          className={`py-2 rounded-lg text-xs font-bold transition-colors ${formData.pricingModel === model ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Price Range</label>
                    <input name="priceRange" value={formData.priceRange} onChange={handleChange} className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" placeholder="$0 - $49/mo" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Pricing Page URL</label>
                    <input name="pricingUrl" value={formData.pricingUrl} onChange={handleChange} className="w-full bg-surface-container p-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none" placeholder="https://tool.com/pricing" type="url" />
                  </div>
                </div>
              </section>

              {/* Technical Specs Card */}
              <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">settings_ethernet</span>
                  <h3 className="text-xl font-bold">Technical Specs</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                    <span className="font-bold text-sm">API Available</span>
                    <button type="button" onClick={() => toggleToggle('apiAvailable')} className={`w-12 h-6 rounded-full relative shadow-inner transition-colors ${formData.apiAvailable ? 'bg-primary' : 'bg-slate-300'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.apiAvailable ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                    <span className="font-bold text-sm">Open Source</span>
                    <button type="button" onClick={() => toggleToggle('openSource')} className={`w-12 h-6 rounded-full relative shadow-inner transition-colors ${formData.openSource ? 'bg-primary' : 'bg-slate-300'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.openSource ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                    <span className="font-bold text-sm">Mobile App</span>
                    <button type="button" onClick={() => toggleToggle('mobileApp')} className={`w-12 h-6 rounded-full relative shadow-inner transition-colors ${formData.mobileApp ? 'bg-primary' : 'bg-slate-300'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.mobileApp ? 'right-1' : 'left-1'}`}></span>
                    </button>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-bold text-on-surface-variant text-amber-500">Star Rating (0-5)</label>
                    <div className="flex items-center gap-4 bg-surface-container p-3 rounded-lg">
                      <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <input 
                        name="rating" 
                        type="number" 
                        min="0" 
                        max="5" 
                        step="0.1" 
                        value={formData.rating} 
                        onChange={handleChange} 
                        className="w-full bg-transparent border-none focus:ring-0 outline-none font-bold text-lg" 
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Logo Upload Card */}
              <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">branding_watermark</span>
                  <h3 className="text-xl font-bold">Brand Logo</h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-surface-container rounded-full border-2 border-dashed border-outline-variant/30 flex items-center justify-center relative group overflow-hidden cursor-pointer mb-4">
                    {formData.image ? (
                      <img src={formData.image} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl opacity-20">photo_camera</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Upload</span>
                    </div>
                  </div>
                  <input name="image" value={formData.image} onChange={handleChange} className="w-full bg-surface-container p-3 rounded-lg border-none mb-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-center" placeholder="Or enter Image URL" type="url" />
                  <p className="text-center text-xs text-on-surface-variant px-4">Square image, min 512x512px. PNG or SVG preferred.</p>
                </div>
              </section>
            </div>
          </div>

          {/* Transactional Context Section */}
          <div className="mt-16 p-8 bg-primary/5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Ready for review?</h4>
                <p className="text-on-surface-variant text-sm">Published tools are immediately visible to all platform users.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={handleDiscard} className="px-8 py-3 bg-white text-on-surface font-extrabold rounded-full shadow-sm hover:shadow-md transition-all">Discard</button>
              <button type="button" onClick={handleSubmit} className="px-10 py-3 bg-primary text-on-primary font-extrabold rounded-full shadow-xl shadow-primary/25 hover:brightness-110 transition-all">{isEdit ? 'Update Tool' : 'Publish Tool'}</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
