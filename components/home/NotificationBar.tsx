'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import he from 'he';
import { useLanguageStore } from '@/stores/useLanguageStore'; // ✅ 추가

interface Notice {
  IDX: number;
  TITLE: string;
}

export default function NotificationBar() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [current, setCurrent] = useState(0);

  const langId = useLanguageStore.getState().langId.toUpperCase(); // ✅ 언어값 추출

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(`/api/notice/list?lang=${langId}&type=NOTICE&member=1&main=Y`);
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        console.error('Failed to fetch notices:', err);
      }
    };
    fetchNotices();
  }, [langId]); // ✅ 언어 변경 시 다시 불러오기

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % (notices.length || 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [notices]);

  if (notices.length === 0) return null;

  return (
    <div className="w-full h-[50px] bg-gradient-to-r from-[#7B61FF] to-[#DF4FFF] shadow-[0px_16px_16px_0px_#F0F1F3] overflow-hidden relative">
      <div
        key={notices[current]?.IDX}
        onClick={() => router.push(`/notice/${notices[current].IDX}`)}
        className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 text-white font-bold text-[16px] font-['SMTOWN(OTF)'] cursor-pointer transition-all duration-700 animate-slideUp"
      >
        <div className="px-5 truncate">
          {he.decode(notices[current].TITLE)}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          30% {
            opacity: 1;
            transform: translateY(0);
          }
          70% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100%);
          }
        }
        .animate-slideUp {
          animation: slideUp 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
