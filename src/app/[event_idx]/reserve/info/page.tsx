'use client';

import BackButton from '../../../../../components/common/BackButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import TermsModal from '../../../../../components/common/TermsModal';
import CouponModal from '../../../../../components/common/CouponModal';
import { Coupon } from '@/types/coupon';
import { useAuthStore } from '@/stores/useAuthStore';
import AlertModal from '../../../../../components/common/AlertModal';
import Loading from '../../../../../components/common/Loading';
import CountrySelectModal from '../../../../../components/common/CountrySelectModal';
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

interface Point {
  POINT: number;
  // 필요한 경우 다른 필드도 추가 가능 (예: MEMO, CREATE_DATE 등)
}

export default function ReservationInfoPage() {
  const router = useRouter();
  const { event_idx } = useParams();
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [agreeCancel, setAgreeCancel] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [modalContent, setModalContent] = useState<'cancel' | 'cancel-free' | 'terms'>('cancel');
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null);
  const { member } = useAuthStore();
  const [point, setPoint] = useState(0);
  const [pointUsage, setPointUsage] = useState(0);
  const [pointApplied, setPointApplied] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showCompanionCountryModal, setShowCompanionCountryModal] = useState(false);
  const [showCompanionCodeModal, setShowCompanionCodeModal] = useState(false);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    country: '',
    city: '',
    email: '',
    phoneCode: '',
    phoneNumber: '',
    globalPackageId: '',
    flightArrival: '',
    flightDeparture: '',
  });

  const [companion, setCompanion] = useState({
    name_1st: '',
    name_3rd: '',
    birth: '',
    gender: '',
    nationality: '',
    city: '',
    national_code: '',
    phone: '',
  });
  const [hasCancelFee, setHasCancelFee] = useState<boolean | null>(null);

  const handleCouponChange = (value: number) => {
    setSelectedCoupon(value);
    const couponInfo = coupons.find(c => c.COUPON_IDX === value);
    const discountCoupon = couponInfo ? couponInfo.DISCOUNT_PRICE : 0;

    const basePrice = Number(selectedPlan?.price) || 0;
    const ticketPrice = Number(selectedPlan?.ticketPrice) || 0;
    const pickupPrice = Number(selectedPlan?.pickupPrice) || 0;
  
    const isTwin = selectedPlan?.room === 'Twin';
    const totalTicket = isTwin ? ticketPrice * 2 : ticketPrice;
    const total = basePrice + totalTicket + pickupPrice;

    const dollarDiscount = total - discountCoupon;
    if(dollarDiscount > 0) {
      const rounded = Math.floor(point / 1000) * 1000;
      setPointUsage(rounded);
    } else {
      setPointUsage(0);
    }

  };

  useEffect(() => {
    const fetchCancelPolicy = async () => {
      if (!event_idx) return;
      try {
        const res = await fetch(`/api/event/cancel-policy?event_idx=${event_idx}`);
        const data = await res.json();
        setHasCancelFee(data?.length > 0); // ✅ 정책이 존재하면 true
      } catch (err) {
        console.error('취소수수료 조회 실패:', err);
        setHasCancelFee(false); // 실패 시 무시하고 무수수료로 처리
      }
    };

    fetchCancelPolicy();
  }, [event_idx]);

  const handleCompanionChange = (key: string, value: string) => {
    setCompanion((prev) => ({ ...prev, [key]: value }));
  };
  
  
  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/event/detail?event_idx=${event_idx}`);
      const data = await res.json();
      setEventDetail(data);
    } catch (err) {
      console.error('이벤트 상세 조회 실패:', err);
    }
  };
  useEffect(() => {
    if (event_idx) fetchDetail();
  }, [event_idx]);
  
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const memberIdx = member?.idx || localStorage.getItem('member_idx');
        if (!memberIdx) return;
  
        const res = await fetch(`/api/member/detail?member_idx=${memberIdx}`);
        const data = await res.json();
  
        setFormData((prev) => ({
          ...prev,
          firstName: data?.Name_1st || '',
          lastName: data?.Name_3rd || '',
          birthYear: data?.Birth_year || '',
          birthMonth: data?.Birth_month || '',
          birthDay: data?.Birth_day || '',
          gender: data?.Gender || '',
          country: data?.Nationality || '',
          city: data?.City || '',
          email: data?.Mail || '',
          phoneCode: data?.National_Code || '',
          phoneNumber: data?.Phone || '',
          globalPackageId: '',
          flightArrival: '',
          flightDeparture: '',
        }));
      } catch (err) {
        console.error('❌ Failed to fetch member info:', err);
      }
    };
  
    fetchMemberInfo();
  }, [member]);
  
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/event/detail?event_idx=${event_idx}`);
        const data = await res.json();
        setEventDetail(data);
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

