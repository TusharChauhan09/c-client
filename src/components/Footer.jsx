import { Link } from 'react-router-dom';
import { IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin, IconBrandGithub, IconHeart, IconArrowUp, IconMapPin } from '@tabler/icons-react';
import { useState } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const quickLinks = [
    { name: 'Explore', href: '/explore' },
    { name: 'Travel AI', href: '/travel-ai' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ];

  const socialLinks = [
    { icon: IconBrandTwitter, href: '#', label: 'Twitter', color: '#1DA1F2' },
    { icon: IconBrandInstagram, href: '#', label: 'Instagram', color: '#E4405F' },
    { icon: IconBrandLinkedin, href: '#', label: 'LinkedIn', color: '#0A66C2' },
    { icon: IconBrandGithub, href: '#', label: 'GitHub', color: '#6e5494' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-background border-t border-border">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Subtle background elements */}
      <div className="absolute bottom-0 left-1/4 w-96 h-32 bg-primary/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-24 bg-primary/5 rounded-full blur-2xl" />
      
      {/* Main content */}
      <div className="relative">
        <div className="max-w-5xl mx-auto px-6 py-4">
          
          {/* Top section - Brand & Links inline */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 group"
            >
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                <IconMapPin size={14} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold">Travel Planner</span>
            </Link>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-0.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isHovered = hoveredSocial === social.label;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    onMouseEnter={() => setHoveredSocial(social.label)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className="relative p-1.5 rounded-full transition-all duration-300 hover:scale-110"
                    style={{
                      color: isHovered ? social.color : undefined,
                    }}
                  >
                    <Icon 
                      size={16} 
                      className={`transition-all duration-300 ${isHovered ? 'drop-shadow-lg' : 'text-muted-foreground'}`}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-3" />

          {/* Bottom section - Copyright & Legal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <p className="flex items-center gap-1.5">
              © {currentYear} Travel Planner. Made with 
              <IconHeart size={12} className="text-red-500 fill-red-500" />
            </p>
            
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll to top - positioned on the right */}
        <button
          onClick={scrollToTop}
          className="absolute right-6 bottom-6 p-2.5 rounded-full bg-background/80 hover:bg-primary/10 border border-border hover:border-primary/40 shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
          aria-label="Scroll to top"
        >
          <IconArrowUp 
            size={16} 
            className="text-muted-foreground group-hover:text-primary transition-colors" 
          />
        </button>
      </div>
    </footer>
  );
}
