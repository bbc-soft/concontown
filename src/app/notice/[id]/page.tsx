'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import he from 'he';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useAuthStore } from '@/stores/useAuthStore';

interface NoticeDetail {
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export default function NoticeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const langId = useLanguageStore((state) => state.langId.toUpperCase());
  const member = useAuthStore((state) => state.member);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      const id = params?.id;
      const type = searchParams.get('type') || 'notice'; // tab 구분용

      const isPersonal = searchParams.get('isPersonal') === 'true'; // ✅ 추가된 personal 여부

      if (!id || !member?.idx) return;

      try {
        const apiUrl = isPersonal
          ? `/api/notice/personal/detail?idx=${id}&lang=${langId}&type=${type.toUpperCase()}&member=${member.idx}&ip=0.0.0.0`
          : `/api/notice/detail?idx=${id}&lang=${langId}&type=${type.toUpperCase()}&member=${member.idx}&ip=0.0.0.0`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        const decodedTitle = he.decode(data.TITLE || '');
        const decodedContent = he.decode(data.CONTENTS || '');

        setNotice({
          title: decodedTitle,
          content: decodedContent,
          date: data.INS_DATE?.slice(0, 10).replace(/-/g, '.'),
          imageUrl: data.FILENAME2 !== 'NULL' ? data.FILENAME2 : undefined,
        });
      } catch (error) {
        console.error('❌ Failed to load notice detail', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [params, searchParams, langId, member?.idx]);

  return (
    <div className="min-h-screen bg-white text-black px-5 pt-12 pb-10">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 text-[16px]">Loading...</p>
      ) : (
        <>
          <p className="text-[16px] text-gray-400 mb-1">{notice?.date}</p>
          <h1 className="text-lg font-bold mb-4">{notice?.title}</h1>

          {notice?.imageUrl && (
            <div className="mb-4">
              <img
                src={notice.imageUrl}
                alt="attached"
                className="w-full rounded-xl aspect-square object-cover bg-gray-200"
              />
            </div>
          )}

          <div
            className="text-[16px] leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: notice?.content || '' }}
          />
        </>
      )}
    </div>
  );
}
