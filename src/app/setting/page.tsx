'use client';

import { useEffect, useState } from 'react';
import Switch from '../../../components/common/Switch';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import BackButton from '../../../components/common/BackButton';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { useAuthStore } from '@/stores/useAuthStore';
import { isAndroid, isIOS } from 'react-device-detect';

const langCodeToKey: Record<string, string> = {
  en: 'english',
  kr: 'korean',
  jp: 'japanese',
  cn: 'chinese',
};

export default function SettingPage() {
  const { langCode } = useLanguageStore();
  const currentLanguageKey = langCodeToKey[langCode] || 'english';
  const { t } = useTranslation();
  const auth = useAuthStore();
  const updateLocalMailYN = useAuthStore((state) => state.updateMailYN);
  const updateLocalIsPush = useAuthStore((state) => state.updateIsPush);

  const [ready, setReady] = useState(false);
  const [allowMarketing, setAllowMarketing] = useState(false);
  const [allowPush, setAllowPush] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      const onReady = () => setReady(true);
      i18n.on('initialized', onReady);
      return () => {
        i18n.off('initialized', onReady);
      };
    }
  }, []);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const idx = auth.member?.idx;
        if (!idx) return;

        const res = await fetch(`/api/member/detail?member_idx=${idx}`);
        const data = await res.json();

        if (data.MailYN) {
          const isMarketing = data.MailYN === 'Y';
          setAllowMarketing(isMarketing);
          updateLocalMailYN(data.MailYN);
        }

        if (data.isPush) {
          const isPush = data.isPush === 'Y';
          setAllowPush(isPush);
          updateLocalIsPush(data.isPush);
        }
      } catch (err) {
        console.error('❌ Failed to fetch latest member detail:', err);
      }
    };

    fetchMember();
  }, [auth.member]);

  const updateMailYN = async (MailYN: string) => {
    try {
      if (!auth.member?.idx) return;
      const res = await fetch('/api/member/update-mailyn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_idx: auth.member.idx, MailYN }),
      });
      const data = await res.json();
      console.log('✅ MailYN update result:', data);
    } catch (err) {
      console.error('❌ Failed to update MailYN:', err);
    }
  };

  const updatePushYN = async (isPush: string) => {
    try {
      if (!auth.member?.idx) return;
      const res = await fetch('/api/member/update-pushyn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_idx: auth.member.idx, isPush }),
      });
      const data = await res.json();
      console.log('✅ PushYN update result:', data);
    } catch (err) {
      console.error('❌ Failed to update PushYN:', err);
    }
  };

  if (!ready) return null;

  const handleAppUpdate = () => {
    const iosLink = 'https://apps.apple.com/app/concontown/id6745476319';
    const androidLink = 'https://play.google.com/store/apps/details?id=com.concontown.app';
    const link = isIOS ? iosLink : isAndroid ? androidLink : '/';
    window.open(link, '_blank');
  };

  return (
    <div className="bg-white text-black max-w-[430px] mx-auto min-h-screen pb-10 px-3">
      <div className="py-4 flex items-center">
        <BackButton />
        <h1 className="ml-2 text-lg font-semibold">{t('setting.setting.title')}</h1>
      </div>

      {/* App Language */}
      <div className="px-5 py-4 border-b border-[#F0F1F3]">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-md font-medium">{t('setting.setting.appLanguage')}</div>
            <div className="text-xs text-gray-500 mt-1">{t('setting.setting.appLanguageSub')}</div>
          </div>
          <Link href="/setting/language" className="flex items-center gap-1">
            <span className="text-[#FF8FA9] font-semibold text-md">
              {t(`language.${currentLanguageKey}`)}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Account Password */}
      <Link href="/setting/password">
        <div className="px-5 py-4 border-b border-[#F0F1F3] flex justify-between items-center">
          <div className="text-md font-medium">{t('setting.setting.accountPassword')}</div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </Link>

      {/* Notification */}
      <div className="px-5 pt-6 pb-1 border-b border-[#F0F1F3]">
        <div className="text-md font-bold mb-3">{t('setting.setting.notification.title')}</div>
        <Switch label={t('setting.setting.notification.autoLogIn')} defaultChecked />
        <Switch
          label={t('setting.setting.notification.marketingEmail')}
          checked={allowMarketing}
          onChange={(val: boolean) => {
            const yn = val ? 'Y' : 'N';
            setAllowMarketing(val);
            updateMailYN(yn);
            updateLocalMailYN(yn);
          }}
        />
        <Switch
          label={t('setting.setting.notification.personalNotice')}
          checked={allowPush}
          onChange={(val: boolean) => {
            const yn = val ? 'Y' : 'N';
            setAllowPush(val);
            updatePushYN(yn);
            updateLocalIsPush(yn);
          }}
        />
      </div>

      {/* App Update */}
      <div className="px-5 py-6">
        <div className="text-md font-bold mb-4">{t('setting.setting.applicationInformation.title')}</div>
        <div className="flex justify-between text-md mb-2">
          <span className="text-gray-700">{t('setting.setting.applicationInformation.installedVersion')}</span>
          <span className="font-medium">v1.0.2</span>
        </div>
        <div className="flex justify-between text-md mb-4">
          <span className="text-gray-700">{t('setting.setting.applicationInformation.latestVersion')}</span>
          <span className="font-medium">v1.0.3</span>
        </div>

        <button
          onClick={handleAppUpdate}
          className="w-full mt-2 py-3 rounded-lg bg-[#FF8FA9] text-white font-semibold text-center"
        >
          {t('setting.setting.applicationInformation.updateApp', 'Update App')}
        </button>
      </div>
    </div>
  );
}
