'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '../../../../components/common/BackButton';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [autoLogin, setAutoLogin] = useState(true);

  useEffect(() => {

  }, []);

  
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white pt-5 pb-28 px-5 text-black relative">
      <BackButton label={t('loginEmail.signUp.subSns', 'SNS Register')} />
      <p className="text-[16px] text-gray-600 my-4">{t('loginEmail.signUp.snsTitle', 'Please enter the required information to complete SNS registration.')}</p>

      <p className="text-xs text-gray-500 mb-1">
        {t('register.guide.firstName')}
      </p>
    </div>
  );
}
