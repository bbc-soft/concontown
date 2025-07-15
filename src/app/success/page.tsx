'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/useAuthStore';

interface ReservationData {
  packageName: string;
  room: string;
  course: string;
  grade: string;
  subtotal: number;
  discount: number;
  point: number;
  orderId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  flightArrival: string;
  flightDeparture: string;
  cardLastDigits: string;
  ticketName?: string;
  ticketPrice?: number;
  pickupName?: string;
  pickupPrice?: number;
  optionName?: string;
  roomIcon?: string;
  couponName?: string;
}

interface BookingDetail {
  Res_Code: string;
  Event_Title: string;
  Res_Status: string;
  Pay_Status: string;
  Package_price: number;
  Coupon_price: number;
  point: number;
  Name_1st: string;
  Name_3rd: string;
  Birth_day: string;
  Birth_month: string;
  Birth_year: string;
  Gender: string;
  Nationality: string;
  City: string;
  Mail: string;
  Phone: string;
  Flight_Arrival: string;
  Flight_Departure: string;
  payment_method: string;
  Ticket_Title: string;
  room_type: string;
  course: string;
  hotel_grade: string;
  Pickup_Remark: string;
  Pickup_price: number;
  Event_idx: number;
  Total_Amount: number;
  Ticket_Price: number;
  EVENT_FANCLUB_YN: string;
}

