'use client';

import BackButton from '../../../../../components/common/BackButton';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import AlertModal from '../../../../../components/common/AlertModal';
import Loading from '../../../../../components/common/Loading';
import { useTranslation } from 'react-i18next';

interface EventDetail {
  Title: string;
  isUseCoupon: string;
  isUsePoint: string;
}

interface SelectedPlan {
  room: string;
  course: string;
  grade: string;
  price: string;
  packageIdx: string;
  packageCode?: string;
  ticketIdx?: string;
  ticketName?: string;
  ticketPrice?: number; // ✅ 추가
  pickupIdx?: string;
  pickupName?: string;
  pickupPrice?: number; // ✅ 추가
  optionIdx?: string;
  optionName?: string;
}

export default function ReservationPreviewPage() {
  const router = useRouter();
  const { event_idx } = useParams();
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [reservationCode, setReservationCode] = useState('');
  const [couponPrice, setCouponPrice] = useState(0);
  const [pointPrice, setPointPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const { t } = useTranslation();  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/event/detail?event_idx=${event_idx}`);
        const data = await res.json();
        setEventDetail(data);

        const reservationData = localStorage.getItem('reservationConfirmation');
        if (!reservationData) return;
    
        const parsed = JSON.parse(reservationData);
        setCouponPrice(parsed.discount);
        setPointPrice(parsed.point);
        setTotalAmount(parsed.subtotal);
        setReservationCode(parsed.orderId);

        const amount = searchParams.get('price');
        setFinalPrice(Number(amount));

      } catch (err) {
        console.error('이벤트 상세 조회 실패:', err);
      }
    };

    if (event_idx) fetchDetail();
  }, [event_idx]);

  useEffect(() => {
    const stored = localStorage.getItem('selectedPlan');
    if (stored) setSelectedPlan(JSON.parse(stored));
  }, []);

  const formatPrice = (price: number) => price.toLocaleString();

const handlePurchase = async () => {
    const selectedPrice = searchParams.get('selectedPrice');
    if (Number(selectedPrice) <= 0) {
       // 0달러면 결제 없이 성공 페이지로 이동
       router.push(`/success?amount=0&orderId=${reservationCode}`);
     } else {
       // 결제 필요하면 결제 페이지로 이동
       router.push(`/${event_idx}/reserve/payment/tosspay?price=${finalPrice}`);
     } 
};

  if (isLoading) return <Loading />;

  if (!eventDetail) return <Loading />;
  return (
    <div className="max-w-[1200px] min-h-screen pb-36 pt-6 mx-auto bg-white text-black">
      <div className='px-5'>
      <BackButton label={t('reservation.title')} />
  
      <div className="my-6 ">
        <h1 className="text-xl font-bold leading-tight">
          {eventDetail ? eventDetail.Title : 'Loading...'}
        </h1>
      </div>
  
      {/* 구분선 */}
      <div style={{ height: '4px', alignSelf: 'stretch', background: '#F0F1F3' }} />
  
      <div className="my-6 px-5">
      <h2>{t('reservation.section.choice')}</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-[16px] text-gray-800 space-y-4">
      {selectedPlan && (
      <>
        {/* 기본 선택 (Single/Twin) */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Image
              src={selectedPlan.room === 'Twin' ? '/event/twin_icon.png' : '/event/single_icon.png'}
              alt={selectedPlan.room}
              width={16}
              height={16}
            />
            <span className="font-semibold">
              {selectedPlan.room} × {selectedPlan.course.replace(/<br\s*\/?>/gi, ' ').split('-')[0]} × {selectedPlan.grade}
            </span>
          </div>
          <div className="text-right text-[#12235B] font-bold">
            ${formatPrice(Number(selectedPlan.price))}
          </div>
        </div>

        {/* 도트 구분선 */}
        <div className="border-t border-dashed border-gray-300" />

        {/* Ticket */}
        {selectedPlan.ticketName && (
          <>
            <div className="font-medium text-gray-700 mb-1">Ticket</div>
            <div className="text-gray-800">{selectedPlan.ticketName}</div>
            {selectedPlan.ticketPrice && (
              <div className="text-right text-gray-600 mt-1">
                + ${formatPrice(selectedPlan.room === 'Twin' ? selectedPlan.ticketPrice * 2 : selectedPlan.ticketPrice)}
              </div>
            )}
            <div className="border-t border-dashed border-gray-300 mt-2" />
          </>
        )}

        {/* Price Option */}
        {selectedPlan.pickupName && (
          <>
            <div className="font-medium text-gray-700 mb-1">Price Option</div>
            <div className="whitespace-pre-line">{selectedPlan.pickupName.replace(/<br\s*\/?>/gi, '\n')}</div>
            {selectedPlan.pickupPrice && selectedPlan.pickupPrice > 0 && (
              <div className="text-right text-gray-600 mt-1">
                + ${formatPrice(selectedPlan.pickupPrice)}
              </div>
            )}
            <div className="border-t border-dashed border-gray-300 mt-2" />
          </>
        )}

        {/* Event Option */}
        {selectedPlan.optionName && (
          <>
            <div className="font-medium text-gray-700 mb-1">Event Option</div>
            <div className="text-gray-800">{selectedPlan.optionName}</div>
            <div className="text-right text-gray-600 mt-1">+ $0</div>
            <div className="border-t border-dashed border-gray-300 mt-2" />
          </>
        )}

        {/* Total */}
        <div className="flex justify-between font-bold text-base mt-2">
          <span>Total</span>
          <span>
            ${formatPrice(
              Number(selectedPlan.price) +
              (selectedPlan.ticketPrice ? (selectedPlan.room === 'Twin' ? selectedPlan.ticketPrice * 2 : selectedPlan.ticketPrice) : 0) +
              (selectedPlan.pickupPrice || 0)
            )}
          </span>

        </div>
      </>
        )}
      </div>
    </div>

      {/* 할인 정보 */}
      <section className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-[16px] font-semibold text-gray-500 mb-2">{t('confirmation.discountHistory')}</h2>
        <div className="text-[16px] space-y-1">
          <p className="flex justify-between">
            <span>{t('confirmation.coupon')}</span>
            <span>- ${couponPrice.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>{t('confirmation.point')}</span>
            <span>- ${(pointPrice).toFixed(2)} (-{pointPrice * 1000}p)</span>
          </p>
          <p className="flex justify-between">
            <span>{t('confirmation.paymentPrice')}</span>
            <span className="font-bold">${finalPrice.toFixed(2)}</span>
          </p>
        </div>
      </section>
    
  </div>
  
      <div className="sticky bottom-0 left-0 right-0 w-full px-5 py-4 bg-white border-t max-w-[430px] m-auto">
        <div className="flex justify-between items-center">
        <button
          onClick={handlePurchase} // 기존: handleNext
          className="w-full bg-[#FF8FA9] text-white font-semibold rounded-xl px-6 py-2"

        >
          ${formatPrice(finalPrice)} {t('reservation.purchase')}
        </button>

        </div>
      </div>
 
    <AlertModal
      isOpen={alertVisible}
      onClose={() => setAlertVisible(false)}
      title="Caution"
      description={alertMessage}
      buttonText="OK"
    />

    </div>
  );
  
}
