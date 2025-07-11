'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '../../../components/common/BackButton';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';

interface Fanclub {
  Fanclub_Seq: number;
  Member_Id: string;
  Fanclun_Code: string;
  Fanclub_Name: string;
  Fanclub_Full_Name : string;
  Member_Fanclub_ID: string;
  Remark1: string;
  Remark2: string;
  Remark3: string;
  Remark4: string;  
  WEVERSE_EMAIL: string;
  Weverse_Email_Date: string;
}

export default function MyFanClubPage() {
  const router = useRouter();
  const { member } = useAuthStore();
  const { t } = useTranslation();

  const [fanclubs, setFanclubs] = useState<Fanclub[]>([]);

  const fetchFanclubs = async () => {
    if (!member?.idx) return;
    const res = await fetch(`/api/fanclub/joined?member_idx=${member.idx}`);
    const data = await res.json();
    setFanclubs(data);
  };

  useEffect(() => {
    fetchFanclubs();
  }, [member]);

  const handleDelete = async (seq: number) => {
    if (!member?.idx) return;
    const res = await fetch('/api/fanclub/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_idx: member.idx, fanclub_seq: seq }),
    });
    const result = await res.json();
    if (result.success) {
      setFanclubs((prev) => prev.filter((fc) => fc.Fanclub_Seq !== seq));
    } else {
      alert(result.message || '삭제 실패');
    }
  };

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6 bg-white text-black min-h-[100vh]">
      <BackButton label={t('myFanclub', 'My Fanclub')} />
      
      <ul className="text-[16px] text-gray-800 mb-6 list-disc pl-5 space-y-1 px-4">
        <li>{t('notice1', 'You can check your fan club membership information by logging into the Weverse service.')}</li>
        <li>{t('notice2', 'Currently, only Japanese fan club membership information can be entered.')}</li>
      </ul>

      <h1 className="text-xl font-bold mb-4">{t('joinedListTitle', 'Joined Fanclubs')}</h1>

      {fanclubs.length > 0 ? (
        <ul className="space-y-2">
          {fanclubs.map((fc) => (
            <li
              key={fc.Fanclub_Seq}
              className="p-4 border border-gray-200 rounded-lg bg-white text-[16px] font-semibold flex justify-between items-center"
            >
              <div>
                <div>{fc.Fanclub_Name}</div>
                <div>{fc.Fanclub_Full_Name}</div>
                <div className="text-xs text-gray-500">
                  W. MEMBERSHIP NO. : {fc.Member_Fanclub_ID}
                </div>
                <div className="text-xs text-gray-500">
                  {t('fanclub.nameHanja', 'Input1')}: {fc.Remark1}
                </div>
                <div className="text-xs text-gray-500">
                  {t('fanclub.nameKana', 'Input2')}: {fc.Remark2}
                </div>
                <div className="text-xs text-gray-500">
                  {t('fanclub.email', 'Input2')}: {fc.WEVERSE_EMAIL}
                </div>
                <div className="text-xs text-gray-500">
                  JP. MEMBERSHIP NO. : {fc.Remark3}
                </div>
                <div className="text-xs text-gray-500">
                  {t('fanclub.birthday', 'Input2')} : {fc.Remark4}
                </div>
              </div>
              <button
                onClick={() => handleDelete(fc.Fanclub_Seq)}
                className="text-red-500 text-xs underline ml-4"
              >
                {t('delete', 'Delete')}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">{t('noFanclub', 'No fanclubs registered.')}</p>
      )}

      <button
        className="mt-6 w-full bg-[#FF8FA9] text-white py-3 rounded-lg font-semibold"
        onClick={() => router.push('/myfanclub/add')}
      >
        {t('add', 'Add Fanclub')}
      </button>
    </div>
  );
}