const isValid = () => {
  const { firstName, lastName } = formData;

  if (!firstName || !lastName) {
    setAlertMessage(t('reservation.alert.nameRequired'));
    setAlertVisible(true);
    return false;
  }

  if (!agreeCancel || !agreeTerms) {
    setAlertMessage(t('reservation.alert.agreementRequired'));
    setAlertVisible(true);
    return false;
  }
  if (selectedPlan?.room === 'Twin') {
    const { name_1st, name_3rd, birth, gender, nationality, national_code, phone } = companion;
  
    if (
      !name_1st.trim() ||
      !name_3rd.trim() ||
      !birth.trim() ||
      !gender.trim() ||
      !nationality.trim() ||
      !national_code.trim() ||
      !phone.trim()
    ) {
      setAlertMessage(t('reservation.alert.companionRequired'));
      setAlertVisible(true);
      return false;
    }
  }

  return true;
};

const handlePurchase = async () => {
  if (!isValid()) return;
  setIsLoading(true); // ✅ 시작할 때 로딩 켜기
  try {
    const member_idx = member?.idx;

    // ✅ Step 1. 예약 마스터 저장
    const res = await fetch('/api/reserve/booking/master', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lang: 'EN',
        member_idx,
        event_idx,
        package_idx: selectedPlan?.packageIdx,
        ticket_idx: selectedPlan?.ticketIdx,
        pickup_idx: selectedPlan?.pickupIdx || 0,  
        option_idx: selectedPlan?.optionIdx || 0,
        coupon_idx: selectedCoupon || 0,
        u_ip: '111.111.111.111',
        point
      }),
    });

    const data = await res.json();

    const { Result, Res_Day, Res_Seq } = data;

    if (Result !== '0000') {
      alert(data?.strResult || '예약에 실패했습니다.');
      return;
    }

    const reservation_code = `${Res_Day}-${Res_Seq}`;

    // Toss 결제용 orderId로 사용하기 위해 localStorage 저장
    localStorage.setItem('reservationOrderCode', reservation_code);

    // ✅ Step 2. 예약 디테일 저장
    const detailPayload = {
      method: 'INSERT',
      Res_Day,
      Res_Seq,
      Name_1st: formData.firstName,
      Name_3rd: formData.lastName,
      Birth_day: formData.birthDay,
      Birth_month: formData.birthMonth,
      Birth_year: formData.birthYear,
      Gender: formData.gender,
      Nationality: formData.country,
      City: formData.city,
      Mail: formData.email,
      member_idx,
      Phone: formData.phoneNumber,
      National_Code: formData.phoneCode,
      Emergency_National_Code: formData.phoneCode,
      Emergency_Phone: formData.phoneNumber,
      Depart: formData.flightDeparture,
      Etc: '',
      Flight_info1: formData.flightArrival,
      Flight_info2: '',
    };
    

    await fetch('/api/reserve/booking/detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detailPayload),
    });

    if (selectedPlan?.room === 'Twin' && companion.name_1st) {
      const [year, month, day] = companion.birth?.split('-') ?? ['', '', ''];
    
      await fetch('/api/reserve/booking/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'INSERT',
          Res_Day,
          Res_Seq,
          Name_1st: companion.name_1st,
          Name_3rd: companion.name_3rd,
          Birth_day: day,
          Birth_month: month,
          Birth_year: year,
          Gender: companion.gender,
          Nationality: companion.nationality,
          City: companion.city,
          Mail: '', // optional
          member_idx,
          Phone: companion.phone,
          National_Code: companion.national_code,
          Emergency_National_Code: companion.national_code,
          Emergency_Phone: companion.phone,
          Depart: '',
          Etc: '',
          Flight_info1: '',
          Flight_info2: '',
        }),
      });
    }
    
    // ✅ Step 3. 예약 블록 처리
    await fetch('/api/reserve/booking/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reservation_code,
        payment_method: 'all',
        payment_divide: '',
        payment_email: formData.email || '',
      }),
    });

    // ✅ Step 4. 결제금액 체크
    const couponDiscount = selectedCoupon
    ? Number(coupons.find(c => c.COUPON_IDX === selectedCoupon)?.DISCOUNT_PRICE || 0)
    : 0;
  
  const selectedPrice = selectedPlan
    ? Number(selectedPlan.price || 0) +
      (selectedPlan.room === 'Twin' ? (selectedPlan.ticketPrice || 0) * 2 : selectedPlan.ticketPrice || 0) +
      (selectedPlan.pickupPrice || 0) -
      couponDiscount -
      pointApplied
    : 0;
  
    const couponInfo = coupons.find(c => c.COUPON_IDX === selectedCoupon);

    const reservationData = {
      Res_Day,
      Res_Seq,
      packageName: 'Testing Course C',
      room: selectedPlan?.room || '',
      course: selectedPlan?.course || '',
      grade: selectedPlan?.grade || '',
      subtotal: Number(selectedPlan?.price) + (selectedPlan?.room === 'Twin' ? (selectedPlan?.ticketPrice || 0) * 2 : selectedPlan?.ticketPrice || 0) + (selectedPlan?.pickupPrice || 0),
      discount: couponInfo ? couponInfo.DISCOUNT_PRICE : 0,
      couponName: couponInfo ? couponInfo.COUPON_NAME : '',
      point: pointApplied,
      orderId: reservation_code,
      ticketName: selectedPlan?.ticketName || '',
      ticketPrice: selectedPlan?.ticketPrice || 0,
      pickupName: selectedPlan?.pickupName || '',
      pickupPrice: selectedPlan?.pickupPrice || 0,
      optionName: selectedPlan?.optionName || '',
      roomIcon: selectedPlan?.room === 'Twin' ? '/event/twin_icon.png' : '/event/single_icon.png',
    };
    
    localStorage.setItem('reservationConfirmation', JSON.stringify(reservationData));
    
    // ✅ 콘솔 출력 추가
    console.log('✅ [reservationConfirmation 저장 데이터]', reservationData);
    // localStorage.setItem('reservationConfirmation', JSON.stringify(reservationData));

    if (selectedPrice <= 0) {
      // 0달러면 결제 없이 성공 페이지로 이동
      router.push(`/success?amount=0&orderId=${reservation_code}`);
    } else {
      // 결제 필요하면 결제 페이지로 이동
      router.push(`/${event_idx}/reserve/payment/tosspay?price=${finalPrice}`);
    } 

  } catch (err) {
    console.error('❌ 예약 처리 실패:', err);
    alert('예약 처리 중 오류가 발생했습니다.');
  } finally {
    setIsLoading(false); // ✅ 성공하거나 실패해도 무조건 로딩 끄기
  }
};

