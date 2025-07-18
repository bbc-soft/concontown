'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import BackButton from '../common/BackButton';
import AlertModal from '../common/AlertModal';
import { useTranslation } from 'react-i18next';

export default function LoginEmailPageInner() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (window.history.length <= 2) {
      setShowBackButton(false);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ member_id: email, member_pwd: password, sns_provider: '', sns_uid: '' }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setModalTitle(t('loginPw.loginFailed', 'Login Failed'));
        setModalDescription(t('loginPw.incorrectEmailPassword', 'Incorrect email or password.'));
        setShowModal(true);
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
          member_pwd: user.member_pwd,
        },
        autoLogin
      );

      router.replace(redirect ?? '/');
    } catch (err) {
      console.error('Login error:', err);
      setModalTitle(t('common.error', 'Login Error'));
      setModalDescription(t('common.error', 'An error occurred during login.'));
      setShowModal(true);
    }
  };

  const handleSignUp = () => {
    // if(navigator.userAgent.includes('concontown-ios')) {
    //   router.push('/register');
    // } else {
      router.push('/sign');
    // }
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
          {t('loginEmail.continueButton', 'Log In')}
        </p>

        <input
          type="email"
          placeholder={t('loginEmail.emailPlaceholder', 'Email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#e1e1e1] rounded-lg px-4 py-3 text-[16px] mb-3"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('loginPw.passwordPlaceholder', 'Password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#e1e1e1] rounded-lg px-4 py-3 text-[16px]"
          />
          <img
            src={showPassword ? '/eye.svg' : '/eye-slash.svg'}
            alt="toggle visibility"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 w-5 h-5 cursor-pointer"
          />
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="autoLogin"
            checked={autoLogin}
            onChange={() => setAutoLogin(!autoLogin)}
            className="mr-2 w-4 h-4"
          />
          <label htmlFor="autoLogin" className="text-[16px]">
            {t('setting.setting.notification.autoLogIn', 'Remember me (Auto Login)')}
          </label>
        </div>

        <button
          onClick={handleLogin}
          disabled={!email || !password}
          className={`w-full rounded-xl py-3 text-white text-base font-semibold mt-4 ${
            email && password ? 'bg-[#FF8FA9]' : 'bg-gray-300'
          }`}
        >
          {t('loginEmail.continueButton', 'Log In')}
        </button>

        <div
          className="mt-3 text-center text-[16px] text-[#12325b] underline cursor-pointer"
          onClick={() => {
            router.push('/forgot');
          }}
        >
          {t('loginPw.forgotPassword', 'Forgot password?')}
        </div>

        <div className="my-4 flex items-center text-gray-400 text-[16px]">
          <hr className="flex-grow border-t border-gray-200" />
          <span className="mx-4">{t('loginEmail.or', 'or')}</span>
          <hr className="flex-grow border-t border-gray-200" />
        </div>

        <div className="mt-3 space-y-3">
          {navigator.userAgent.includes('concontown-ios') && <button
            onClick={() => {
              window.location.href = '/api/auth/apple/login';
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5" />
            <span className="text-[16px] font-medium text-gray-800">
              {t('login.appleLogin', 'Log in with Apple account')}
            </span>
          </button>}

          {navigator.userAgent.includes('concontown-android') && <button
            onClick={() => {
              window.location.href = '/api/auth/google/login';
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            <span className="text-[16px] font-medium text-gray-800">
              {t('login.googleLogin', 'Log in with Google account')}
            </span>
          </button>}
        </div>

        <div
          className="mt-3 text-[16px] text-[#12325b] cursor-pointer"
        >
          {t('login.ifNoAccount', 'If you don’t have an account')}
        </div>

        <button
          onClick={handleSignUp}
          className="w-full rounded-xl py-3 text-[#FF8FA9] text-base font-semibold mt-3 border border-[#FF8FA9]"
        >
          {t('login.signUp', 'Sign Up')}
        </button>
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
