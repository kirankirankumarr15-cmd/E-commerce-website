import { Link } from 'react-router-dom';
import { Globe, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full text-white select-none" role="contentinfo">
      {/* 1. Back to Top Bar */}
      <button
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475a] hover:bg-[#485769] text-center text-xs font-semibold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
      >
        <span>Back to top</span>
        <ArrowUp className="h-3.5 w-3.5" />
      </button>

      {/* 2. Amazon 4-Column Directory (#232f3e) */}
      <div className="bg-[#232f3e] py-10 sm:py-12 border-b border-[#3a4553]">
        <div className="container-narrow grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-[#dddddd]">
          <div>
            <h3 className="font-bold text-sm text-white mb-3">Get to Know Us</h3>
            <ul className="space-y-2 text-[#cccccc]">
              <li><Link to="/" className="hover:underline">About NOVA MART</Link></li>
              <li><Link to="/" className="hover:underline">Careers</Link></li>
              <li><Link to="/" className="hover:underline">Press Releases</Link></li>
              <li><Link to="/" className="hover:underline">Nova Science & Tech</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-3">Connect with Us</h3>
            <ul className="space-y-2 text-[#cccccc]">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter / X</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">YouTube</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-3">Make Money with Us</h3>
            <ul className="space-y-2 text-[#cccccc]">
              <li><Link to="/admin" className="hover:underline">Sell on NOVA MART</Link></li>
              <li><Link to="/" className="hover:underline">Protect and Build Your Brand</Link></li>
              <li><Link to="/" className="hover:underline">Become an Affiliate Partner</Link></li>
              <li><Link to="/" className="hover:underline">Fulfilment by NOVA MART</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-3">Let Us Help You</h3>
            <ul className="space-y-2 text-[#cccccc]">
              <li><Link to="/profile" className="hover:underline">Your Account</Link></li>
              <li><Link to="/orders" className="hover:underline">Returns Centre & Tracking</Link></li>
              <li><Link to="/orders" className="hover:underline">Scheduled Delivery Assistance</Link></li>
              <li><Link to="/" className="hover:underline">100% Purchase Protection</Link></li>
              <li><Link to="/" className="hover:underline">Customer Service & Help</Link></li>
            </ul>
          </div>
        </div>

        {/* Middle Line with Logo & Region Selector */}
        <div className="container-narrow pt-8 mt-8 border-t border-[#3a4553] flex flex-wrap items-center justify-center gap-6 text-xs text-[#cccccc]">
          <Link to="/" className="flex flex-col items-center">
            <div className="flex items-center tracking-tight leading-none">
              <span className="text-xl font-black text-white">nova</span>
              <span className="text-xl font-black text-[#febd69]">mart</span>
            </div>
            <svg className="w-16 h-2 text-[#febd69] fill-current" viewBox="0 0 100 12">
              <path d="M 0 3 Q 50 14 96 3 L 90 0 Q 50 11 4 0 Z" />
              <polygon points="94,0 100,5 98,11" />
            </svg>
          </Link>

          <div className="flex items-center gap-3">
            <div className="border border-[#848688] rounded px-3 py-1.5 flex items-center gap-1.5 cursor-default">
              <Globe className="h-3.5 w-3.5 text-[#cccccc]" />
              <span>English</span>
            </div>
            <div className="border border-[#848688] rounded px-3 py-1.5 flex items-center gap-1.5 cursor-default">
              <span>🇮🇳</span>
              <span>India</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Footer (#131921) */}
      <div className="bg-[#131921] py-8 text-center text-[11px] text-[#999999] space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/80">
          <Link to="/" className="hover:underline">Conditions of Use & Sale</Link>
          <Link to="/" className="hover:underline">Privacy Notice</Link>
          <Link to="/" className="hover:underline">Interest-Based Ads</Link>
        </div>
        <p>
          &copy; {new Date().getFullYear()}, NovaMart.in, Inc. or its affiliates. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
