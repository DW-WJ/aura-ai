'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: '工具' },
    { href: '/features', label: '功能' },
    { href: '/use-cases', label: '场景' },
    { href: '/about', label: '关于' },
    { href: '/pricing', label: '价格' },
    { href: '/blog', label: '博客' },
    { href: '/faq', label: '常见问题' },
    { href: '/contact', label: '联系' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080810]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <span className="font-bold text-lg hidden sm:inline">AURA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(link.href)
                  ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                  : 'text-[#9090b0] hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/"
            className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
          >
            开始测评
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-white/[0.05] rounded-lg transition-all"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0e0e1a]">
          <div className="px-4 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                    : 'text-[#9090b0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/"
              className="block w-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-2 rounded-lg font-semibold text-sm text-center hover:shadow-lg transition-all mt-4"
            >
              开始测评
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
