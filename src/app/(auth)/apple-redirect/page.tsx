'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';
import BackButton from '../../../../components/common/BackButton';
import AlertModal from '../../../../components/common/AlertModal';

export default function AppleRedirectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [memberId, setMemberId] = useState('');

  const [alert, setAlert] = useState({
    open: false,
    title: '',
    description: '',
    buttonText: 'OK',
  });

  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored).state;

        if (parsed?.token && parsed?.member) {
          setMemberId(parsed?.member.member_id);
          handleLogin();
        }
      } catch (e) {
        console.error('❌ Failed to parse auth-storage:', e);
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, []);


  const handleLogin = async () => {
    const oauth = localStorage.getItem('sns_oauth_json');
    try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ member_id: memberId, member_pwd: '12345', sns_provider: localStorage.getItem('sns_provider'), sns_uid: localStorage.getItem('sns_uid') }),
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
            true
          );

          router.replace('/');
    } catch (err) {
      console.error('Login error:', err);
      alert(t('common.error', 'An error occurred during login.'));
    }
  };

    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-white pt-5 pb-28 px-5 text-black relative">
        {/*<BackButton label={t('loginEmail.signUp.subSns', 'SNS Register')} />*/}
              {/*<p className="text-[16px] text-gray-600 my-4">{t('loginEmail.signUp.snsTitle', 'Please enter the required information to complete SNS registration.')}</p>*/}

      <AlertModal isOpen={alert.open} onClose={() => setAlert((prev) => ({ ...prev, open: false }))} title={alert.title} description={alert.description} buttonText={alert.buttonText} />

    </div>
  );
}
