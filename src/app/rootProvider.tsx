'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function RootProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, login } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored).state;
      if (parsed?.token && parsed?.member) {
        login(parsed.token, parsed.member, parsed.autoLogin);
      }
    }

    setHydrated(true); // ✅ 상태 복구가 끝났다는 플래그
  }, []);

  useEffect(() => {
    if (!hydrated) return; // 복구되기 전이면 아무것도 하지 않음

    if (!isLoggedIn && !pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/sign') && !pathname.startsWith('/forgot')) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [hydrated, isLoggedIn, pathname, router]);

  if (!hydrated) return null; // 상태 복구가 끝나기 전엔 아무것도 보여주지 않음

  return <>{children}</>;
}
