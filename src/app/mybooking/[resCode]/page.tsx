'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import BackButton from '../../../../components/common/BackButton';
import CancelPaymentModal from '../../../../components/common/CancelPaymentModal';
import { useAuthStore } from '@/stores/useAuthStore';


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
  Point_Price: number;
}

interface PaymentInfo {
  totalAmount: number;
  pay_method: string;
  txn_id: string;
  Res_day: string;
  Res_seq: string;
  Type_Seq: number | null;
  payment_status: string;
  card_name: string;
  currency: string;
  payment_date: string;
  remark: string;
}

interface CancelPolicy {
  s_date: string;
  e_date: string;
  penalty: number;
}

export default function BookingDetailPage() {
  const { t } = useTranslation();
  const { resCode } = useParams();
  const [detail, setDetail] = useState<BookingDetail | null>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [cancelPolicy, setCancelPolicy] = useState<CancelPolicy[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { member } = useAuthStore();
  const router = useRouter();

  const renderCurrency = (amount: number, currency: string) => {
    if (currency === 'KRW') return `₩${amount.toLocaleString()}`;
    return `$${amount.toFixed(2)}`;
  };

  const handleCancelSubmit = async (reason: string, refundAmount: number) => {
    setShowCancelModal(false);
    if (!payment?.txn_id) return alert('No payment info');

    try {
      const res = await fetch('/api/toss/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentKey: payment.txn_id,
          cancelReason: reason,
          cancelAmount: refundAmount,
          res_day: payment.Res_day,
          res_seq: payment.Res_seq,
          type_seq: payment.Type_Seq,
          remark: payment.remark,
        }),
      });

      const result = await res.json();
      // console.log('cancel result', result);
      if (!result.success) return alert(`취소 실패: ${result?.error?.message || 'Unknown error'}`);
      alert(t('myBooking.paymentCanceled', 'Payment successfully cancelled.'));
      location.reload();
    } catch (err) {
      console.error(err);
      alert('Error cancelling payment.');
    }
  };


  useEffect(() => {
    const fetchDetail = async () => {
      const [res_day, res_seq] = (resCode as string).split('-');
      const member_idx = member?.idx;
      if (!member_idx) return;

      const [resDetail, resPayment] = await Promise.all([
        fetch('/api/booking/detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ member_idx, res_day, res_seq }),
        }),
        fetch('/api/booking/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ member_idx, res_day, res_seq }),
        }),
      ]);

      const detailData = await resDetail.json();
      const paymentData = await resPayment.json();
      setDetail(detailData[0]);
      setPayment(paymentData?.[0] ?? null);

      const cancelRes = await fetch(`/api/event/cancel-policy?event_idx=${detailData[0]?.Event_idx}`);
      const cancelData = await cancelRes.json();
      setCancelPolicy(cancelData);
    };

    if (resCode && member) fetchDetail();
  }, [resCode, member]);

  if (!detail) return <p className="text-center py-10">{t('loading')}</p>;

  const formatDate = (dateStr: string) => new Date(dateStr).toISOString().slice(0, 10).replace(/-/g, '.');

  return (
    <div className="max-w-[430px] w-full mx-auto px-5 pt-6 pb-20 bg-white text-black min-h-screen">
      <BackButton label={t('myBooking.title')} />
      {/* <h1 className="text-xl font-bold mb-6">{t('confirmation.title')}</h1> */}

      <section className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-[16px] font-semibold text-gray-500 mb-2">{t('confirmation.orderNumber')}</h2>
        <p className="text-[16px] font-medium">{detail.Res_Code}</p>
      </section>

      <section className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-[16px] font-semibold text-gray-500 mb-2">{t('confirmation.reservedTicket')}</h2>
        <p className="text-base font-bold">{detail.Event_Title}</p>
      </section>

      {/* 선택 정보 및 가격 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-[16px] text-gray-800 space-y-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img
              src={detail.room_type === 'Twin' ? '/event/twin_icon.png' : '/event/single_icon.png'}
              alt={detail.room_type}
              width={16}
              height={16}
            />
            <span className="font-semibold">
              {detail.room_type} × {detail.course.replace(/<br\s*\/?>/gi, ' ').split('-')[0]} × {detail.hotel_grade}
            </span>
          </div>
          <div className="text-right text-[#12235B] font-bold">
            ${detail.Total_Amount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 할인 정보 */}
      <section className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-[16px] font-semibold text-gray-500 mb-2">{t('confirmation.discountCoupon')}</h2>
        <div className="text-[16px] space-y-1">
          <p className="flex justify-between">
            <span>{t('confirmation.coupon')}</span>
            <span>- ${detail.Coupon_price.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>{t('confirmation.point')}</span>
            <span>- ${(detail.Point_Price * 0.001).toFixed(2)} (-{detail.Point_Price}p)</span>
          </p>
          <p className="flex justify-between">
            <span>{t('confirmation.paymentPrice')}</span>
            <span>${detail.Total_Amount.toFixed(2)}</span>
          </p>
        </div>
      </section>

      {/* 결제 정보 */}
      {payment && (
        <section className="border-b border-gray-300 pb-4 mb-6">
          <h2 className="text-[16px] font-semibold text-gray-500 mb-2">{t('confirmation.payment')}</h2>
          <div className="text-[16px]">
            <p className="flex justify-between"><span>{t('confirmation.subtotal')}</span> <span className="font-bold">{renderCurrency(payment.totalAmount, payment.currency)}
</span></p>
            <p className="flex justify-between text-gray-600"><span>{t('confirmation.paymentMethod')}</span> <span>{payment.pay_method}</span></p>
            <p className="flex justify-between text-gray-600"><span>{t('confirmation.card')}</span> <span>{payment.card_name}</span></p>
            <p className="flex justify-between text-gray-600"><span>{t('confirmation.status')}</span> <span>{payment.payment_status}</span></p>
            <p className="flex justify-between text-gray-600"><span>{t('confirmation.txnId')}</span> <span>{payment.txn_id}</span></p>
          </div>
        </section>
      )}

      {/* 예약/결제 상태 */}
      <section className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-[16px] font-semibold text-gray-500 mb-2">{t('myBooking.bookingDetail.ticket.status.title')}</h2>
        <div className="text-[16px]">
          <p className="flex justify-between"><span>{t('myBooking.bookingDetail.ticket.status.reservationStatus')}</span> <span>{detail.Res_Status}</span></p>
          <p className="flex justify-between"><span>{t('myBooking.bookingDetail.ticket.status.paymentStatus')}</span> <span>{detail.Pay_Status}</span></p>
        </div>
        {detail.Pay_Status === 'WAITING' && detail.Total_Amount > 0 && (
        <button
          onClick={() => {
            localStorage.setItem('reservationOrderCode', detail.Res_Code);
            router.push(`/${detail.Event_idx}/reserve/payment/tosspay?price=${detail.Total_Amount.toFixed(2)}`);
          }}
          className="mt-4 w-full py-3 rounded-xl font-semibold bg-[#FF8FA9] text-white"
        >
          {t('confirmation.payNow', 'Proceed to Payment')}
        </button>
      )}
      </section>



      {/* 개인 정보 */}
      <section className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-[16px] font-semibold text-gray-500 mb-2">{t('confirmation.personalInfo')}</h2>
        <p className="text-[16px]">{detail.Name_1st} {detail.Name_3rd}</p>
        <p className="text-[16px]">{detail.Mail}</p>
      </section>

      {/* Q&A 버튼 */}
      <section className="text-center pt-6  border-gray-200">
        <button
          onClick={() => router.push('/qna')}
          className="mt-4 w-full border rounded-lg py-2 text-[16px] font-semibold"
        >
          {t('myBooking.bookingDetail.button')}
        </button>
      </section>

      {/* 취소정책 + 취소버튼 */}
      {detail.Pay_Status === 'COMPLETED' && cancelPolicy.length > 0 && (
        <section className="mt-6 mb-6 border border-gray-200 rounded-xl text-[16px]">
          <div className="bg-gray-100 px-4 py-3 font-semibold text-gray-800">
            {t('confirmation.cancelPolicy')}
          </div>
          {cancelPolicy.map((policy, idx) => (
            <div key={idx} className="flex justify-between px-4 py-3">
              <span>{formatDate(policy.s_date)} ~ {formatDate(policy.e_date)}</span>
              <span>{policy.penalty}% {t('confirmation.fee')}</span>
            </div>
          ))}
        </section>
      )}

      {detail.Pay_Status === 'COMPLETED' && detail.Total_Amount > 0 && (
        <button
          onClick={() => setShowCancelModal(true)}
          className="mt-4 w-full py-3 rounded-xl font-semibold bg-[#FDF1F1] text-[#FF4D4F] border border-[#FF4D4F]"
        >
          {t('confirmation.cancelButton')}
        </button>
      )}

{showCancelModal && payment && member && (
  <CancelPaymentModal
    onClose={() => setShowCancelModal(false)}
    onSubmit={handleCancelSubmit}
    res_day={payment.Res_day}
    res_seq={payment.Res_seq}
    member_idx={member.idx}
    currency={payment.currency}
    txn_id={payment.txn_id}           // ✅ 추가
    type_seq={payment.Type_Seq}       // ✅ 추가
    remark={payment.remark}           // ✅ 추가
  />
)}


    </div>
  );
}