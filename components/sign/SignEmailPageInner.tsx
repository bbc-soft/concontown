'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import BackButton from '../common/BackButton';
import AlertModal from '../common/AlertModal';
import { useTranslation } from 'react-i18next';

export default function SignEmailPageInner() {
  const { t } = useTranslation();
  const [showBackButton, setShowBackButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (window.history.length <= 2) {
      setShowBackButton(false);
    }
  }, []);

  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-5 bg-white text-black">
      {showBackButton && (
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
      )}

      <div className="mb-6 text-center text-2xl font-bold">
        <span className="text-[#ff8fa9] font-['SMTOWN(OTF)']">CONCON</span>
        <span className="text-[#A3A6AA] font-['SMTOWN(OTF)']">TOWN</span>
      </div>

      <div className="w-full max-w-sm">
        <p className="text-xl font-bold mb-6 text-center">
          {t('login.signUpRegister', 'Sign up for membership')}
        </p>

        <div className="mt-3 space-y-3">
          <button
            onClick={() => {
              window.location.href = '/api/auth/apple/login';
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5" />
            <span className="text-[16px] font-medium text-gray-800">
              {t('loginEmail.signUp.apple', 'Sign up with Apple account')}
            </span>
          </button>

          <button
            onClick={() => {
              window.location.href = '/api/auth/google/login';
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            <span className="text-[16px] font-medium text-gray-800">
              {t('loginEmail.signUp.Google', 'Sign up with Google account')}
            </span>
          </button>
        </div>

        <button
          onClick={handleSignUp}
          className="w-full rounded-xl py-3 text-[#FF8FA9] text-base font-semibold mt-3 border border-[#FF8FA9]"
        >
          {t('loginEmail.signUp.sub', 'Sign Up')}
        </button>

        <div
          className="mt-10 text-center text-[16px] text-[#12325b]"
        >
          {t('login.guideMessage1', 'Notice for E-mail Registration')}
        </div>

        <div
          className="mt-3 text-center text-[14px] text-[#12325b]"
        >
          {t('login.guideMessage2')}
        </div>        
      </div>

      <AlertModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        description={modalDescription}
        buttonText={t('loginEmail.modal.button', 'Close')}
      />
    </div>
  );
}
