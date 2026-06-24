'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from './BottomNav';

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 로그인(/) 및 테스트(/test) 페이지에서는 하단 네비게이션을 숨김
  const hideNavPaths = ['/', '/test'];
  const shouldHideNav = hideNavPaths.includes(pathname);

  return (
    <div className="flex flex-col h-full relative">
      <div className={`flex-1 overflow-y-auto ${!shouldHideNav ? 'pb-16' : ''}`}>
        {children}
      </div>
      {!shouldHideNav && <BottomNav />}
    </div>
  );
}
