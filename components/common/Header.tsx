'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const { member } = useAuthStore();
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!member?.idx) return;
      try {
        const res = await fetch(
          `/api/notice/unread-count?type=NOTICE&member=${member.idx}&popup=`
        );
        const data = await res.json();
        setHasNotification(data.UnRead_Count > 0);
      } catch (err) {
        console.error('🔴 알림 뱃지 불러오기 실패', err);
      }
    };

    fetchUnread();
  }, [member?.idx]);

  return (
    <div className="flex justify-between items-center py-[20px]">
      <h1 className="text-lg font-bold">
        {title ? (
          <span className="font-['SMTOWN(OTF)']">{title}</span>
        ) : (
          <img src="/common/header/logo.png" alt="CONCONTOWN Logo" className="h-6"/>
        )}
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative w-6 h-6">
          <button onClick={() => router.push('/notice')}>
            <Image
              src="/common/header/notification.svg"
              alt="notification"
              width={24}
              height={24}
            />
          </button>
          {hasNotification && (
            <div className="w-2 h-2 bg-[#ff8fa9] rounded-full absolute top-0 right-0" />
          )}
        </div>
      </div>
    </div>
  );
}
