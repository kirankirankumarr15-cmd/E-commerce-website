import { Link } from 'react-router-dom';
import { Share2, Globe, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'All Products', to: '/shop' },
    { label: 'New Arrivals', to: '/shop?new=true' },
    { label: 'Best Sellers', to: '/shop?bestsellers=true' },
    { label: 'Deals', to: '/shop?deals=true' },
  ],
  support: [
    { label: 'My Account', to: '/profile' },
    { label: 'Order Tracking', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Cart', to: '/cart' },
  ],
  company: [
    { label: 'About NOVA MART', to: '/' },
    { label: 'Contact Us', to: '/' },
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Service', to: '/' },
  ],
};

const Footer = () => (
  <footer className="bg-text text-white" role="contentinfo">
    <div className="container-narrow py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-lg font-bold">NOVA MART</span>
          </div>
          <p className="text-sm text-white/70 mb-4">
            Everything You Need. One Smart Store.
          </p>
          <div className="flex gap-3">
            {[Share2, Globe, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label={`Social media link ${i + 1}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h3>
          <ul className="space-y-2.5">
            {footerLinks.shop.map((link) => (
              <li key={link.to + link.label}>
                <Link to={link.to} className="text-sm text-white/70 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
          <ul className="space-y-2.5">
            {footerLinks.support.map((link) => (
              <li key={link.to + link.label}>
                <Link to={link.to} className="text-sm text-white/70 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-white/70">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              support@novamart.com
            </li>
            <li className="flex items-center gap-2 text-sm text-white/70">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              +91 98765 43210
            </li>
            <li className="flex items-start gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              Mumbai, Maharashtra, India
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/50">
          &copy; {new Date().getFullYear()} NOVA MART. All rights reserved.
        </p>
        <div className="flex gap-6">
          {footerLinks.company.slice(2).map((link) => (
            <Link key={link.label} to={link.to} className="text-sm text-white/50 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
