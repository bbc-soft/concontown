// app/(auth)/forgot/page.tsx
'use client';

import { useState, useEffect } from 'react';
import BackButton from '../../../../components/common/BackButton';
import NextButton from '../../../../components/common/NextButton';
import AlertModal from '../../../../components/common/AlertModal';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    member_id: '',
    name_1st: '',
    name_3rd: '',
  });  

  const [alert, setAlert] = useState({
    open: false,
    title: '',
    description: '',
    buttonText: t('loginEmail.modal.button', 'OK'),
  });

  const handleChange = (name: string, value: string) => {
    const onlyEnglish = /^[a-zA-Z]*$/;

    // if(name === 'name_1st' || name === 'name_3rd') {
    //   if (onlyEnglish.test(value)) {
    //     setForm((prev) => ({ ...prev, [name]: value }));
    //   }
    // } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    // }
  };

  const handleSubmit = async () => {
    if (!form.member_id) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descMemberId', 'Please enter your email.'), buttonText: 'OK' });
      return;
    }

    if (!form.name_1st || !form.name_3rd) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descName', 'Please enter your full name.'), buttonText: 'OK' });
      return;
    }

    const res = await fetch('/api/auth/password', {
      method: 'POST',
      body: JSON.stringify({ member_id: form.member_id, name_1st: form.name_1st, name_3rd: form.name_3rd }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    console.log(data)

    const code = data.resultCode;

    const messages: Record<string, string> = {
      '0000': t('forgotPassword.passwordSent', { email: form.member_id }),
      '0001': t('forgotPassword.noMember'),
      '0002': t('forgotPassword.informationMismatch'),
    };

    setAlert({
        open: true,
        title: 'Caution',
        description: messages[code] || 'Unknown response',
        buttonText: 'OK',
    });

    if(code === '0000') {
      window.location.href = '/login';
    }
  }

  return (
    <div className="px-5 pt-12 pb-6 flex flex-col bg-white">
      <BackButton />

      <div className="mt-8">
        <p className="text-base font-bold leading-snug mb-6">
          {t('forgotPassword.emailAddress', 'Please enter the email address you signed up with.')}
        </p>

        <input
          placeholder={t('loginEmail.emailPlaceholder', 'Email')}
          value={form.member_id}
          onChange={(e) => handleChange('member_id', e.target.value)}
          className="w-full px-4 py-3 border border-[#e7527f] rounded-lg text-[16px]"
        />
      </div>

      <div className="mt-8">
        <p className="text-base font-bold leading-snug mb-6">
          {t('forgotPassword.firstName', 'Please enter the first name you signed up with.')}
        </p>

        <input
          placeholder={t('personalInfo.firstName', 'First name ( Given name)')}
          value={form.name_1st}
          onChange={(e) => handleChange('name_1st', e.target.value)}
          // onFocus={(e) => {
          //   if (document.activeElement && document.activeElement !== e.target) {
          //     (document.activeElement as HTMLElement).blur();
          //   }
          //   setTimeout(() => {
          //     e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          //   }, 300);
          // }}
          className="w-full px-4 py-3 border border-[#e7527f] rounded-lg text-[16px]"
        />
      </div>

      <div className="mt-8">
        <p className="text-base font-bold leading-snug mb-6">
          {t('forgotPassword.lastName', 'Please enter the last name you signed up with.')}
        </p>

        <input
          placeholder={t('personalInfo.lastName', 'Last name ( Family name)')}
          value={form.name_3rd}
          onChange={(e) => handleChange('name_3rd', e.target.value)}
          className="w-full px-4 py-3 border border-[#e7527f] rounded-lg text-[16px]"
        />
      </div>

      <button
        className="bg-pink-300 text-white w-full rounded-xl py-3 mt-10 font-semibold"
        onClick={handleSubmit}
      >
        {t('forgotPassword.SendTempPassword', 'Send temporary password')}
      </button>

      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        title={alert.title}
        description={alert.description}
        buttonText={alert.buttonText}
      />
    </div>
  );
}
