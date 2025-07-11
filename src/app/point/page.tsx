'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PointItem {
  CREATE_DATE: string;
  LIMIT_DATE: string;
  P_NAME: string;
  MEMO: string;
  POINT: number;
  POINT_TYPE: string;
  COUPON_NUM?: string;
}

type FilterType = 'ALL' | 'ADDED' | 'USED';

export default function PointPage() {
  const { member } = useAuthStore();
  const [pointList, setPointList] = useState<PointItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_idx: member?.idx, lang: 'EN' }),
      });
      const data = await res.json();
      setPointList(data);
    };

    if (member?.idx) fetchData();
  }, [member]);

  const filteredList = pointList.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'ADDED') return item.POINT > 0;
    if (filter === 'USED') return item.POINT < 0;
    return false;
  });

  const totalPoint = pointList.reduce((sum, item) => sum + item.POINT, 0).toLocaleString();

  return (
    <div className="min-h-screen px-5 pt-12 pb-10 bg-white text-black">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{t('point.title')}</h1>
      </div>

      {/* 총 포인트 영역 */}
      <div className="bg-[#fdf6dc] text-right px-4 py-3 rounded-xl text-[16px] font-semibold text-[#1a1a1a] mb-4">
        {t('point.totalPoint')}{' '}
        <span className="text-xl font-bold text-[#1a1a1a]">{totalPoint}p</span>
      </div>

      {/* 필터 */}
      <div className="flex gap-3 mb-4 text-[16px] font-medium">
        {(['ALL', 'ADDED', 'USED'] as FilterType[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full border ${
              filter === key
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-white text-[#1a1a1a] border-[#ccc]'
            }`}
          >
            {t(`point.tabs.${key === 'ALL' ? 0 : key === 'ADDED' ? 1 : 2}`)}
          </button>
        ))}
      </div>

      {/* 포인트 리스트 */}
      <div className="space-y-3">
        {filteredList.map((item, idx) => {
          const createdAt = item.CREATE_DATE ? new Date(item.CREATE_DATE) : null;
          const formattedDate = createdAt && !isNaN(createdAt.getTime())
            ? createdAt.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })
            : 'Unknown';

          const pointName =
            item.P_NAME && item.P_NAME !== 'NULL'
              ? item.P_NAME
              : item.MEMO || t('pointHistory', { defaultValue: 'Point History' });

          return (
            <div
              key={idx}
              className="border rounded-xl p-4 text-[16px] text-[#1a1a1a] bg-white shadow-sm"
            >
              <div className="text-[12px] text-gray-500 mb-1">{formattedDate}</div>
              <div className="flex justify-between items-center font-semibold mb-1">
                <div>{pointName}</div>
                <div
                  className={`font-bold ${
                    item.POINT > 0 ? 'text-[#ff8fa9]' : 'text-[#1a1a1a]'
                  }`}
                >
                  {item.POINT > 0
                    ? `+${item.POINT.toLocaleString()}P`
                    : `${item.POINT.toLocaleString()}P`}
                </div>
              </div>
              {item.LIMIT_DATE && item.LIMIT_DATE !== 'NULL' && (
                <div className="text-[12px] text-gray-500">
                  {t('point.validUntil')} {new Date(item.LIMIT_DATE).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
