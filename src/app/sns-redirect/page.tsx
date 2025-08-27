// src/app/sns-redirect/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';

export default function SNSRedirectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    console.log('stored00', stored);

  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    console.log('stored01', stored);
    if (stored) {
      try {
        const parsed = JSON.parse(stored).state;
        if (parsed?.token && parsed?.member) {
          login(parsed.token, parsed.member, parsed.autoLogin);
          //router.replace('/');
          handleLogin();
        }
      } catch (e) {
        console.error('❌ Failed to parse auth-storage:', e);
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [login, router]);


  const handleLogin = async () => {
    const oauth = localStorage.getItem('sns_oauth_json');
    console.log('oauth', oauth);
    try {
      if (oauth) {
        const parsed = JSON.parse(oauth);
        if (parsed?.sub && parsed?.email) {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ member_id: parsed?.email, member_pwd: '12345', sns_provider: localStorage.getItem('sns_provider'), sns_uid: parsed?.sub }),
            headers: { 'Content-Type': 'application/json' },
          });

          if (!res.ok) {
            alert(t('loginPw.forgotPassword', 'Incorrect email or password.'));
            return;
          }

          const data = await res.json();
          const user = data.user;

          login(
            data.token,
            {
              idx: user.idx,
              member_id: user.email,
              Name_1st: user.Name_1st,
              Name_3rd: user.Name_3rd,
              email: user.email,
              member_pwd: '',
            },
            parsed.autoLogin
          );

          router.replace('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(t('common.error', 'An error occurred during login.'));
    }
  };

  return null;
}
