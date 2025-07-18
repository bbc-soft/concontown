// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import BackButton from '../../../../components/common/BackButton';
// import { useAuthStore } from '@/stores/useAuthStore';
// import { useTranslation } from 'react-i18next';

// export default function RegisterPage() {
//   const { t } = useTranslation();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [autoLogin, setAutoLogin] = useState(true);

//   useEffect(() => {

//   }, []);

  
//   return (
//     <div className="max-w-[430px] mx-auto min-h-screen bg-white pt-5 pb-28 px-5 text-black relative">
//       <BackButton label={t('loginEmail.signUp.subSns', 'SNS Register')} />
//       <p className="text-[16px] text-gray-600 my-4">{t('loginEmail.signUp.snsTitle', 'Please enter the required information to complete SNS registration.')}</p>

//       <p className="text-xs text-gray-500 mb-1">
//         {t('register.guide.firstName')}
//       </p>
//     </div>
//   );
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';
import BackButton from '../../../../components/common/BackButton';

export default function SNSRedirectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const stored = localStorage.getItem('auth-storage');
    alert('stored check');
    if (stored) {
      try {
        const parsed = JSON.parse(stored).state;
        if (parsed?.token && parsed?.member) {
          login(parsed.token, parsed.member, parsed.autoLogin);
          //router.replace('/');
          alert('handleLogin');
          handleLogin();
        }
      } catch (e) {
        console.error('❌ Failed to parse auth-storage:', e);
        alert('Failed to parse auth-storage');
        router.replace('/login');
      }
    } else {
      alert('stored no');
      router.replace('/login');
    }
  }, [login, router]);


  const handleLogin = async () => {
    const oauth = localStorage.getItem('sns_oauth_json');
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

          alert('login success!!');

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

          // router.replace('/');
          // window.location.reload();
          // router.refresh();
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(t('common.error', 'An error occurred during login.'));
    }
  };

  // return null;
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-white pt-5 pb-28 px-5 text-black relative">
        <BackButton label={t('loginEmail.signUp.subSns', 'SNS Register')} />
              <p className="text-[16px] text-gray-600 my-4">{t('loginEmail.signUp.snsTitle', 'Please enter the required information to complete SNS registration.')}</p>

    </div>
  );
}