// 인풋 변경 시 처리 함수
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      e.target.type === 'number' ? value.replace(/[^0-9]/g, '') : value,
  }));
};


useEffect(() => {
  const memberIdx = member?.idx || localStorage.getItem('member_idx');
  if (!memberIdx) return;

  const fetchCoupons = async () => {
    console.log('✅ fetchCoupons 실행, memberIdx:', memberIdx);

    const res = await fetch(`/api/coupon/event?LangId=EN&member_idx=${memberIdx}`);
    const data = await res.json();
    console.log('✅ 쿠폰 API 응답:', data);

    const filtered = data.filter((c: Coupon) => c.ABLE_YN === 'Y' && c.isUse === 'N');
    console.log('✅ 필터된 쿠폰:', filtered);

    setCoupons(filtered);
  };

  fetchCoupons();
}, [member]);

useEffect(() => {
    const fetchPoint = async () => {
      const res = await fetch('/api/point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_idx: member?.idx, lang: 'EN' }),
      });
    
      const data: Point[] = await res.json();
      const total = data.reduce((acc, item) => acc + item.POINT, 0);
      setPoint(total);

      const rounded = Math.floor(total / 1000) * 1000;
      console.log('rounded', rounded);
      setPointUsage(rounded);
    };
    
    if (member?.idx) fetchPoint();
  }, [member]);

  const applyPoint = () => {
    const usage = pointUsage;
    const basePrice = Number(selectedPlan?.price) || 0;
    const ticketPrice = Number(selectedPlan?.ticketPrice) || 0;
    const pickupPrice = Number(selectedPlan?.pickupPrice) || 0;
  
    const isTwin = selectedPlan?.room === 'Twin';
    const totalTicket = isTwin ? ticketPrice * 2 : ticketPrice;
    const total = basePrice + totalTicket + pickupPrice;
  
    if (isNaN(usage) || usage <= 0) {
      alert('Enter a valid point usage.');
      return;
    }
  
    if (usage > point) {
      alert('You do not have enough points.');
      return;
    }
  
    // ✅ 1000단위로 절삭
    const rounded = Math.floor(usage / 1000) * 1000;
    const dollarDiscount = rounded * 0.001;
  
    if (dollarDiscount > total) {
      alert('Point usage cannot exceed total price.');
      return;
    }
  
    setPointApplied(dollarDiscount);
  
    setAlertMessage(t('reservation.point.discountMessage', { rounded: rounded.toLocaleString(), dollarDiscount: dollarDiscount.toFixed(2) }));
    setAlertVisible(true);
  };
  
  
  const finalPrice = (() => {
    if (!selectedPlan) return 0;
  
    const basePrice = Number(selectedPlan.price) || 0;
    const ticketPrice = Number(selectedPlan.ticketPrice) || 0;
    const pickupPrice = Number(selectedPlan.pickupPrice) || 0;
  
    const isTwin = selectedPlan.room === 'Twin';
    const total =
      basePrice +
      (isTwin ? ticketPrice * 2 : ticketPrice) +
      pickupPrice;
  
    // ✅ 쿠폰 할인 금액 (정액)
    const couponDiscount = selectedCoupon
      ? Number(coupons.find((c) => c.COUPON_IDX === selectedCoupon)?.DISCOUNT_PRICE || 0)
      : 0;
  
    return total - couponDiscount - pointApplied;
  })();
  
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

    {/* 구분선 */}
{ eventDetail.isUseCoupon === 'Y' && 
  <>
    <div style={{ height: '4px', alignSelf: 'stretch', background: '#F0F1F3' }} />

    <div className="my-6 px-5">
      <h2>{t('reservation.section.coupon')}</h2>
      <div
        className="flex items-start justify-between bg-gray-50 border px-4 py-3 rounded-xl"
        onClick={() => setCouponModalOpen(true)}
      >
    {selectedCoupon
      ? coupons.find((c) => c.COUPON_IDX === selectedCoupon)?.COUPON_NAME
      : t('reservation.coupon.select')}

      </div>
      <p className="text-xs text-blue-600 mt-1">
        {t('reservation.coupon.placeholder')}
      </p>
    </div>  
  </>
}

