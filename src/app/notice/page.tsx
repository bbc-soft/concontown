'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useAuthStore } from '@/stores/useAuthStore';

interface Notice {
  READ_DATE?: string | null;
  IDX: number;
  TITLE: string;
  PUB_DATE: string;
  MAIN_YN?: string;
  isPersonal?: boolean;
}

const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString || isoString === 'NULL') return '';
  const [date, timeWithMs] = isoString.split('T');
  const [time] = timeWithMs.split('.');
  return `${date.replace(/-/g, '.')}, ${time}`;
};

export default function NoticePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { langId } = useLanguageStore();
  const { member } = useAuthStore();

  const [tab, setTab] = useState<'notice' | 'ad'>('notice');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadNotice, setUnreadNotice] = useState(0);
  const [unreadAd, setUnreadAd] = useState(0);

  const fetchUnreadCount = async (type: 'NOTICE' | 'AD') => {
    if (!member?.idx) return;
    try {
      const res = await fetch(`/api/notice/unread-count?type=${type}&member=${member.idx}&popup=`);
      const data = await res.json();
      return data.UnRead_Count || 0;
    } catch (err) {
      console.error(`❌ ${type} 미열람 수 실패:`, err);
      return 0;
    }
  };

  const fetchAllUnreadCounts = async () => {
    const [noticeCount, adCount] = await Promise.all([
      fetchUnreadCount('NOTICE'),
      fetchUnreadCount('AD'),
    ]);
    setUnreadNotice(noticeCount);
    setUnreadAd(adCount);
  };

  useEffect(() => {
    fetchAllUnreadCounts();
  }, [member?.idx]);

  const fetchNoticeList = async (type: 'NOTICE' | 'AD') => {
    if (!member?.idx) return;
    setLoading(true);
    try {
      const personalRes = await fetch(
        `/api/notice/personal/list?lang=${langId.toUpperCase()}&type=${type}&member=${member.idx}`
      );
      const generalRes = await fetch(
        `/api/notice/list?lang=${langId.toUpperCase()}&type=${type}&member=${member.idx}&main=Y`
      );

      const personalData = (await personalRes.json()).map((item: Notice) => ({
        ...item,
        isPersonal: true,
      }));
      const generalData = (await generalRes.json()).map((item: Notice) => ({
        ...item,
        isPersonal: false,
      }));

      const merged = [...personalData, ...generalData];
      const sorted = merged.sort((a, b) => new Date(b.PUB_DATE).getTime() - new Date(a.PUB_DATE).getTime());
      setNotices(sorted);
    } catch (err) {
      console.error('❌ 공지 전체 리스트 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!member?.idx) return;
    fetchNoticeList(tab === 'notice' ? 'NOTICE' : 'AD');
  }, [tab, langId, member?.idx]);

  return (
    <div className="min-h-screen px-5 pt-12 pb-10 bg-white text-black">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{t('notice.title')}</h1>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6">
        <button
          className={clsx(
            'relative flex-1 py-2 rounded-full text-[16px] font-medium border',
            tab === 'notice' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200'
          )}
          onClick={() => setTab('notice')}
        >
          {t('notice.notice') || '공지'}
          {unreadNotice > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#ff8fa9] text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadNotice}
            </span>
          )}
        </button>
        <button
          className={clsx(
            'relative flex-1 py-2 rounded-full text-[16px] font-medium border',
            tab === 'ad' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200'
          )}
          onClick={() => setTab('ad')}
        >
          {t('notice.ad') || '광고'}
          {unreadAd > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadAd}
            </span>
          )}
        </button>
      </div>

      {/* 리스트 */}
      {loading ? (
        <p className="text-[16px] text-gray-400 text-center">{t('notice.loading') || 'Loading...'}</p>
      ) : notices.length === 0 ? (
        <p className="text-[16px] text-gray-400 text-center">{t('notice.emptyList') || 'No notices available.'}</p>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <button
              key={notice.IDX}
              onClick={() => router.push(`/notice/${notice.IDX}?type=${tab}&isPersonal=${notice.isPersonal}`)}
              className={clsx(
                'w-full flex justify-between items-center p-4 rounded-xl border text-left',
                !notice.READ_DATE || notice.READ_DATE === 'NULL' ? 'bg-[#FFF3DC]' : 'bg-white'
              )}
            >
              <div className="text-[16px] w-full">
                {/* 뱃지 (개인공지만) */}
                {notice.isPersonal && (
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={clsx(
                        'text-[12px] font-semibold px-2 py-0.5 rounded-full',
                        !notice.READ_DATE || notice.READ_DATE === 'NULL'
                          ? 'bg-[#ff8fa9] text-white'
                          : 'bg-[#f0f1f3] text-[#666]'
                      )}
                    >
                      Personal Notice TO. {member?.Name_1st}
                    </span>
                  </div>
                )}

                {/* 제목 */}
                <div className="font-semibold text-left line-clamp-2 max-w-full mb-1 text-[14px]">
                  <span dangerouslySetInnerHTML={{ __html: notice.TITLE }} />
                </div>

                {/* 시간 표시 */}
                <p className="text-[12px] text-gray-400">
                  {t('notice.postedAt')}: {formatDateTime(notice.PUB_DATE)}
                </p>
                {notice.READ_DATE && notice.READ_DATE !== 'NULL' && (
                  <p className="text-[12px] text-gray-400">
                    {t('notice.readAt')}: {formatDateTime(notice.READ_DATE)}
                  </p>
                )}
              </div>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
