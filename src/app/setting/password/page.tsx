'use client';

import BackButton from "../../../../components/common/BackButton";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import AlertModal from '../../../../components/common/AlertModal';

export default function ChangePasswordPage() {
  const { t } = useTranslation();
  const auth = useAuthStore();
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ 비밀번호 유효성 검사 함수
  const isPasswordValid = (password: string) => {
    const lengthValid = password.length >= 8 && password.length <= 16;
    const hasNumber = /\d/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    return lengthValid && hasNumber && hasLower && hasUpper;
  };

  const handleSubmit = async () => {
    if (form.oldPassword !== auth.member?.member_pwd) {
      // setAlertMessage(t('setting.changePassword.currentPasswordIncorrect', 'The current password is incorrect.'));
      setAlertContent({
        title: t('setting.changePassword.errorOccurred', 'Error occurred.'),
        description: t('setting.changePassword.currentPasswordIncorrect', 'The current password is incorrect.'),
      });
      setAlertOpen(true);

      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      // setAlertMessage(t('setting.changePassword.newPasswordNotMatch', 'The new passwords you entered do not match.'));

      setAlertContent({
        title: t('setting.changePassword.errorOccurred', 'Error occurred.'),
        description: t('setting.changePassword.newPasswordNotMatch', 'The new passwords you entered do not match.'),
      });
      setAlertOpen(true);
      return;
    }

    if (!isPasswordValid(form.newPassword)) {
      // setAlertMessage('비밀번호는 8~16자이며, 숫자, 소문자, 대문자를 모두 포함해야 합니다.');
      setAlertContent({
        title: t('setting.changePassword.errorOccurred', 'Error occurred.'),
        description: t('setting.changePassword.message', 'Password must be 8–16 characters ( include a number and a capital letter.)'),
      });
      setAlertOpen(true);
      return;
    }

    if (!auth.member?.idx) {
      // setAlertMessage('로그인 정보가 없습니다.');
      setAlertContent({
        title: t('setting.changePassword.errorOccurred', 'Error occurred.'),
        description: t('common.loginRequired', 'Please log in first.'),
      });
      setAlertOpen(true);
      return;
    }

    try {
      const res = await fetch('/api/member/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_idx: auth.member.idx,
          member_pwd: form.oldPassword,
          member_new_pwd: form.newPassword,
          U_IP: '111.111.111.111', // 실제 IP 추적 또는 서버에서 감지 권장
        }),
      });

      const data = await res.json();
      if (data.resultCode === '0000') {
        setSuccess(true);
        // setAlertMessage('비밀번호가 성공적으로 변경되었습니다.');
        setAlertContent({
          title: t('setting.setting.notification.title', 'Notification'),
          description: t('setting.changePassword.passwordChangeSuccess', 'Your password has been successfully changed.'),
        });
        setAlertOpen(true);
      } else {
        // setAlertMessage('비밀번호 변경에 실패했습니다.');
        setAlertContent({
          title: t('setting.changePassword.errorOccurred', 'Error occurred.'),
          description: t('setting.changePassword.passwordChangeFail', 'Your password change has failed.'),
        });
        setAlertOpen(true);
      }
    } catch (err) {
      console.error('❌ 서버 오류:', err);
      setAlertMessage('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-white min-h-screen px-3 pt-5 pb-24 text-black">
      <BackButton />

      <div className="text-[20px] font-bold leading-snug mt-2">
        {t('setting.changePassword.content', 'Please enter your current password and new password')}
      </div>

      <div className="mt-6 space-y-4 text-[16px]">
        <input
          placeholder={t('setting.changePassword.fields.oldPassword', 'Old password')}
          value={form.oldPassword}
          onChange={(e) => handleChange('oldPassword', e.target.value)}
          className="w-full border rounded-xl py-3 px-4"
        />
        <input
          placeholder={t('setting.changePassword.fields.newPassword', 'New password')}
          value={form.newPassword}
          onChange={(e) => handleChange('newPassword', e.target.value)}
          className="w-full border rounded-xl py-3 px-4"
        />

        <div className="text-xs text-gray-600 ml-1 leading-relaxed">
        {t('setting.changePassword.message', 'Password must be 8–16 characters ( include a number and a capital letter.)')}<br />
        </div>

        <input
          placeholder={t('setting.changePassword.fields.confirmPassword', 'Confirm new password')}
          value={form.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          className="w-full border rounded-xl py-3 px-4"
        />
      </div>

      {/*alertMessage && (
        <div className={`mt-4 text-sm font-medium ${success ? 'text-green-600' : 'text-red-500'}`}>
          {alertMessage}
        </div>
      )*/}
      <AlertModal
        isOpen={alertOpen}
        onClose={handleAlertClose}
        title={alertContent.title}
        description={alertContent.description}
      />

      <button
        className="bg-pink-300 text-white w-full rounded-xl py-3 mt-10 font-semibold"
        onClick={handleSubmit}
      >
        {t('setting.changePassword.button', 'Update')}
      </button>
    </div>
  );
}
