'use client';

import { useLanguageStore } from '@/stores/useLanguageStore';
import React, { useEffect, useState } from 'react';

interface SiteInfo {
  Service_Time: string;
  About_Us: string;
  Privacy_Policy: string;
  Terms_of_Use: string;
}

export default function Footer() {
  const [info, setInfo] = useState<SiteInfo | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const langId = useLanguageStore.getState().langId.toUpperCase();
  
  useEffect(() => {
    const fetchInfo = async () => {
      const res = await fetch(`/api/siteInfo?LangId=${langId}`);
      const data = await res.json();
      setInfo(data);
    };
    fetchInfo();
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="bg-white text-xs text-gray-600 pt-5 text-[12px]">
      {/* 좌우 여백 없이 */}
      <div className="w-full max-w-[430px] mx-auto space-y-4">

        {/* 상단 탭 */}
        <div className="flex border-t border-b divide-x divide-gray-300 text-center">
          {[
            { key: 'About_Us', label: 'About Us' },
            { key: 'Privacy_Policy', label: 'Privacy Policy' },
            { key: 'Terms_of_Use', label: 'Terms of Use' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleSection(key)}
              className={`flex-1 py-3 font-semibold text-gray-800 ${
                openSection === key ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 선택된 섹션 내용 */}
        {openSection && info?.[openSection as keyof SiteInfo] && (
          <div
            className="text-gray-600 leading-relaxed p-4 border-b border-gray-200 rounded"
            dangerouslySetInnerHTML={{ __html: info[openSection as keyof SiteInfo] }}
          />
        )}
         {/* 서비스 운영 시간 출력 (있을 경우) */}
         {info?.Service_Time && (
           <div
             className="text-[11px] text-gray-500 mt-2 px-2"
             dangerouslySetInnerHTML={{ __html: info.Service_Time }}
           />
         )}
      </div>
    </footer>
  );
}
