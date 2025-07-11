'use client';

import BackButton from '../../../../components/common/BackButton';
import NextButton from '../../../../components/common/NextButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NewPasswordPage() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="min-h-screen px-5 pt-12 pb-6 flex flex-col bg-white">
      <BackButton />

      <div className="mt-8">
        <p className="text-base font-bold leading-snug mb-6">
          {t('password.sub', 'Please enter a new password.')}
        </p>

        <div className="relative mb-4">
          <input
            type={visible ? 'text' : 'password'}
            placeholder={t('password.new', 'New password')}
            defaultValue="its1secret"
            className="w-full px-4 py-3 border border-[#e7527f] rounded-lg text-[16px]"
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {visible ? '🙈' : '👁️'}
          </button>
        </div>

        <ul className="text-xs space-y-1 mb-4">
          <li className="text-blue-600">{t('password.characters', '8–16 characters')}</li>
          <li className="text-blue-600">{t('password.numbers', '1 or more numbers')}</li>
          <li className="text-red-500">{t('password.symbols', '1 or more symbols')}</li>
        </ul>

        <input
          type="password"
          placeholder={t('password.confirm', 'Confirm new password')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[16px]"
        />
      </div>

      <div className="mt-auto">
        <NextButton label={t('password.button', 'Next')} disabled />
      </div>
    </div>
  );
}