export default function ReservationSuccessPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'success' | 'fail'>('pending');
  const amount = searchParams.get('amount');
  const [data, setData] = useState<ReservationData | null>(null);
  const { member } = useAuthStore();
  const [detail, setDetail] = useState<BookingDetail | null>(null);
  const [reservationExchangeRate, setReservationExchangeRate] = useState('1');
  

  const formatPrice = (value: number | undefined | null) => {
    const num = Number(value);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  useEffect(() => {
    let hasConfirmed = false;
  
    const confirmPayment = async () => {
      if (hasConfirmed) return;
      hasConfirmed = true;
  
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      const rate = localStorage.getItem('reservationExchangeRate');
      setReservationExchangeRate(rate ? rate : '1');
  
      const reservationData = localStorage.getItem('reservationConfirmation');
      if (!reservationData) return;
  
      const parsed = JSON.parse(reservationData);
      const exchangeRate = parsed.exchangeRate; // ✅ 여기서 안전하게 추출
  
      if (!paymentKey && amount !== '0') {
        setStatus('fail');
        return;
      }
  
      try {
        if (Number(amount) > 0) {
          const res = await fetch('/api/toss/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount: Number(amount),
              exchangeRate, // ✅ 함께 전송
            }),
          });
  
          const result = await res.json();
          if (res.ok && result.success) {
            setStatus('success');
          } else {
            setStatus('fail');
          }
        } else {
          setStatus('success');
        }
      } catch (err) {
        console.error('Toss confirm error:', err);
        setStatus('fail');
      }
  
      // Reservation 정보 화면에 표시할 준비
      const flat = {
        ...parsed,
        point: Number(parsed.point || 0),
        discount: Number(parsed.discount || 0),
        subtotal: Number(parsed.subtotal || 0),
        orderId: parsed.orderId,
        roomIcon: parsed.room === 'Twin' ? '/event/twin_icon.png' : '/event/single_icon.png',
      };
      setData(flat);
    };
  
    confirmPayment();
  }, []);

  useEffect(() => {
    const fetchBookingnfo = async () => {
      try {
        const member_idx = member?.idx || localStorage.getItem('member_idx');
        if (!member_idx) return;

        const reservationData = localStorage.getItem('reservationConfirmation');
        if (!reservationData) return;
    
        const parsed = JSON.parse(reservationData);
        const res_day = parsed.Res_Day;
        const res_seq = parsed.Res_Seq;

        const res = await fetch('/api/booking/detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            member_idx,
            res_day,
            res_seq,
          }),
        });

        const result = await res.json();
        setDetail(result[0]);
      } catch (err) {
        console.error('❌ Failed to fetch member info:', err);
      }
    };
  
    fetchBookingnfo();
  }, [member]);
  
  

  if (status === 'pending' || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <div className="w-8 h-8 border-4 border-[#FF8FA9] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[16px] mt-4 font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (status === 'fail') {
    return (
      <div className="text-center px-6 py-20">
        <h2 className="text-xl font-bold text-red-500 mb-4">Payment Failed</h2>
        <p className="text-gray-600 mb-6">We could not verify your payment. Please contact support.</p>
        <button
          onClick={() => router.replace('/')}
          className="bg-gray-300 text-black font-semibold py-3 px-6 rounded-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[430px] w-full mx-auto bg-white text-black px-5 pb-20 pt-6">
      <h1 className="text-lg font-bold mb-6">
        {amount === '0' ? 'The reservation has been completed.' : 'The payment has been completed.'}
      </h1>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-[16px] text-gray-800 space-y-4 mb-6">
        <div>
          <div className="font-medium text-gray-700 mb-1">Package</div>
          <div className="flex items-center gap-2 mb-1">
            <img src={data.roomIcon} alt={data.room} width={16} height={16} />
            <span className="font-semibold">
              {data.course ? data.course.replace(/<br\s*\/?\>/gi, ' ').split('-')[0] : ''}
            </span>
          </div>
          <div className="text-right text-[#12235B] font-bold">{formatPrice(data.subtotal)}</div>
        </div>

        <div className="border-t border-dashed border-gray-300" />

        {data.ticketName && (
          <>
            <div className="font-medium text-gray-700 mb-1">Ticket</div>
            <div className="flex justify-between items-center">
              <span>{data.ticketName}</span>
            </div>
            <span className="text-right text-gray-600 mt-1">
              + {formatPrice(data.room === 'Twin' ? data.ticketPrice! * 2 : data.ticketPrice)}
            </span>
            <div className="border-t border-dashed border-gray-300 mt-2" />
          </>
        )}

        {data.pickupName && (
          <>
            <div className="font-medium text-gray-700 mb-1">Price Option</div>
            <div className="flex justify-between items-start">
              <div className="whitespace-pre-line">{data.pickupName.replace(/<br\s*\/?\>/gi, '\n')}</div>
              <div className="text-right text-gray-600">
                + {formatPrice(data.pickupPrice)}
              </div>
            </div>
            <div className="border-t border-dashed border-gray-300 mt-2" />
          </>
        )}

        {data.optionName && (
          <>
            <div className="font-medium text-gray-700 mb-1">Event Option</div>
            <div className="flex justify-between">
              <span>{data.optionName}</span>
              <span className="text-right text-gray-600">+ $0.00</span>
            </div>
            <div className="border-t border-dashed border-gray-300 mt-2" />
          </>
        )}

        <div className="flex justify-between font-bold text-base mt-2">
          <span>Total</span>
          <span>
            {formatPrice(
              Number(data.subtotal) +
              (data.ticketPrice ? (data.room === 'Twin' ? data.ticketPrice * 2 : data.ticketPrice) : 0) +
              (data.pickupPrice || 0)
            )}
          </span>
        </div>
      </div>

      <section className="border-b border-[#F0F1F3] pb-4 mb-4">
        <h2 className="font-bold text-[16px] mb-1">Reserved ticket</h2>
        <p className="text-[16px]">{data.packageName}</p>
      </section>

      {amount !== '0' && (
        <section className="border-b border-[#F0F1F3] pb-4 mb-4">
          <div className="text-[16px] text-gray-600 space-y-1">
            <h3 className="text-[16px] font-semibold text-black mb-1">Discount</h3>
            {/*<div className="flex justify-between">
              <span>Price</span>
              <span>{formatPrice(data.subtotal + data.discount + data.point)}</span>
            </div>*/}
            <div className="flex justify-between">
              <span>Coupon</span>
              <span>
                - {formatPrice(data.discount)}{' '}
                {data.couponName && <span className="text-gray-500 ml-2">({data.couponName})</span>}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Point</span>
              <span>- {formatPrice(data.point)}</span>
            </div>
          </div>

          <h2 className="font-bold text-[16px] mb-1">Payment</h2>
          <p className="text-[16px] mb-1"> {data.room} × {data.course} × {data.grade}</p>

          <div className="flex justify-between mb-2 mt-2">
            <span className="text-[16px] font-medium">Subtotal</span>
            {
              reservationExchangeRate === '1' ?
              <span className="text-[#12235B] font-bold">${Number(amount).toLocaleString()}</span>
              :
              <span className="text-[#12235B] font-bold">{Number(amount).toLocaleString()}원
                  <span className="text-sm text-gray-500 ml-1">
                    (${(Number(amount) / Number(reservationExchangeRate)).toFixed(2)})
                  </span>
              </span>
            }
          </div>

        </section>
      )}

      <section className="border-b border-[#F0F1F3] pb-4 mb-4">
        <h2 className="font-bold text-[16px] mb-1">Order Number</h2>
        <p className="text-[16px]">{data.orderId}</p>
      </section>

      {detail?.EVENT_FANCLUB_YN === "Y" && (
        <>
          <h2 className="text-center text-[16px]">{t('complete.requestFanClubVerify')}</h2>
          <h2 className="text-center text-[16px] mb-2">{t('complete.enterFanClubInfo')}</h2>
          <button
          className="bg-[#FF8FA9] w-full py-3 rounded-xl font-semibold text-white mb-5"
          onClick={() => router.replace('/myfanclub/add')}
        >
          {t('add')}
        </button>

        <h2 className="text-center text-[16px] mb-2">{t('complete.alreadyRegistered')}</h2>
        <button
          className="bg-[#A8A8A8] w-full py-3 rounded-xl font-semibold text-white"
          onClick={() => router.replace('/')}
        >
          {t('complete.goHome')}
        </button>
        </>
      )}

      {detail?.EVENT_FANCLUB_YN !== "Y" && (
        <button
          className="bg-[#FF8FA9] w-full py-3 rounded-xl font-semibold text-white"
          onClick={() => router.replace('/')}
        >
          {t('complete.goHome')}
        </button>
      )}
    </div>
  );
}