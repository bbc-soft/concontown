'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import AlertModal from '../../../../components/common/AlertModal';
import CountrySelectModal from '../../../../components/common/CountrySelectModal';
import BackButton from '../../../../components/common/BackButton';
import { useTranslation } from 'react-i18next';

export default function EditInfoPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { member } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'F' | 'M' | 'O'>('F');
  const [birth, setBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [memberId, setMemberId] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });

  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  const [provider, setProvider] = useState('');

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const res = await fetch(`/api/member/detail?member_idx=${member?.idx}`);
        const data = await res.json();
        if (data) {
          setMemberId(data.member_id || '');
          setFirstName(data.Name_1st || '');
          setLastName(data.Name_3rd || '');
          setGender((data.Gender as 'F' | 'M' | 'O') || 'F');
          if (data.Birth_year && data.Birth_month && data.Birth_day) {
            const month = String(data.Birth_month).padStart(2, '0');
            const day = String(data.Birth_day).padStart(2, '0');
            setBirth(`${data.Birth_year}-${month}-${day}`);
          }
          setNationality(data.Nationality || '');
          setCity(data.City || '');
          setPhone(data.Phone || '');
          setNationalCode(data.National_Code || '');

          const sns_provider = localStorage.getItem('sns_provider');
          if(sns_provider)
            setProvider(sns_provider);          
        }
      } catch (err) {
        console.error('❌ Failed to load member info', err);
      }
    };

    if (member?.idx) fetchMemberInfo();
  }, [member]);

  const handleSubmit = async () => {
    const idx = Number(member?.idx);
    if (!idx) return showAlert(t('common.error'), t('loginEmail.emailError.message'));
    if (provider === '' && !currentPassword) return showAlert(t('password.sub'), t('loginPw.enterPassword'));
    if (!nationalCode || !phone) return showAlert(t('personalInfo.phone'), t('reservation.pointUsageNote'));

    const [year, month, day] = birth ? birth.split('-') : ['', '', ''];

    const res = await fetch('/api/member/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'UPDATE',
        member_idx: idx,
        member_id: memberId,
        member_pwd: currentPassword,
        member_pwd_new: currentPassword,
        Name_1st: firstName,
        Name_3rd: lastName,
        Gender: gender,
        Birth_day: day,
        Birth_month: month,
        Birth_year: year,
        Nationality: nationality,
        City: city,
        Phone: phone,
        National_Code: nationalCode,
      }),
    });

    const result = await res.json();
    if (result.result === '0000') {
      showAlert(t('complete.success'), t('complete.congrats'), () => router.replace('/myinfo'));
    } else if (result.result === '0002') {
      showAlert(t('loginPw.forgotPassword'), t('loginPw.forgotPassword'));
    } else {
      showAlert('Error', result.result);
    }
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
    <div className="p-6 max-w-[430px] w-full mx-auto bg-white text-black min-h-[100vh]">
      <BackButton label={t('myPersonalInfo.title')} />

      <label className="block mb-2 text-[16px] font-medium">{t('personalInfo.firstName')}</label>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border p-3 rounded-xl mb-4" />

      <label className="block mb-2 text-[16px] font-medium">{t('personalInfo.lastName')}</label>
      <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border p-3 rounded-xl mb-4" />

      <label className="block mb-2 text-[16px] font-medium">{t('personalInfo.dob')}</label>
      <input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="w-full border p-3 rounded-xl mb-4" />

      <label className="block mb-2 text-[16px] font-medium">{t('personalInfo.gender')}</label>
      <div className="flex gap-3 mb-4">
        {['F', 'M', 'O'].map(g => (
          <button
            key={g}
            className={`px-4 py-2 rounded-full border ${gender === g ? 'bg-[#12325B] text-white' : 'bg-white text-gray-600'}`}
            onClick={() => setGender(g as 'F' | 'M' | 'O')}
          >
            {g === 'F' ? t('personalInfo.female') : g === 'M' ? t('personalInfo.male') : t('personalInfo.both')}
          </button>
        ))}
      </div>

      <label className="block mb-2 text-[16px] font-medium">{t('personalInfo.country')}</label>
      <input
        readOnly
        onClick={() => setCountryModalOpen(true)}
        value={nationality}
        placeholder={t('personalInfo.country')}
        className="w-full border p-3 rounded-xl mb-4 cursor-pointer bg-white"
      />

      <label className="block mb-2 text-[16px] font-medium">{t('personalInfo.city')}</label>
      <input value={city} onChange={e => setCity(e.target.value)} className="w-full border p-3 rounded-xl mb-4" />

      <label className="block mb-2 text-[16px] font-medium">{t('personalInfo.phone')}</label>
      <div className="flex flex-col gap-2 mb-4">
        <div>
          <label className="text-xs text-gray-500">{t('personalInfo.dialCode')}</label>
          <input
            readOnly
            onClick={() => setCodeModalOpen(true)}
            value={nationalCode}
            placeholder={t('personalInfo.dialCode')}
            className="w-full border p-3 rounded-xl cursor-pointer bg-white"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">{t('personalInfo.phone')}</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border p-3 rounded-xl"
            placeholder={t('personalInfo.phone')}
          />
        </div>
      </div>

      {provider === '' && <label className="block mb-2 text-[16px] font-medium">{t('loginPw.enterPassword')}</label>}
      {provider === '' && <div className="relative mb-6">
        <input
          type={showPassword ? 'text' : 'password'}
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="w-full border p-3 rounded-xl pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>}

      <button onClick={handleSubmit} className="bg-[#FF8FA9] text-white w-full py-3 rounded-xl font-semibold">
        {t('myPersonalInfo.detail.editButton')}
      </button>

      <CountrySelectModal
        isOpen={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        type="country"
        onSelect={value => setNationality(value)}
      />
      <CountrySelectModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        type="code"
        onSelect={value => setNationalCode(value)}
      />
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertContent.title}
        description={alertContent.description}
      />
    </div>
  );
}
