'use client';

import Image from 'next/image';
import NextButton from '../../../../components/common/NextButton';
import { useTranslation } from 'react-i18next';

export default function SignupCompletePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center px-5 pt-24 pb-10 bg-white text-center">
      <div>
        <Image
          src="/auth/complete.png"
          alt="complete"
          width={180}
          height={180}
          className="mx-auto mb-6"
        />
        <h1 className="text-xl font-bold mb-2">{t('complete.congrats', 'Sign up completed!')}</h1>
        <p className="text-[16px] text-[#646668]">
          {t('complete.success', 'You can now use all the services of')}
          <br />
          <span className="font-bold">CON!CON! TOWN</span>
        </p>
      </div>

      <div className="w-full">
        <NextButton label={t('complete.goHome', 'Go to Main')} onClick={() => {}} />
      </div>
    </div>
  );
}
