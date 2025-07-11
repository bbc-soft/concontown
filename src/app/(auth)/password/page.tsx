'use client';

import BackButton from '../../../../components/common/BackButton';
import TitleText from '../../../../components/common/TitleText';
import NextButton from '../../../../components/common/NextButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PasswordPage() {
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="min-h-screen px-5 pt-12 pb-6 flex flex-col bg-white">
      <BackButton />
      <div className="mt-8">
        <TitleText title={t('setting.changePassword.content', 'Please enter your current password and new password')} />

        {/* ✅ 기존 비밀번호 */}
        <div className="mt-4 relative">
          <input
            type="password"
            placeholder={t('setting.changePassword.fields.oldPassword', 'Old password')}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#e7527f] rounded-lg text-[16px]"
          />
        </div>

        {/* ✅ 새 비밀번호 */}
        <div className="mt-4 relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder={t('setting.changePassword.fields.newPassword', 'New password')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#e7527f] rounded-lg text-[16px]"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {passwordVisible ? '🙈' : '👁️'}
          </button>
        </div>

        {/* ✅ 새 비밀번호 확인 */}
        <div className="mt-4 relative">
          <input
            type={confirmVisible ? 'text' : 'password'}
            placeholder={t('setting.changePassword.fields.confirmPassword', 'Confirm new password')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-[#e7527f] rounded-lg text-[16px]"
          />
          <button
            type="button"
            onClick={() => setConfirmVisible(!confirmVisible)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {confirmVisible ? '🙈' : '👁️'}
          </button>
        </div>

        {/* ✅ 비밀번호 조건 안내 */}
        <p className="text-xs text-gray-500 mt-2 ml-1 leading-relaxed">
          {t('setting.changePassword.message.characters', 'The password must be between 8 and 16 characters.')}<br />
          {t('setting.changePassword.message.moreNumbers', 'It must include at least one number,')}<br />
          {t('setting.changePassword.message.moreSymbold', 'and at least one lowercase and one uppercase letter.')}
        </p>
      </div>

      <div className="mt-auto">
        <NextButton label={t('setting.changePassword.button', 'Update')} />
      </div>
    </div>
  );
}
