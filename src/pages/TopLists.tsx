import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useArticles } from '../context/ArticleContext';
import { useNotification } from '../context/NotificationContext';
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export default function TopLists() {
  const { listicles } = useArticles();
  const { showToast } = useNotification();

  // Find featured listicle
  const featuredListicle = listicles.find(l => l.featured) || listicles[0];
  // Other listicles
  const standardListicles = listicles.filter(l => l.id !== featuredListicle?.id);

  return (
    <div className="bg-surface text-on-surface antialiased font-manrope min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-24 pb-20 flex-grow">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          {/* Hero Section */}
          <section className="mb-16">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6 leading-[1.1]">
                Top AI <span className="text-primary">Curations</span>
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Expertly vetted collections of the most impactful artificial intelligence tools. We filter the noise so you can find the perfect tech for your next breakthrough.
              </p>
            </div>
          </section>

          {/* Main Layout: Grid + Sidebar */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Article Grid (66%) */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Featured Large Card */}
                {featuredListicle && (
                  <article className="md:col-span-2 group bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-on-surface/5">
                    <div className="flex flex-col md:flex-row h-full">
                      <Link to={`/listicle/${featuredListicle.id}`} className="md:w-1/2 relative overflow-hidden aspect-[16/9] md:aspect-auto block">
                        <img 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          alt={featuredListicle.title} 
                          src={featuredListicle.image}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Editor's Choice</span>
                        </div>
                      </Link>
                      <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div>
                          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-3 block">{featuredListicle.category}</span>
                          <Link to={`/listicle/${featuredListicle.id}`}>
                            <h2 className="text-2xl font-extrabold text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">{featuredListicle.title}</h2>
                          </Link>
                          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{featuredListicle.excerpt}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-surface-container">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
                              <img className="w-full h-full object-cover" alt={featuredListicle.author} src={featuredListicle.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredListicle.author)}&background=random`} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface">{featuredListicle.author}</span>
                              <span className="text-[10px] text-on-surface-variant">{featuredListicle.date}</span>
                            </div>
                          </div>
                          <Link to={`/listicle/${featuredListicle.id}`} className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-1 transition-transform">
                            Read List <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {/* Standard Cards */}
                {standardListicles.map(listicle => (
                  <article key={listicle.id} className="bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg relative group">
                    <Link to={`/listicle/${listicle.id}`} className="relative aspect-video overflow-hidden block">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        alt={listicle.title} 
                        src={listicle.image}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-surface-container-highest/90 backdrop-blur-md text-on-surface-variant text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{listicle.category}</span>
                      </div>
                    </Link>
                    <div className="p-6 flex flex-col flex-grow">
                      <Link to={`/listicle/${listicle.id}`}>
                        <h3 className="text-lg font-bold text-on-surface mb-3 leading-snug group-hover:text-primary transition-colors">{listicle.title}</h3>
                      </Link>
                      <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{listicle.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between text-[11px] font-medium text-on-surface-variant">
                        <span>By {listicle.author}</span>
                        <span>{listicle.date}</span>
                      </div>
                      <Link to={`/listicle/${listicle.id}`} className="mt-4 block text-center bg-surface-container-high text-on-surface font-bold text-xs py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-all">
                        Read List
                      </Link>
                    </div>
                  </article>
                ))}

              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center items-center gap-2">
                <button onClick={() => showToast('Đang ở trang đầu tiên', 'info')} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-on-primary font-bold text-sm">1</button>
                <button onClick={() => showToast('Trang 2 sắp ra mắt!', 'info')} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors font-bold text-sm">2</button>
                <button onClick={() => showToast('Trang 3 sắp ra mắt!', 'info')} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors font-bold text-sm">3</button>
                <button onClick={() => showToast('Trang tiếp theo sắp ra mắt!', 'info')} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sidebar (33%) */}
            <aside className="lg:w-1/3 space-y-8">
              {/* Newsletter Signup */}
              <div className="bg-primary p-8 rounded-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-on-primary mb-2">Curated Inbox</h3>
                  <p className="text-on-primary-container text-sm mb-6 opacity-90">Get the top 5 AI lists delivered to your inbox every Sunday. No spam, just tools.</p>
                  <div className="space-y-3">
                    <input className="w-full bg-white/10 border-white/20 rounded-lg py-3 px-4 text-white placeholder:text-white/50 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent" placeholder="email@address.com" type="email"/>
                    <button onClick={() => showToast('Đăng ký thành công!', 'success')} className="w-full bg-white text-primary font-bold py-3 rounded-lg text-sm hover:bg-indigo-50 transition-colors">Subscribe Now</button>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              </div>

              {/* Trending Now */}
              <div className="bg-surface-container-low p-8 rounded-2xl">
                <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending Now
                </h3>
                <ul className="space-y-6">
                  <li onClick={() => showToast('Bài viết đang được cập nhật...', 'info')} className="group cursor-pointer">
                    <div className="flex gap-4">
                      <span className="text-2xl font-black text-outline-variant group-hover:text-primary transition-colors">01</span>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface leading-tight mb-1 group-hover:underline">Best AI Image Generators for High-Fashion Photography</h4>
                        <span className="text-[10px] text-on-surface-variant font-medium">4.2k Reads this week</span>
                      </div>
                    </div>
                  </li>
                  <li onClick={() => showToast('Bài viết đang được cập nhật...', 'info')} className="group cursor-pointer">
                    <div className="flex gap-4">
                      <span className="text-2xl font-black text-outline-variant group-hover:text-primary transition-colors">02</span>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface leading-tight mb-1 group-hover:underline">Can AI Truly Write Better Code Than Seniors?</h4>
                        <span className="text-[10px] text-on-surface-variant font-medium">3.8k Reads this week</span>
                      </div>
                    </div>
                  </li>
                  <li onClick={() => showToast('Bài viết đang được cập nhật...', 'info')} className="group cursor-pointer">
                    <div className="flex gap-4">
                      <span className="text-2xl font-black text-outline-variant group-hover:text-primary transition-colors">03</span>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface leading-tight mb-1 group-hover:underline">Top 3 AI Tools for Automated Customer Success</h4>
                        <span className="text-[10px] text-on-surface-variant font-medium">2.1k Reads this week</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Popular Tags */}
              <div className="p-8">
                <h3 className="text-lg font-bold text-on-surface mb-6">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['Productivity', 'Design', 'Development', 'Marketing', 'Video', 'SEO', 'Writing'].map(topic => (
                    <Link 
                      key={topic} 
                      to={`/directory?category=${encodeURIComponent(topic)}`}
                      className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors block"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