{/* 구분선 */}
{ eventDetail.isUsePoint === 'Y' && 
  <>
    <div style={{ height: '4px', alignSelf: 'stretch', background: '#F0F1F3' }} />

    <div className="my-6 px-5">
      <h2>{t('reservation.section.point')}</h2>

      <div className="flex justify-between items-center text-[16px] font-medium mb-1">
        <span className="text-[#454545] font-semibold">{t('reservation.point.balance')}</span>
        <span className="text-[#FF8FA9] text-[16px] font-bold">
          {point}P
        </span>
      </div>

      <p className="text-[14px] text-[#267FF4] font-semibold mb-3">
        {t('reservation.point.usageNote', {
          point,
          amount: (pointUsage * 0.001).toFixed(2),
        })}<br />
        {t('reservation.point.conversion')}
      </p>

      <div className="flex gap-2">
        <div className="relative w-full">
          <input
            type="number"
            name="pointUsage"
            placeholder={t('reservation.point.placeholder')}
            value={pointUsage}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-4 py-3 pr-15 text-[16px]"
            readOnly
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[16px] text-gray-500">
            {t('reservation.point.unit')}
          </span>
        </div>

        <button
          type="button"
          // className="bg-[#FF8FA9] px-4 text-white rounded-lg font-semibold whitespace-nowrap"
          className={clsx(
            'px-4 text-white rounded-lg font-semibold whitespace-nowrap',
            pointUsage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FF8FA9]'
          )}
          onClick={applyPoint}
          disabled={pointUsage === 0}
        >
          {t('reservation.point.button')}
        </button>
      </div>
      <p className="text-xs text-blue-600 mt-1">
        {t('reservation.point.autoCalcMessage')}
      </p>
    </div>  
  </>
}



  
      {/* 구분선 */}
      <div style={{ height: '4px', alignSelf: 'stretch', background: '#F0F1F3' }} />
  
     

      <form className="space-y-4 px-5 py-6" >
      <h2>{t('reservation.section.personalInfo')}</h2>
      <p className="text-xs text-gray-500 ml-2">{t('reservation.section.personalInfoMessage')}</p>
      <div>
      <input
        name="firstName"
        value={formData.firstName}
        readOnly
        type="text"
        className="w-full border rounded-lg px-4 py-3 text-[16px] bg-gray-100 text-gray-500"
        placeholder="First Name"
      />
      </div>

      <div>
      <input
        name="lastName"
        value={formData.lastName}
        readOnly
        type="text"
        className="w-full border rounded-lg px-4 py-3 text-[16px] bg-gray-100 text-gray-500"
        placeholder="Last Name"
      />
      </div>


    </form>
     

