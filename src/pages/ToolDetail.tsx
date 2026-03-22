import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, ExternalLink, ShieldCheck, 
  CheckCircle2, Globe, Users, LayoutGrid, Brain, 
  Sparkles, Video, PenTool, Wand2, Terminal, Mic, BarChart,
  ChevronRight, Code, Smartphone, Github, Mail
} from 'lucide-react';
import { TOOLS } from '../data/tools';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNotification } from '../context/NotificationContext';

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid, Brain, Sparkles, Video, PenTool, Wand2, Terminal, Mic, BarChart
};

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find(t => t.id === id);
  const { showToast } = useNotification();

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-on-surface-variant mb-8">The tool you are looking for does not exist or has been removed.</p>
          <Link to="/directory" className="bg-primary text-on-primary px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[tool.icon] || LayoutGrid;
  const similarTools = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-manrope">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/directory" className="hover:text-primary transition-colors">Directory</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-on-surface">{tool.name}</span>
        </nav>

        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-surface-container-highest mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 bg-surface-variant rounded-2xl flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-12 h-12 text-primary" />
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-4xl font-extrabold tracking-tight">{tool.name}</h1>
                <span className="bg-primary/10 text-primary text-xs font-black uppercase px-3 py-1 rounded-full">
                  {tool.category}
                </span>
                <span className="bg-secondary-container text-on-secondary-container text-xs font-bold uppercase px-3 py-1 rounded-full">
                  {tool.pricing}
                </span>
              </div>
              
              <p className="text-xl text-on-surface-variant mb-6 leading-relaxed max-w-3xl">
                {tool.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-on-surface-variant mb-8">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-on-surface font-bold text-base">{tool.rating}</span>
                  <span>({tool.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Verified Developer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-5 h-5" />
                  <span>{tool.developer}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href={tool.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => showToast('Đã lưu công cụ vào danh sách!', 'success')} className="bg-surface-container text-on-surface px-8 py-3 rounded-xl font-bold hover:bg-surface-container-highest transition-colors">
                  Save to List
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 tracking-tight">About {tool.name}</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  {tool.longDescription || tool.description}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 tracking-tight">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-on-surface font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 tracking-tight">Pricing Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest flex flex-col">
                  <h3 className="font-bold text-lg mb-2">Starter</h3>
                  <div className="text-3xl font-extrabold mb-4">$0<span className="text-sm text-on-surface-variant font-medium">/mo</span></div>
                  <ul className="space-y-3 mb-6 flex-grow">
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> Basic features</li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> 100 credits/mo</li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> Community support</li>
                  </ul>
                  <button onClick={() => showToast('Đang chuyển hướng đến thanh toán...', 'info')} className="w-full py-2 rounded-lg font-bold bg-surface-container text-on-surface hover:bg-surface-container-highest transition-colors">Get Started</button>
                </div>
                <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary flex flex-col relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                  <h3 className="font-bold text-lg mb-2">Pro</h3>
                  <div className="text-3xl font-extrabold mb-4">$29<span className="text-sm text-on-surface-variant font-medium">/mo</span></div>
                  <ul className="space-y-3 mb-6 flex-grow">
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> Everything in Starter</li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited credits</li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> Priority support</li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> API access</li>
                  </ul>
                  <button onClick={() => showToast('Đang chuyển hướng đến thanh toán...', 'info')} className="w-full py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity">Upgrade to Pro</button>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest flex flex-col">
                  <h3 className="font-bold text-lg mb-2">Enterprise</h3>
                  <div className="text-3xl font-extrabold mb-4">Custom</div>
                  <ul className="space-y-3 mb-6 flex-grow">
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> Custom deployment</li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> Dedicated account manager</li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant"><CheckCircle2 className="w-4 h-4 text-primary" /> SSO & advanced security</li>
                  </ul>
                  <button onClick={() => showToast('Biểu mẫu liên hệ bán hàng sắp ra mắt!', 'info')} className="w-full py-2 rounded-lg font-bold bg-surface-container text-on-surface hover:bg-surface-container-highest transition-colors">Contact Sales</button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 tracking-tight">User Reviews</h2>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center font-bold text-primary">
                          U{i}
                        </div>
                        <div>
                          <div className="font-bold text-sm">User {i}</div>
                          <div className="text-xs text-on-surface-variant">2 days ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-4 h-4 ${j < 4 || i === 1 ? 'text-amber-500 fill-amber-500' : 'text-surface-variant fill-surface-variant'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      "This tool has completely transformed our workflow. The features are exactly what we needed, and the interface is incredibly intuitive. Highly recommended for anyone in this space!"
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest">
              <h3 className="font-bold text-lg mb-4">Tool Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Code className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">API Available</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Mobile App</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Github className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Open Source</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest">
              <h3 className="font-bold text-lg mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map(tag => (
                  <span key={tag} className="bg-surface-container px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest">
              <h3 className="font-bold text-lg mb-4">Developer Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-sm">Company</span>
                  <span className="font-semibold text-sm">{tool.developer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-sm">Website</span>
                  <a href={tool.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-primary hover:underline">
                    {new URL(tool.website).hostname}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-sm">Users</span>
                  <div className="flex items-center gap-1 font-semibold text-sm">
                    <Users className="w-4 h-4" />
                    10k+
                  </div>
                </div>
              </div>
            </div>

            {similarTools.length > 0 && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest">
                <h3 className="font-bold text-lg mb-4">Similar Tools</h3>
                <div className="space-y-4">
                  {similarTools.map(similar => {
                    const SimilarIcon = iconMap[similar.icon] || LayoutGrid;
                    return (
                      <Link key={similar.id} to={`/tool/${similar.id}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-surface-variant rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                          <SimilarIcon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <div className="font-bold text-sm group-hover:text-primary transition-colors">{similar.name}</div>
                          <div className="text-xs text-on-surface-variant">{similar.pricing}</div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
              <p className="text-sm text-on-surface-variant mb-4">Get notified about new features and alternatives to {tool.name}.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <button onClick={() => showToast('Đăng ký thành công!', 'success')} className="bg-primary text-on-primary p-2 rounded-lg hover:opacity-90 transition-opacity">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
