// src/components/layout/Footer.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { 
  ChefHat, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Press', href: '/press' }
    ],
    help: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Support', href: '/support' },
      { label: 'Track Order', href: '/orders/track' },
      { label: 'Returns', href: '/returns' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const contactInfo = [
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'contact@foodorder.com' },
    { icon: MapPin, text: '123 Food Street, City, State 12345' },
    { icon: Clock, text: 'Mon-Sun: 9:00 AM - 11:00 PM' }
  ];

  return (
    <footer className="glass-card-dark mt-20 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="neuro-card p-2">
                <ChefHat className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold glass-text">
                Food<span className="text-white/80">Order</span>
              </span>
            </div>
            <p className="glass-text text-sm leading-relaxed">
              Delicious food delivered to your doorstep. Experience the finest cuisine 
              with our modern ordering system and premium service.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 glass-text text-sm">
                  <item.icon className="h-4 w-4 text-white/60" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold glass-text mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="glass-text text-sm hover:text-white transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-semibold glass-text mb-4">Help</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="glass-text text-sm hover:text-white transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold glass-text mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="glass-text text-sm hover:text-white transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="glass-card p-6 mb-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold glass-text">Stay Updated</h3>
            <p className="glass-text text-sm">
              Subscribe to our newsletter for exclusive offers and menu updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="glass-input flex-1 text-white placeholder:text-white/60"
              />
              <button className="neuro-button whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="glass-text text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="interactive-glass p-2 rounded-full"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="glass-text text-sm text-center">
              © {currentYear} FoodOrder. All rights reserved. Made with ❤️ for food lovers.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}