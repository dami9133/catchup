'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: '홈', icon: '🏠' },
    { href: '/community', label: '커뮤니티', icon: '💬' },
    { href: '/matching', label: '체험매칭', icon: '🤝' },
    { href: '/mypage', label: '마이페이지', icon: '👤' },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-slate-900 border-t border-slate-800 pb-safe z-50">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
