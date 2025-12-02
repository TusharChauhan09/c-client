import { Link } from 'react-router-dom';
import { IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin, IconBrandFacebook } from '@tabler/icons-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About', href: '/about' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Blog', href: '#' },
    ],
    discover: [
      { name: 'Partner Program', href: '#' },
      { name: 'What is Travel AI', href: '/travel-ai' },
      { name: 'Resources', href: '#' },
    ],
    product: [
      { name: 'Marketplace', href: '/explore' },
      { name: 'Terms & Conditions', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
    helpCenter: [
      { name: 'Community', href: '#' },
      { name: 'Knowledge Base', href: '#' },
      { name: 'Support', href: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: IconBrandFacebook, href: '#', label: 'Facebook' },
    { icon: IconBrandTwitter, href: '#', label: 'Twitter' },
    { icon: IconBrandInstagram, href: '#', label: 'Instagram' },
    { icon: IconBrandLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-muted/30 text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-serif">Travel Planner</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Embark with us on an extraordinary journey where each destination becomes 
              a vivid chapter within your personal adventure tale.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover Links */}
          <div>
            <h3 className="font-semibold mb-4">Discover</h3>
            <ul className="space-y-2">
              {footerLinks.discover.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Center Links */}
          <div>
            <h3 className="font-semibold mb-4">Help Center</h3>
            <ul className="space-y-2">
              {footerLinks.helpCenter.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © Copyright {currentYear}. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