{selectedPlan?.room === 'Twin' && (
  
  <div className="mt-8 px-5">
  <h2>{t('reservation.section.companion')}</h2>
  <p className="text-xs text-gray-500 ml-2">{t('reservation.section.companionMessage')}</p>
    <input
      placeholder="First Name"
      value={companion.name_1st}
      onChange={(e) => handleCompanionChange('name_1st', e.target.value)}
      className="w-full border rounded-xl px-4 py-3 text-[16px] mb-3"
    />
    <input
      placeholder="Last Name"
      value={companion.name_3rd}
      onChange={(e) => handleCompanionChange('name_3rd', e.target.value)}
      className="w-full border rounded-xl px-4 py-3 text-[16px] mb-3"
    />
    <p className="text-xs text-gray-500 ml-2">{t('reservation.section.selectBirthday')}</p>
    <input
      type="date"
      value={companion.birth}
      onChange={(e) => handleCompanionChange('birth', e.target.value)}
      className="w-full border rounded-xl px-4 py-3 text-[16px] mb-3"
    />

    {/* 성별 선택 */}
    <div className="mb-3">
      <div className="text-[16px] font-medium mb-2">Gender</div>
      <div className="flex gap-2">
        {[
          { label: 'Female', value: 'F' },
          { label: 'Male', value: 'M' },
          { label: 'Other', value: 'O' },
        ].map((g) => (
          <button
            key={g.value}
            type="button"
            className={clsx(
              'px-4 py-2 rounded-full border text-[16px] font-medium',
              companion.gender === g.value ? 'bg-[#1A2456] text-white' : 'bg-white text-gray-600 border-gray-300'
            )}
            onClick={() => handleCompanionChange('gender', g.value)}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>

    <button
      type="button"
      className="w-full border rounded-xl px-4 py-3 text-[16px] text-left text-gray-600 mb-3"
      onClick={() => setShowCompanionCountryModal(true)}
    >
      {companion.nationality || 'Country/Region'}
    </button>

    <input
      placeholder="City"
      value={companion.city}
      onChange={(e) => handleCompanionChange('city', e.target.value)}
      className="w-full border rounded-xl px-4 py-3 text-[16px] mb-3"
    />

    <button
      type="button"
      className="w-full border rounded-xl px-4 py-3 text-[16px] text-left text-gray-600 mb-3"
      onClick={() => setShowCompanionCodeModal(true)}
    >
      {companion.national_code || 'Country Code'}
    </button>

    <input
      placeholder="Phone"
      value={companion.phone}
      onChange={(e) =>
        handleCompanionChange('phone', e.target.value.replace(/\D/g, ''))
      }
      className="w-full border rounded-xl px-4 py-3 text-[16px] mb-3"
    />
  </div>
)}

          {/* 구분선 */}
          <div style={{ height: '4px', alignSelf: 'stretch', background: '#F0F1F3' }} />


      {/* Agreement Section */}
      <div className="my-6 px-5">
      <h2>{t('reservation.section.agreement')}</h2>

       {/* Cancellation Policy */}
<div className="flex items-center justify-between rounded-xl py-3 cursor-pointer">
  <div
    className="flex items-center gap-3"
    onClick={() => setAgreeCancel(!agreeCancel)}
  >
    <img
      src={agreeCancel ? "/common/tick-circle-on.svg" : "/common/tick-circle.svg"}
      className={clsx('w-5 h-5 transition', agreeCancel ? 'filter-none' : 'grayscale')}
      alt="tick"
    />
    <span className="text-[16px] font-medium text-gray-800">
      {t('reservation.agreement.cancel')}
    </span>
  </div>
  <button
    type="button"
    onClick={() => {
      setModalContent(hasCancelFee ? 'cancel' : 'cancel-free');
      setShowTerms(true);
    }}
    
  >
    <img src="/common/arrow-down.svg" className="w-[24px] h-[24px]" alt="arrow" />
  </button>
</div>

{/* Terms of Use */}
<div className="flex items-center justify-between rounded-xl py-3 cursor-pointer">
  <div
    className="flex items-center gap-3"
    onClick={() => setAgreeTerms(!agreeTerms)}
  >
    <img
      src={agreeTerms ? "/common/tick-circle-on.svg" : "/common/tick-circle.svg"}
      className={clsx('w-5 h-5 transition', agreeTerms ? 'filter-none' : 'grayscale')}
      alt="tick"
    />
    <span className="text-[16px] font-medium text-gray-800">
      {t('reservation.agreement.terms')}
    </span>
  </div>
  <button
    type="button"
    onClick={() => {
      setModalContent('terms');
      setShowTerms(true);
    }}
  >
    <img src="/common/arrow-down.svg" className="w-[24px] h-[24px]" alt="arrow" />
  </button>
</div>

      </div>



  
      <div className="sticky bottom-0 left-0 right-0 w-full px-5 py-4 bg-white border-t max-w-[430px] m-auto">
        <div className="text-[16px] mb-1">
          {selectedPlan && (
            <>
              <Image
                src={selectedPlan.room === 'Twin' ? '/event/twin_icon.png' : '/event/single_icon.png'}
                alt={selectedPlan.room}
                width={16}
                height={16}
                className="inline-block mr-1"
              />
              × {selectedPlan.course.replace(/<br\s*\/?>/gi, ' ').split('-')[0]} × {selectedPlan.grade}
            </>
          )}
        </div>
        <div className="flex justify-between items-center">
        <span className="text-base font-bold">
        <span className="text-base font-bold">
          Total <span className="text-lg">${formatPrice(finalPrice)}</span>
        </span>

        </span>
        <button
          onClick={handlePurchase} // 기존: handleNext
          className="bg-[#FF8FA9] text-white font-semibold rounded-xl px-6 py-2"

        >
          {t('reservation.purchase')}
        </button>

      </div>
      </div>
  
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        type={modalContent}
      />
      {couponModalOpen && (
        <CouponModal
          coupons={coupons}
          selected={selectedCoupon}
          //onSelect={setSelectedCoupon}
          onSelect={(value) => handleCouponChange(value)}
          onClose={() => setCouponModalOpen(false)}
        />

      )}
 
    <AlertModal
      isOpen={alertVisible}
      onClose={() => setAlertVisible(false)}
      title="Caution"
      description={alertMessage}
      buttonText="OK"
    />
<CountrySelectModal
  isOpen={showCompanionCountryModal}
  onClose={() => setShowCompanionCountryModal(false)}
  type="country"
  onSelect={(value) => handleCompanionChange('nationality', value)}
/>

<CountrySelectModal
  isOpen={showCompanionCodeModal}
  onClose={() => setShowCompanionCodeModal(false)}
  type="code"
  onSelect={(value) => handleCompanionChange('national_code', value)}
/>


    </div>
    </div>
  );
  
}
