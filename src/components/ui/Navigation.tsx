'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: '首页' },
    { href: '/features', label: '功能' },
    { href: '/use-cases', label: '场景' },
    { href: '/about', label: '关于' },
    { href: '/pricing', label: '价格' },
    { href: '/blog', label: '博客' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: '联系' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080810]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-bold text-lg text-white">AURA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive(link.href)
                    ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                    : 'text-[#9090b0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
            >
              开始测评
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/[0.05] rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[56px] left-0 right-0 bottom-0 bg-[#080810]/98 z-40 lg:hidden">
          <div className="p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                    : 'text-[#9090b0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-3 rounded-lg font-semibold text-center mt-4"
            >
              开始测评
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
