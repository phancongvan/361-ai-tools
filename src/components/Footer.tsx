import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-16 bg-surface-container-lowest border-t border-surface-container font-manrope mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="text-lg font-black text-on-surface mb-6">AI Curator</div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              The definitive directory for modern artificial intelligence tools and technologies.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs tracking-wide uppercase font-bold text-on-surface">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/directory" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Directory</Link></li>
              <li><Link to="/blog" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Blog</Link></li>
              <li><a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Newsletter</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs tracking-wide uppercase font-bold text-on-surface">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs tracking-wide uppercase font-bold text-on-surface">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-surface-container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs tracking-wide uppercase text-outline">© 2024 AI Curator Directory. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <Globe className="w-4 h-4 text-outline cursor-pointer hover:text-primary transition-colors" />
            <span className="text-xs font-bold text-outline">EN - USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
