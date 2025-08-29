'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';

import AlertModal from '../../../components/common/AlertModal';

interface MemberInfo {
  Name_1st: string;
  Name_3rd: string;
  Birth_day: number;
  Birth_month: number;
  Birth_year: number;
  Gender: 'M' | 'F' | 'O';
  Nationality: string;
  City: string;
  Phone: string;
  Mail: string;
  EMAIL: string;
  isInfoUpdate: string;
  National_Code: string;
  passport: string;
}

export default function MyInfoPage() {
  const { member } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();
  const [info, setInfo] = useState<MemberInfo | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchInfo = async () => {
      const res = await fetch(`/api/member/detail?member_idx=${member?.idx}`);
      const data = await res.json();
      setInfo(data);
    };

    if (member?.idx) fetchInfo();
  }, [member]);

  const formatDate = (d: number, m: number, y: number) => {
    const day = d.toString().padStart(2, '0');
    const month = m.toString().padStart(2, '0');
    return `${y}.${month}.${day}`;
  };

  const showAlert = (title: string, description: string, callback?: () => void) => {
    setAlertContent({ title, description });
    setAlertOpen(true);
    if (callback) {
      setTimeout(() => {
        setAlertOpen(false);
        callback();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white px-5 pt-12 pb-10 text-black max-w-[430px] w-full mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{t('myPersonalInfo.title')}</h1>
      </div>

      {/* 안내 문구 */}
      <p className="text-[16px] text-[#ED1C24] font-semibold mb-6">
        {t('myPersonalInfo.detail.message')}
      </p>

      {info && (
        <div className="space-y-6 text-[14px]">
          <div>
            <div className="text-gray-500 mb-1">{t('myPersonalInfo.detail.name')}</div>
            <div className="font-semibold">{info.Name_1st} / {info.Name_3rd}</div>
          </div>
          <Divider />
          <div>
            <div className="text-gray-500 mb-1">{t('myPersonalInfo.detail.date')}</div>
            <div className="font-semibold">{formatDate(info.Birth_day, info.Birth_month, info.Birth_year)}</div>
          </div>
          <Divider />
          <div>
            <div className="text-gray-500 mb-1">{t('myPersonalInfo.detail.gender')}</div>
            <div className="font-semibold">
              {info.Gender === 'F'
                ? t('personalInfo.female')
                : info.Gender === 'M'
                ? t('personalInfo.male')
                : t('personalInfo.both')}
            </div>
          </div>
          <Divider />
          <div>
            <div className="text-gray-500 mb-1">{t('myPersonalInfo.detail.country')}</div>
            <div className="font-semibold">{info.Nationality}</div>
          </div>
          <Divider />
          <div>
            <div className="text-gray-500 mb-1">{t('myPersonalInfo.detail.city')}</div>
            <div className="font-semibold">{info.City}</div>
          </div>
          <Divider />
          <div>
            <div className="text-gray-500 mb-1">{t('myPersonalInfo.detail.contactNumber')}</div>
            <div className="font-semibold">+{info.National_Code}</div>
            <div className="font-semibold">{info.Phone}</div>
          </div>
        </div>
      )}

      {/* 수정 버튼 */}
      <button
        className="mt-10 w-full py-3 bg-[#FF8FA9] text-white text-base font-bold rounded-xl"
        onClick={() => {
          // showAlert(t('setting.setting.notification.title'), t('personalInfo.disableEditAlert'));
          router.push('/myinfo/edit');
        }}
      >
        {t('myPersonalInfo.detail.editButton')}
      </button>

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertContent.title}
        description={alertContent.description}
        />
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', alignSelf: 'stretch', background: '#F0F1F3' }} />;
}
