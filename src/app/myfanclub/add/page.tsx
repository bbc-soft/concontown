'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '../../../../components/common/BackButton';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguageStore } from '@/stores/useLanguageStore'; 
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import AlertModal from '../../../../components/common/AlertModal';

interface Fanclub {
  Fanclub_Code: string;
  Fanclub_Name: string;
  Fanclub_Full_Name: string;
}

export default function AddFanClubPage() {
  const router = useRouter();
  const { member } = useAuthStore();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [nameHanja, setNameHanja] = useState('');
  const [nameKana, setNameKana] = useState('');
  const [jpNumber, setJpNumber] = useState('');
  const [membership, setMembership] = useState('');
  const [availableFanclubs, setAvailableFanclubs] = useState<Fanclub[]>([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });
  const { langId } = useLanguageStore();

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        if (!member?.idx) return;
        const res = await fetch(`/api/fanclub/available?member_idx=${member.idx}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setAvailableFanclubs(data); // 객체 배열 그대로 저장
        } else {
          console.error('Invalid fanclub list format:', data);
        }
      } catch (err) {
        console.error('Failed to fetch fanclub list:', err);
      }
    };
    fetchAvailable();

    const fetchWeverse = async () => {
      try {
        if (!member?.idx) return;
        const res = await fetch(`/api/fanclub/weverse?member_idx=${member.idx}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          if(data[0].Weverse_Email) {
            // setEmail(data[0].Weverse_Email);
          }
        } else {
          console.error('Invalid fanclub list format:', data);
        }
      } catch (err) {
        console.error('Failed to fetch fanclub list:', err);
      }
    };
    fetchWeverse();
  }, [member]);

  const handleChangeNameKana = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // 가타카나만 허용 (\u30A0–\u30FF)
    // const katakanaOnly = input.replace(/[^\u30A0-\u30FF]/g, '');
    // setNameKana(katakanaOnly);
    setNameKana(input);
  };

  const handleChangeBirthday = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digitsOnly = input.replace(/[^0-9]/g, ''); // 숫자만 남기기
    setBirthday(input);
  };

  const handleSubmit = async () => {
    if (!member?.idx) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('common.loginRequired', 'Please log in first.'),
      });
      setAlertOpen(true);
      return;
    }
  
    if (!selectedCode) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.selectFanclubAlert', 'Please select a fanclub.'),
      });
      setAlertOpen(true);
      return;
    }
  
    if (!membership) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.enterMembershipNumber', 'Please enter your membership number.'),
      });
      setAlertOpen(true);
      return;
    }

    if (membership.length < 11) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.enterMembershipNumber11digits', 'Your membership number must be 11 digits long.'),
      });
      setAlertOpen(true);
      return;
    }
  
    if (!nameHanja) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.enterHanja', 'Please enter your name in Hanja.'),
      });
      setAlertOpen(true);
      return;
    }
  
    if (!nameKana) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.enterKana', 'Please enter your name in Katakana.'),
      });
      setAlertOpen(true);
      return;
    }
  
    if (!email) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.enterEmail', 'Please enter your Weverse email.'),
      });
      setAlertOpen(true);
      return;
    }

    if (!jpNumber) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.enterJpNumber', 'Please enter your JP. MEMBERSHIP NO.'),
      });
      setAlertOpen(true);
      return;
    }

    if (jpNumber.length < 6) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.enterJpNumber6Digits', 'JP. MEMBERSHIP NO. must be 6 digits.'),
      });
      setAlertOpen(true);
      return;
    }

    if (!birthday) {
      setAlertContent({
        title: t('common.warning', 'Warning'),
        description: t('fanclub.enterBirthday', 'Please enter your birthday.'),
      });
      setAlertOpen(true);
      return;
    }

    // const resCheck = await fetch('/api/fanclub/check-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     LangId: langId,
    //     method: 'ID',
    //     member_idx: member.idx,
    //     Weverse_Email: email,
    //     U_IP: '111,111,111,111'
    //   }),
    // });
    // const resultCheck = await resCheck.json();
    // console.log('resultCheck', resultCheck);

    // if(resultCheck?.Result !== '0000') {
    //   setAlertContent({
    //     title: t('common.error', 'Error'),
    //     description: resultCheck?.ResultStr || t('common.errorOccurred', 'An error occurred.'),
    //   });
    //   setAlertOpen(true);
    //   return;
    // }
  
    const res = await fetch('/api/fanclub/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        LangId: langId,
        method: 'INSERT',
        member_idx: member.idx,
        Fanclub_Code: selectedCode,
        Fanclub_ID: membership,
        Remark1: nameHanja,
        Remark2: nameKana,
        Remark3: jpNumber,
        Remark4: birthday,
        Weverse_Email: email
      }),
    });
  
    const result = await res.json();
    if (result?.Result === '0000') {
      router.push('/myfanclub');
    } else {
      setAlertContent({
        title: t('common.error', 'Error'),
        description: result?.ResultStr || t('common.errorOccurred', 'An error occurred.'),
      });
      setAlertOpen(true);
    }
  };

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6 text-black bg-white min-h-[100vh]">
      <BackButton label={t('fanclub.add')} />
      <div className="mb-2">
        <Image
          src="/M-jp.png"
          alt="fanclub image"
          width={1024}
          height={300}
          className="w-full rounded-xl object-cover"
        />
      </div>

      <label className="block text-[16px] font-medium mb-4">{t('fanclub.message', 'Please fill in the information you are registering with the fan club.')}</label>

      <label className="block text-[16px] font-medium mb-2">{t('fanclub.select')}</label>
      <select
        value={selectedCode}
        onChange={(e) => setSelectedCode(e.target.value)}
        className="w-full border p-3 rounded-xl mb-6"
      >
        <option value="">{t('fanclub.select')}</option>
        {availableFanclubs.map((fc) => (
          <option key={fc.Fanclub_Code} value={fc.Fanclub_Code}>
            {fc.Fanclub_Full_Name}
          </option>
        ))}
      </select>

      <label className="block text-[16px] font-medium mb-1">{t('fanclub.membershipNumber')}</label>
      <input
        value={membership}
        onChange={(e) => {
          if (e.target.value.length <= 11) setMembership(e.target.value);
        }}
        placeholder="1234567890"
        className="w-full border p-3 rounded-xl mb-1"
        maxLength={11}
      />
      <p className="text-xs text-gray-500 mb-4">{t('common.maxLength12')}</p>

      <label className="block text-[16px] font-medium mb-1">{t('fanclub.nameHanja')}</label>
      <input
        value={nameHanja}
        onChange={(e) => setNameHanja(e.target.value)}
        placeholder="田中 太郎"
        className="w-full border p-3 rounded-xl mb-4"
      />

      <label className="block text-[16px] font-medium mb-1">{t('fanclub.nameKana')}</label>
      <input
        value={nameKana}
        onChange={handleChangeNameKana}
        placeholder="タナカ タロウ"
        className="w-full border p-3 rounded-xl mb-4"
      />

      <label className="block text-[16px] font-medium mb-1">{t('fanclub.birthday')}</label>
      <input
        type="date"
        value={birthday}
        onChange={handleChangeBirthday}
        placeholder="20250101"
        className="w-full border p-3 rounded-xl mb-4"
        maxLength={8}
      />

      <label className="block text-[16px] font-medium mb-1">{t('fanclub.email')}</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="hello@concontown.com"
        className="w-full border p-3 rounded-xl mb-1"
      />
      <p className="text-xs text-gray-500 mb-4">※ {t('common.notAutoFilled')}</p>
      
      <label className="block text-[16px] font-medium mb-1">{t('fanclub.jpNumber')}</label>
      <input
        value={jpNumber}
        onChange={(e) => setJpNumber(e.target.value)}
        placeholder="123456"
        className="w-full border p-3 rounded-xl mb-1"
        maxLength={6}
      />
      <p className="text-xs text-gray-500 mb-4">{t('fanclub.jpNumberDesc')}</p>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#FF8FA9] text-white py-3 rounded-xl font-semibold"
      >
        {t('common.save')}
      </button>
      <AlertModal
        isOpen={alertOpen}
        onClose={handleAlertClose}
        title={alertContent.title}
        description={alertContent.description}
        />

    </div>
  );
}
