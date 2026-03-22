import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useArticles } from '../context/ArticleContext';
import { useNotification } from '../context/NotificationContext';
import { useSubscribers } from '../context/SubscriberContext';
import EmailGateModal from '../components/EmailGateModal';

export default function ListicleDetail() {
  const { id } = useParams<{ id: string }>();
  const { articles } = useArticles();
  const { showToast } = useNotification();
  const { hasUnlocked } = useSubscribers();
  
  const [isEmailGateOpen, setIsEmailGateOpen] = React.useState(false);
  const [pendingUrl, setPendingUrl] = React.useState<string | null>(null);

  const handleTryTool = (url: string | undefined) => {
    if (!url) {
      showToast('Đang chuyển hướng đến công cụ...', 'info');
      return;
    }

    if (hasUnlocked) {
      window.open(url, '_blank');
    } else {
      setPendingUrl(url);
      setIsEmailGateOpen(true);
    }
  };

  const article = articles.find(a => String(a.id) === id);

  if (!article || article.type !== 'listicle') {
    return (
      <div className="bg-surface min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h2>
            <Link to="/top-lists" className="text-primary hover:underline">Quay lại Top Lists</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const trendingArticles = articles.filter(a => a.status === 'published' && a.id !== article.id).slice(0, 3);

  const data = {
    tag: article.category,
    title: article.title,
    description: article.excerpt || '',
    author: {
      name: article.author,
      role: 'Contributor',
      date: article.date,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAco3qR5BtGVWkEZlYQkth8iuesLj5VAoixEScawsyMZt1wyRI-uhkYifE0lIQ2fN9tUa3YrRLuWjH7is133nRv--jNPScVHPq_r67BSI_0_Zd1aN4Kko_nViya6Qq1wdM5DsJAEojFvhwlFYqqjOgtjZtqdu3tLJ7Vfvh8EaVg-esSXtPk_CsTcK5Hflz9vYYuL2vk6ekOTOT15b5PfVaddFN_b9Yb1S_UydTZqkxutcoYbU5rCjec50hARRsqZvU4M8SIKBKyi4c',
    },
    heroImage: article.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqZGD3XonSYAsKSREplGeFmO2xJbIrDppCT4f98cVzZwitzgfUuLlStC5OCsn4Wzx45I8kOzGiyj9xvHM36D2A4trHcm45dU2ZgByPWhQVY0eaE96p9JVzYB_yuJoFaYgKmNs3I3m-813HfjL17dJEzVSId3925XyxR7LRp6dVF6pQ_2cE3eCcOt6TUPPfvMoWWrfAJAEkrYiLrmGjwnIHvQyyqXx3inACs1UtwBBC9Zi-CBx6doPUSYppRwEvJ84ysB1EqqPau3g',
    introduction: (article as any).introduction || { p1: '', p2: '' },
    items: (article as any).items || [],
    conclusion: (article as any).conclusion || '',
  };

  return (
    <div className="bg-surface text-on-surface antialiased font-body min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <header className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 text-primary font-semibold text-xs mb-6 tracking-wider uppercase">
              {data.tag}
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.1] mb-6">
              {data.title}
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed mb-8 max-w-2xl">
              {data.description}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden">
                <img className="w-full h-full object-cover" alt={data.author.name} src={data.author.avatar} />
              </div>
              <div>
                <p className="font-bold text-on-surface">{data.author.name}</p>
                <p className="text-sm text-on-surface-variant">{data.author.role} • {data.author.date}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img className="w-full h-full object-cover" alt="Featured editorial hero image" src={data.heroImage} />
            </div>
            <div className="absolute -bottom-6 -left-6 p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl max-w-[240px]">
              <p className="text-sm font-bold text-primary mb-1">Editor's Choice</p>
              <p className="text-xs text-on-surface-variant leading-tight">Hand-picked selections based on performance, scalability, and ethical AI standards.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Introduction */}
            <section className="prose prose-slate max-w-none mb-16">
              <p className="text-lg text-on-surface-variant leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left mb-6">
                {data.introduction.p1}
              </p>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {data.introduction.p2}
              </p>
            </section>

            {/* The List */}
            <div className="space-y-20">
              {data.items.map((item) => (
                <article key={item.rank} className="relative">
                  <div className="flex items-start gap-6 mb-8">
                    <span className="text-6xl font-black text-outline-variant/30 leading-none">{item.rank}</span>
                    <div>
                      {item.externalLink ? (
                        <button 
                          onClick={() => handleTryTool(item.externalLink)}
                          className="hover:text-primary transition-colors block text-left bg-transparent border-none p-0 w-full"
                        >
                          <h2 className="text-4xl font-extrabold tracking-tight mb-2">{item.name}</h2>
                        </button>
                      ) : (
                        <h2 className="text-4xl font-extrabold tracking-tight mb-2">{item.name}</h2>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full ${item.badgeColor} text-xs font-bold uppercase tracking-wider`}>{item.badge}</span>
                        <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium">{item.pricingTier}</span>
                        {item.rating !== undefined && (
                          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                            <div className="flex items-center -space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className="material-symbols-outlined text-sm text-amber-500"
                                  style={{ fontVariationSettings: `'FILL' ${i < Math.floor(Number(item.rating)) ? 1 : 0}` }}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 ml-1">{Number(item.rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="rounded-2xl overflow-hidden bg-surface-container-low aspect-video group/image relative cursor-pointer">
                        {item.externalLink ? (
                          <div onClick={() => handleTryTool(item.externalLink)}>
                            <img className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110" alt={`${item.name} dashboard`} src={item.image} />
                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                              <span className="material-symbols-outlined text-white text-4xl shadow-xl drop-shadow-2xl">lock</span>
                            </div>
                          </div>
                        ) : (
                          <img className="w-full h-full object-cover" alt={`${item.name} dashboard`} src={item.image} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-on-surface mb-3">The Verdict</h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed">{item.verdict}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Key Features</h4>
                        <ul className="space-y-3">
                          {item.features && item.features.map((feature: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-surface-container-low rounded-2xl p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-green-600 mb-2 uppercase tracking-tighter">Pros</p>
                            <ul className="space-y-1">
                              {item.pros && item.pros.map((pro: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs leading-relaxed text-on-surface-variant">
                                  <span className="material-symbols-outlined text-[14px] text-green-600 font-bold">check</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-error mb-2 uppercase tracking-tighter">Cons</p>
                            <ul className="space-y-1">
                              {item.cons && item.cons.map((con: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs leading-relaxed text-on-surface-variant">
                                  <span className="material-symbols-outlined text-[14px] text-error font-bold">close</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleTryTool(item.externalLink)} 
                          className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
                        >
                          Try Tool {hasUnlocked ? <span className="material-symbols-outlined text-sm">open_in_new</span> : <span className="material-symbols-outlined text-sm">lock</span>}
                        </button>
                        <button onClick={() => showToast('Bài đánh giá chi tiết đang được cập nhật...', 'info')} className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors">Read Full Review</button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Pricing</p>
                        <p className="text-lg font-bold text-on-surface">{item.pricingAmount}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {/* Placeholder for #3-10 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface-container rounded-3xl p-10 flex flex-col items-center text-center justify-center border border-dashed border-outline-variant">
                  <span className="text-4xl font-bold text-outline-variant mb-4">03 - 10</span>
                  <p className="text-on-surface-variant font-medium">Continue reading the full breakdown of our top-rated tools for 2026 below.</p>
                </div>
                <div className="bg-primary-container text-on-primary-container rounded-3xl p-10 flex flex-col items-center text-center justify-center">
                  <h4 className="text-2xl font-bold mb-4 tracking-tight">Unlock the Full Guide</h4>
                  <p className="text-sm opacity-80 mb-6">Join our network to get access to deep-dives for every tool on our list.</p>
                  <button onClick={() => showToast('Trang đăng ký thành viên sắp ra mắt!', 'info')} className="bg-on-primary-container text-primary-container px-6 py-2 rounded-full font-bold text-sm">Join CuratorAI</button>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <section className="mt-24 pt-16 border-t border-outline-variant/20">
              <h2 className="text-3xl font-extrabold mb-6 tracking-tight">Final Thoughts</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-12">
                {data.conclusion}
              </p>
              {/* Newsletter */}
              <div className="bg-surface-container-highest rounded-[2rem] p-10 relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                  <h3 className="text-2xl font-bold mb-2">Never miss a breakthrough.</h3>
                  <p className="text-on-surface-variant text-sm mb-6">Get weekly AI tool reviews and insider tech strategies delivered to your inbox.</p>
                  <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); showToast('Đăng ký nhận bản tin thành công!', 'success'); }}>
                    <input className="flex-1 bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary" placeholder="Enter your email" type="email" />
                    <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all">Subscribe</button>
                  </form>
                </div>
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[15rem] text-primary/5 select-none">mail</span>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Share Buttons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Share this Article</h4>
              <div className="flex gap-3">
                <button onClick={() => showToast('Tính năng chia sẻ đang phát triển!', 'info')} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all">
                  <span className="material-symbols-outlined text-lg">share</span>
                </button>
                <button onClick={() => showToast('Đã chép liên kết vào bộ nhớ tạm!', 'success')} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all">
                  <span className="material-symbols-outlined text-lg">link</span>
                </button>
                <button onClick={() => showToast('Cảm ơn bạn đã thích bài viết!', 'success')} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all">
                  <span className="material-symbols-outlined text-lg">thumb_up</span>
                </button>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-surface-container-low rounded-3xl p-8">
              <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">category</span>
                Popular Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Generative AI', 'Productivity', 'Design', 'Development', 'Hardware'].map(cat => (
                  <Link 
                    key={cat} 
                    to={`/directory?category=${encodeURIComponent(cat)}`}
                    className="px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all cursor-pointer block"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Now */}
            <div>
              <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                Trending Now
              </h4>
              <div className="space-y-6">
                {trendingArticles.map((item) => (
                  <Link key={item.id} to={`/${item.type === 'listicle' ? 'listicle' : 'blog'}/${item.id}`} className="group block">
                    <p className="text-xs text-primary font-bold mb-1 uppercase">{item.category}</p>
                    <h5 className="font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{item.title}</h5>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad/CTA */}
            <div className="relative h-64 rounded-3xl overflow-hidden group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Abstract colorful neon digital landscape" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6l1JODR0oR_4tpeLC2ngmBvSTb19JKtyxv0X95B6A4oqSXgrHQzmMN6nYcK8CUe9rkUdr9cGVgDN1EnI4n2WwT1nsfHXuSUewDEbOeDzqKwMKXho1B0G5oQxMVAs2p3Z_dXfKhiWByrWc8wnKXYRKGPVzNRe3-5ucCq1sG7PRndNibvuPyxkr8279JohC86_yyuTzzGf35Vi5v3h_brmf7TQIsZCFArDu5LeNjUH3n_6W5iDhZNh-n_Vx9qUDBjbJgHfY-qMERj4" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <p className="text-white font-bold text-lg leading-tight mb-4">Master AI with our Executive Masterclass</p>
                <button onClick={() => showToast('Cổng đăng ký khoá học sắp mở!', 'info')} className="bg-white text-on-surface px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest w-fit">Enroll Now</button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      <EmailGateModal 
        isOpen={isEmailGateOpen}
        onClose={() => setIsEmailGateOpen(false)}
        onSuccess={() => {
          setIsEmailGateOpen(false);
          showToast('Feature Unlocked! Redirecting...', 'success');
          if (pendingUrl) {
            window.open(pendingUrl, '_blank');
            setPendingUrl(null);
          }
        }}
        title="Exclusive Tool Access"
        description="To access these high-performance AI tools, simply subscribe to our CuratorAI network. It's free and takes 5 seconds."
        source={`Listicle Unlock: ${article.title}`}
      />
    </div>
  );
}
