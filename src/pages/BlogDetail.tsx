import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Share2, Bookmark, MessageSquare, CheckCircle2, Brain, Globe, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNotification } from '../context/NotificationContext';
import { useArticles } from '../context/ArticleContext';

const getInitials = (name: string) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useNotification();
  const { articles } = useArticles();

  const article = articles.find(a => String(a.id) === id);
  const relatedArticles = articles.filter(a => a.type === 'blog' && a.status === 'published' && String(a.id) !== id).slice(0, 3);

  if (!article) {
    return (
      <div className="bg-surface min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h2>
            <Link to="/blog" className="text-primary hover:underline">Quay lại danh sách Blog</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Basic HTML sanitization to prevent XSS
  const sanitizeHtml = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    // Remove script tags and event handlers
    div.querySelectorAll('script, iframe, object, embed').forEach(el => el.remove());
    div.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on') || attr.value.startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      });
    });
    return div.innerHTML;
  };

  const rawContent = (article as any).content || `<p class="text-xl font-medium text-on-surface mb-8">${(article as any).excerpt || 'Content is being updated...'}</p><p>Please check back later for the full article.</p>`;
  const content = sanitizeHtml(rawContent);

  return (
    <div className="bg-surface text-on-surface antialiased font-manrope min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content Shell */}
      <main className="flex-grow pt-24 pb-20">
        {/* Hero Header */}
        <header className="max-w-7xl mx-auto px-6 md:px-8 mb-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary-fixed text-on-primary-fixed text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{article.category}</span>
              <span className="text-on-surface-variant text-sm">• 5 min read</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl text-on-surface-variant leading-relaxed mb-8 max-w-2xl">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                {getInitials(article.author)}
              </div>
              <div>
                <p className="font-bold text-on-surface">{article.author}</p>
                <p className="text-sm text-on-surface-variant">{article.date}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Large Cover Image */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-16">
          <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              alt={article.title}
              className="w-full h-full object-cover" 
              src={article.image || 'https://picsum.photos/seed/agentic/2000/800'}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Article Grid Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-[60px_1fr_320px] gap-12">
          {/* Sticky Sidebar (Socials) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col items-center gap-6">
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Đã sao chép liên kết!', 'success'); }} className="p-3 bg-surface-container-low rounded-full text-secondary hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button onClick={() => showToast('Đã lưu bài viết!', 'success')} className="p-3 bg-surface-container-low rounded-full text-secondary hover:text-primary transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <div className="h-12 w-px bg-outline-variant/30"></div>
              <button onClick={() => showToast('Tính năng bình luận sắp ra mắt!', 'info')} className="p-3 bg-surface-container-low rounded-full text-secondary hover:text-primary transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </aside>

          {/* Main Blog Body */}
          <article className="bg-surface-container-lowest p-8 md:p-12 rounded-xl">
            <div 
              className="max-w-3xl mx-auto prose prose-slate space-y-8 text-on-surface-variant leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>

          {/* Right Sidebar (Metadata/Newsletter) */}
          <aside className="space-y-8">
            {/* Newsletter Card */}
            <div className="bg-primary text-on-primary p-8 rounded-3xl shadow-xl shadow-primary/10">
              <h4 className="text-2xl font-bold mb-4 tracking-tight">The AI Brief</h4>
              <p className="text-on-primary-container text-sm mb-6 leading-relaxed">Weekly insights on the tools shaping the future, delivered to your inbox.</p>
              <input 
                className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-white placeholder:text-white/50 mb-4 focus:ring-2 focus:ring-white/20 outline-none" 
                placeholder="Email address" 
                type="email"
              />
              <button onClick={() => showToast('Đăng ký thành công!', 'success')} className="w-full bg-white text-primary font-bold py-3 rounded-full hover:bg-surface-container transition-colors">Subscribe</button>
            </div>

            {/* Featured Tools Mini-List */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <h5 className="text-xs font-black uppercase tracking-widest text-secondary mb-6">Trending Tools</h5>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold">CrewAI</p>
                    <p className="text-xs text-on-surface-variant">Multi-agent systems</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold">LangGraph</p>
                    <p className="text-xs text-on-surface-variant">Stateful workflows</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 mt-24">
          <h2 className="text-3xl font-black tracking-tighter mb-10">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.length > 0 ? relatedArticles.map((relArticle, idx) => (
              <Link key={relArticle.id} to={`/blog/${relArticle.id}`} className="group cursor-pointer block">
                <div className="h-48 rounded-2xl overflow-hidden mb-4 bg-surface-container-highest">
                  <img 
                    alt={relArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={relArticle.image || 'https://picsum.photos/seed/network2/600/400'}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-primary text-[10px] font-black uppercase tracking-widest">{relArticle.category}</span>
                <h3 className="text-lg font-bold mt-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">{relArticle.title}</h3>
              </Link>
            )) : (
              <p className="col-span-3 text-on-surface-variant">Không có bài viết liên quan.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
