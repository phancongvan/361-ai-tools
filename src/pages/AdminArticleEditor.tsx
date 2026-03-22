import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';
import { useCategories } from '../context/CategoryContext';
import { useNotification } from '../context/NotificationContext';
import TreeSelect from '../components/TreeSelect';

interface SelectedToolItem {
  toolId: string;
}

const emptyToolItem: SelectedToolItem = {
  toolId: '',
};

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function AdminArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { articles, addArticle, updateArticle, tools } = useArticles();
  const { categories } = useCategories();
  const { showToast } = useNotification();

  const [postType, setPostType] = useState<'blog' | 'listicle'>(searchParams.get('type') as any || 'blog');
  
  // Common state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Công nghệ & AI');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('Admin User');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('draft');
  const [tags, setTags] = useState<string[]>(['AI']);
  const [tagInput, setTagInput] = useState('');
  const [excerpt, setExcerpt] = useState('');

  // Blog state
  const [content, setContent] = useState('');
  
  // Listicle state
  const [listicleIntroduction, setListicleIntroduction] = useState('');
  const [listicleConclusion, setListicleConclusion] = useState('');
  const [listicleItems, setListicleItems] = useState<SelectedToolItem[]>([{ ...emptyToolItem }]);

  useEffect(() => {
    if (id) {
      const article = articles.find(a => a.id === id);
      if (article) {
        setPostType(article.type);
        setTitle(article.title);
        setSlug(article.slug);
        setCategory(article.category);
        setImage(article.image || '');
        setAuthor(article.author);
        setStatus(article.status as any);
        setTags(article.tags || []);
        setExcerpt(article.excerpt || '');
        if (article.type === 'blog') {
          setContent((article as any).content || (article as any).excerpt || '');
        } else if (article.type === 'listicle') {
          setListicleIntroduction((article as any).introduction?.p1 || '');
          setListicleConclusion((article as any).conclusion || '');
          if ((article as any).items && (article as any).items.length > 0) {
            // Convert legacy items (with name) to toolId references
            const items = (article as any).items;
            const mapped = items.map((item: any) => {
              if (item.toolId) return { toolId: item.toolId };
              // Legacy: find tool by name
              const found = tools.find(t => t.name === item.name);
              return { toolId: found?.id || '' };
            });
            setListicleItems(mapped);
          }
        }
      }
    }
  }, [id, articles]);

  // Auto-slug generation
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  useEffect(() => {
    if (!id && !isSlugManuallyEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, isSlugManuallyEdited, id]);

  const handleSave = (publishStatus: 'published' | 'draft') => {
    if (!title.trim() || !slug.trim()) {
      showToast('Vui lòng nhập tiêu đề và slug!', 'error');
      return;
    }

    const baseData = {
      type: postType,
      title,
      slug,
      category,
      excerpt,
      image,
      author,
      authorAvatar: 'https://picsum.photos/seed/admin/100/100',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: publishStatus,
      tags,
    };

    let fullData: any;
    if (postType === 'blog') {
      fullData = { ...baseData, content };
    } else {
      fullData = { 
        ...baseData, 
        introduction: { p1: listicleIntroduction, p2: '' },
        conclusion: listicleConclusion,
        items: listicleItems
          .filter(item => item.toolId) // only save items with a selected tool
          .map((item, index) => {
            const tool = tools.find(t => t.id === item.toolId);
            return {
              toolId: item.toolId,
              name: tool?.name || '',
              badge: tool?.badge || '',
              pricingTier: tool?.pricingTier || '',
              pricingAmount: tool?.pricingAmount || '',
              verdict: tool?.verdict || '',
              features: tool?.features || [],
              pros: tool?.pros || [],
              cons: tool?.cons || [],
              externalLink: tool?.externalLink || '',
              image: tool?.image || '',
              rating: tool?.rating || 0,
              rank: String(index + 1).padStart(2, '0')
            };
          })
      };
    }

    if (id) {
      updateArticle(id, fullData);
      showToast(`Đã lưu thay đổi bài viết!`, 'success');
    } else {
      addArticle(fullData);
      showToast(`Đã xuất bản bài viết mới!`, 'success');
    }
    navigate('/admin/content');
  };

  const addListicleItem = () => {
    setListicleItems([...listicleItems, { ...emptyToolItem }]);
  };

  const removeListicleItem = (index: number) => {
    if (listicleItems.length > 1) {
      setListicleItems(listicleItems.filter((_, i) => i !== index));
    }
  };

  const selectToolForItem = (index: number, toolId: string) => {
    const updated = [...listicleItems];
    updated[index] = { toolId };
    setListicleItems(updated);
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

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/20 dark:border-slate-800/20 shadow-sm dark:shadow-none flex justify-between items-center h-16 px-8">
        <div className="flex items-center gap-4">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold font-['Manrope'] text-sm">Article Editor</span>
          <span className="h-4 w-px bg-slate-300 dark:bg-slate-700"></span>
          <span className="text-slate-400 text-sm">Draft saved at 10:42 AM</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {id && (
              <a 
                href={`/${postType === 'listicle' ? 'listicle' : 'blog'}/${id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors font-bold text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View Live
              </a>
            )}
            <button onClick={() => handleSave('draft')} className="px-4 py-2 text-slate-500 hover:text-indigo-500 transition-colors font-medium text-sm">Save Draft</button>
            <button onClick={() => handleSave('published')} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all">Publish</button>
          </div>
          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6">
            <button className="text-slate-500 hover:text-indigo-500 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-slate-500 hover:text-indigo-500 transition-colors">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
            <img alt="Admin User Profile Avatar" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJxF1xhaxZfQioDSqJSahVsVdp3ZlD9G3Veo12DVdX0Cuq1-GQpiMIvzbAfDl_USjQDHRUkUEVYpduawKUVKIa3Q_W9arutBkODHDIqVsOgabO235UfEjxvdrVQXgrel06m1aRSV16BQK1xtwb8kkwfPiASJd4ZmDuh_4-DNkkpUSujBF40iiImrTmggB0aB36-RqvoTmRVXSuWHSY-2-PkjlMA1cHzsi3dbaRgshUG3bPRB4Ni4_CEZ3Qfo8CRAXfzlFd55xVl0E" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64 pt-24 px-8 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Tạo Bài Viết Mới</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-sm">home</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>Articles</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">New Post</span>
            </div>
          </header>

          {/* Post Type Selector */}
          <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Loại bài viết</label>
            <div className="flex gap-4">
              <button
                onClick={() => !id && setPostType('blog')}
                disabled={!!id}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all font-semibold text-sm flex-1 ${
                  postType === 'blog'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 shadow-sm shadow-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                } ${id ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className={`material-symbols-outlined text-xl ${postType === 'blog' ? 'text-indigo-500' : 'text-slate-400'}`} style={postType === 'blog' ? { fontVariationSettings: "'FILL' 1" } : {}}>article</span>
                <div className="text-left">
                  <p className="font-bold">Blog</p>
                  <p className={`text-xs ${postType === 'blog' ? 'text-indigo-500/70' : 'text-slate-400'}`}>Edititorial article format</p>
                </div>
                {postType === 'blog' && (
                  <span className="material-symbols-outlined text-indigo-500 ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
              </button>
              <button
                onClick={() => !id && setPostType('listicle')}
                disabled={!!id}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all font-semibold text-sm flex-1 ${
                  postType === 'listicle'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 shadow-sm shadow-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                } ${id ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className={`material-symbols-outlined text-xl ${postType === 'listicle' ? 'text-indigo-500' : 'text-slate-400'}`} style={postType === 'listicle' ? { fontVariationSettings: "'FILL' 1" } : {}}>format_list_numbered</span>
                <div className="text-left">
                  <p className="font-bold">Listicle</p>
                  <p className={`text-xs ${postType === 'listicle' ? 'text-indigo-500/70' : 'text-slate-400'}`}>Review & tool comparison format</p>
                </div>
                {postType === 'listicle' && (
                  <span className="material-symbols-outlined text-indigo-500 ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Editor Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Core Info Card */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Tiêu đề bài viết</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-2xl font-bold bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600 mb-6" placeholder={postType === 'listicle' ? "Ví dụ: Top 10 Best AI Tools for 2026" : "Nhập tiêu đề ấn tượng tại đây..."} type="text" />
                    
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Mô tả ngắn (Subtitle / Excerpt)</label>
                    <textarea 
                      value={excerpt} 
                      onChange={(e) => setExcerpt(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white resize-none" 
                      placeholder="Đoạn văn ngắn hiển thị ngay dưới tiêu đề..." 
                      rows={3} 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Slug</label>
                      <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/20">
                        <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">{postType === 'listicle' ? 'listicle/' : 'blog/'}</span>
                        <input 
                          value={slug} 
                          onChange={(e) => {
                            setSlug(e.target.value);
                            setIsSlugManuallyEdited(true);
                          }} 
                          className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full text-slate-900 dark:text-white" 
                          placeholder="tieu-de-bai-viet" 
                          type="text" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Chuyên mục</label>
                      <TreeSelect 
                        value={category} 
                        onChange={setCategory} 
                        categories={categories} 
                        placeholder="Chọn chuyên mục" 
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Featured Image */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Ảnh đại diện (URL)</label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-4 w-full border border-slate-200 dark:border-slate-700">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-3">link</span>
                  <input value={image} onChange={(e) => setImage(e.target.value)} className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full text-slate-900 dark:text-white" placeholder="Dán link ảnh tại đây (Ví dụ: https://picsum.photos/seed/...)" type="text" />
                </div>
                {image && (
                  <div className="mt-4 aspect-video bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <img src={image} className="w-full h-full object-cover" alt="Featured preview" />
                  </div>
                )}
              </section>

              {/* Conditional Content Area */}
              {postType === 'blog' ? (
                /* Rich Text Editor — Blog Mode */
                <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-1 pr-4 border-r border-slate-200 dark:border-slate-700">
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">format_bold</span></button>
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">format_italic</span></button>
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">format_underlined</span></button>
                    </div>
                    <div className="flex items-center gap-1 pr-4 border-r border-slate-200 dark:border-slate-700">
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">format_align_left</span></button>
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">format_align_center</span></button>
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
                    </div>
                    <div className="flex items-center gap-1 pr-4 border-r border-slate-200 dark:border-slate-700">
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">link</span></button>
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">image</span></button>
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">code</span></button>
                    </div>
                    <button className="ml-auto p-2 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-500 dark:text-slate-400"><span className="material-symbols-outlined text-lg">fullscreen</span></button>
                  </div>
                  <div 
                    className="p-8 min-h-[500px] prose prose-indigo dark:prose-invert max-w-none focus:outline-none" 
                    contentEditable="true" 
                    suppressContentEditableWarning={true}
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: content || '<p class="text-slate-400 dark:text-slate-500 italic">Bắt đầu viết nội dung của bạn tại đây...</p>' }}
                  >
                  </div>
                </section>
              ) : (
                /* Listicle Items Editor */
                <div className="space-y-8">
                  {/* Introduction */}
                  <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-lg text-indigo-600 dark:text-indigo-400">description</span>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Giới thiệu (Introduction)</label>
                    </div>
                    <textarea
                      value={listicleIntroduction}
                      onChange={(e) => setListicleIntroduction(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500/20 resize-none text-slate-900 dark:text-white leading-relaxed"
                      placeholder="Viết đoạn giới thiệu cho bài listicle. Ví dụ: The landscape of artificial intelligence is evolving at terminal velocity..."
                      rows={5}
                    />
                  </section>

                  {/* Listicle Items - Tool Selection */}
                  {listicleItems.map((item, index) => {
                    const selectedTool = tools.find(t => t.id === item.toolId);
                    // Tools already selected (exclude from dropdown options)
                    const alreadySelectedIds = listicleItems.map(i => i.toolId).filter(Boolean);
                    const availableTools = tools.filter(t => !alreadySelectedIds.includes(t.id) || t.id === item.toolId);

                    return (
                      <section key={index} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        {/* Item Header */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl font-black text-indigo-600/30 leading-none">{String(index + 1).padStart(2, '0')}</span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                              {selectedTool?.name || `Chọn Tool #${index + 1}`}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {index > 0 && (
                              <button
                                onClick={() => {
                                  const updated = [...listicleItems];
                                  [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                                  setListicleItems(updated);
                                }}
                                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                title="Di chuyển lên"
                              >
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                              </button>
                            )}
                            {index < listicleItems.length - 1 && (
                              <button
                                onClick={() => {
                                  const updated = [...listicleItems];
                                  [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                                  setListicleItems(updated);
                                }}
                                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                title="Di chuyển xuống"
                              >
                                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                              </button>
                            )}
                            {listicleItems.length > 1 && (
                              <button
                                onClick={() => removeListicleItem(index)}
                                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors text-slate-400 hover:text-rose-500"
                                title="Xoá item"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-8">
                          {/* Tool Selector Dropdown */}
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Chọn Tool từ danh sách</label>
                          <select
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all"
                            value={item.toolId}
                            onChange={(e) => selectToolForItem(index, e.target.value)}
                          >
                            <option value="">-- Chọn Tool --</option>
                            {availableTools.map(tool => (
                              <option key={tool.id} value={tool.id}>{tool.name} — {tool.category} ({tool.pricingTier})</option>
                            ))}
                          </select>

                          {/* Tool Preview Card */}
                          {selectedTool && (
                            <div className="mt-6 bg-gradient-to-br from-indigo-50/50 to-sky-50/50 dark:from-indigo-900/10 dark:to-sky-900/10 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/30">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">{selectedTool.name}</h4>
                                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-0.5 rounded-full">{selectedTool.badge}</span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500">
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  <span className="font-bold text-sm">{selectedTool.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{selectedTool.verdict}</p>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="font-bold text-slate-500 uppercase tracking-wider">Pricing</span>
                                  <p className="font-semibold text-slate-900 dark:text-white mt-1">{selectedTool.pricingTier} — {selectedTool.pricingAmount}</p>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-500 uppercase tracking-wider">Category</span>
                                  <p className="font-semibold text-slate-900 dark:text-white mt-1">{selectedTool.category}</p>
                                </div>
                              </div>
                              {selectedTool.features.length > 0 && (
                                <div className="mt-4">
                                  <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">Features</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedTool.features.map((f, fi) => (
                                      <span key={fi} className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{f}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {(selectedTool.pros.length > 0 || selectedTool.cons.length > 0) && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <span className="font-bold text-emerald-600 uppercase tracking-wider text-xs">Pros</span>
                                    <ul className="mt-1 space-y-1">
                                      {selectedTool.pros.map((p, pi) => (
                                        <li key={pi} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                                          <span className="material-symbols-outlined text-emerald-500 text-xs mt-0.5">check</span>
                                          {p}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <span className="font-bold text-rose-500 uppercase tracking-wider text-xs">Cons</span>
                                    <ul className="mt-1 space-y-1">
                                      {selectedTool.cons.map((c, ci) => (
                                        <li key={ci} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                                          <span className="material-symbols-outlined text-rose-500 text-xs mt-0.5">close</span>
                                          {c}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </section>
                    );
                  })}

                  {/* Add Item Button */}
                  <button
                    onClick={addListicleItem}
                    className="w-full py-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all active:scale-[0.99]"
                  >
                    <span className="material-symbols-outlined">add_circle</span>
                    Thêm Tool #{listicleItems.length + 1}
                  </button>

                  {/* Conclusion */}
                  <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-lg text-indigo-600 dark:text-indigo-400">summarize</span>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kết luận (Final Thoughts)</label>
                    </div>
                    <textarea
                      value={listicleConclusion}
                      onChange={(e) => setListicleConclusion(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500/20 resize-none text-slate-900 dark:text-white leading-relaxed"
                      placeholder="Viết đoạn kết luận cho bài listicle..."
                      rows={5}
                    />
                  </section>
                </div>
              )}
            </div>

            {/* Right Column: Settings & Meta Area */}
            <aside className="space-y-8 sticky top-24">
              {/* Publishing Card */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-indigo-600 dark:text-indigo-400">send</span>
                  Xuất bản
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Trạng thái</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer border border-transparent hover:border-indigo-500/20 transition-all">
                        <input checked={status === 'draft'} onChange={() => setStatus('draft')} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600" name="status" type="radio" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Bản nháp (Draft)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border border-transparent transition-all">
                        <input checked={status === 'scheduled'} onChange={() => setStatus('scheduled')} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600" name="status" type="radio" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Lên lịch (Scheduled)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border border-transparent transition-all">
                        <input checked={status === 'published'} onChange={() => setStatus('published')} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600" name="status" type="radio" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Đã đăng (Published)</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Tác giả</label>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                      <img alt="Author profile avatar" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8rUjGxSCUnQmD8piazvTxyCJQ1trZdMhYDKMhRMtI1z0qW96PhOicrjb4DncM5dP-pXG98I96n0iMrYl-XGT1BLp-ZNGu98G0iJml01JRBfahBlKOuoY7--I_vOhcoZHZv9u4S4q0hBA-VWNeF50hefRGDKalusKQWMgAmQovrj3UWJGpSQtEWPRrmy_Jdk_BJ9b22UIxJR6M4WuO0LA-Cee6IBh99pL9WVv7neZr7VJ5qD7-m-OlyTCmMgGul6gnNG9MRs0qOBU" />
                      <select value={author} onChange={(e) => setAuthor(e.target.value)} className="bg-transparent border-none p-0 text-sm font-medium focus:ring-0 flex-1 text-slate-900 dark:text-white">
                        <option value="Admin User">Admin User</option>
                        <option value="Editorial Team">Editorial Team</option>
                        <option value="Marcus Chen">Marcus Chen</option>
                        <option value="Julian Vance">Julian Vance</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col gap-3">
                    <button onClick={() => handleSave('published')} className="w-full py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/20 hover:opacity-90 active:scale-95 transition-all">Xuất bản ngay</button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold text-xs flex items-center justify-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Xem trước
                      </button>
                      <button onClick={() => handleSave('draft')} className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold text-xs flex items-center justify-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-sm">save</span>
                        Lưu nháp
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tags & SEO */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-indigo-600 dark:text-indigo-400">sell</span>
                  Phân loại & SEO
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Thẻ (Tags)</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                          {tag}
                          <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="material-symbols-outlined text-[12px] hover:text-rose-500 cursor-pointer">close</button>
                        </span>
                      ))}
                    </div>
                    <input 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white" 
                      placeholder="Thêm thẻ (nhấn Enter)..." 
                      type="text" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagInput.trim() !== '') {
                          if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                          setTagInput('');
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Meta Title</label>
                    <input className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 mb-4 text-slate-900 dark:text-white" placeholder="Tiêu đề hiển thị Google..." type="text" />
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Meta Description</label>
                    <textarea className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 resize-none text-slate-900 dark:text-white" placeholder="Mô tả ngắn cho bài viết..." rows={3}></textarea>
                    <p className="text-[10px] text-right text-slate-400 dark:text-slate-500 mt-1">0 / 160 ký tự</p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
