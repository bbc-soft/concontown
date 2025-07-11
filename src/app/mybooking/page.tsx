'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import BackButton from '../../../components/common/BackButton';
import { useTranslation } from 'react-i18next';

interface BookingItem {
  Res_day: string;
  Res_Code: string;
  Event_Title: string;
  Res_Status: string;
  Pay_Status: string;
  RegDate: string;
}

export default function MyBookingPage() {
  const { member } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'WAITING' | 'BOOKING' | 'CANCELED'>('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!member?.idx) return;

      const res = await fetch('/api/booking/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_idx: member.idx }),
      });

      const data: BookingItem[] = await res.json();
      setBookings(data);
    };

    fetchBookings();
  }, [member]);

  const filtered = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.Res_Status === filter;
  });

  const getStatusLabel = (res: string, pay: string) => {
    if (res === 'CANCELED') return t('myBooking.bookingDetail.ticket.status.canceled');
  
    const statusMap: Record<string, string> = {
      waiting: 'waiting',
      completed: 'completed',
      completed_part: 'completed_part',
      canceled: 'canceled',
      created: 'created',
      denied: 'denied',
      expired: 'expired',
      failed: 'failed',
      pending: 'pending',
      refunded: 'refunded',
      refund_r: 'refund_r',
      reversed: 'reversed',
      processed: 'processed',
      voided: 'voided',
      canceled_r: 'canceled_r',
    };
  
    const key = statusMap[pay.toLowerCase()] || 'unknown';
    return t(`myBooking.bookingDetail.ticket.status.${key}`);
  };
  const formatUTCDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };
  
  


  return (
    <div className="px-4 py-6 bg-[#fff] text-[#000] min-h-[100vh]">
      <BackButton label={t('more.myBooking')} />

      <h1 className="text-xl font-bold mb-4 mt-3">{t('myBooking.title')}</h1>

      <div className="flex gap-2 mb-4">
        {(['ALL', 'BOOKING', 'WAITING', 'CANCELED'] as const).map((f) => (
          <button
            key={f}
            className={`px-4 py-1 rounded-full border ${
              filter === f ? 'bg-[#12325B] text-white' : 'bg-white text-black'
            }`}
            onClick={() => setFilter(f)}
          >
            {t(`myBooking.tabs.${f.toLowerCase()}`)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.Res_Code}
            className="border rounded-xl p-4 bg-white flex flex-col gap-1 cursor-pointer relative"
            onClick={() => router.push(`/mybooking/${item.Res_Code}`)}
          >
            {/* ✅ '결제 필요' 뱃지 표시 */}
            {item.Pay_Status === 'WAITING' && item.Res_Status !== 'CANCELED' && (
              <span className="absolute top-2 right-3 bg-[#FF4D4F] text-white text-[11px] px-2 py-[2px] rounded-full font-semibold">
                {t('myBooking.badge.paymentRequired', 'Payment Required')}
              </span>
            )}

            <div className="text-[16px] font-bold">
              {t('myBooking.bookingDetail.ticket.orderNumber')} - {item.Res_Code}
            </div>
            <div className="text-xs text-gray-500">
            Registered: {formatUTCDate(item.RegDate)}


            </div>
            <div className="text-[16px] text-gray-700 truncate">{item.Event_Title}</div>
            <div className="text-xs mt-1 text-gray-500 flex flex-col">
              <span>
                {t('myBooking.bookingDetail.ticket.status.reservationStatus')} - {t(`myBooking.bookingDetail.ticket.status.${item.Res_Status.toLowerCase()}`)}
              </span>
              <span>
                {t('myBooking.bookingDetail.ticket.status.paymentStatus')} - {getStatusLabel(item.Res_Status, item.Pay_Status)}
              </span>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
}
