'use client';

import BackButton from '../../../../../components/common/BackButton';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import AlertModal from '../../../../../components/common/AlertModal';
import { useRef } from 'react';
import Loading from '../../../../../components/common/Loading';
import { useAuthStore } from '@/stores/useAuthStore'; 
import { useTranslation } from 'react-i18next';




interface EventOption {
  Option_IDX: number;
  Option_Name: string;
  isDisable: string;
}

interface PickupOption {
  Pickup_idx: number;
  Pickup_Name: string;
  Price: number;
}



interface EventDetail {
  Title: string;
}

interface PackagePlan {
  Course: string;
  Room_Type: string;
  Hotel_Grade: string;
  Price: number;
  isPossiblePurchase: string;
  Condition: string;
  Package_Idx?: number;
  Ticket_Idx?: number;
  Package_Code?: string; // ✅ 여기에 이 줄 추가
}



interface TicketPlan {
  Ticket_Idx: number;
  course: string;
  remark: string;
  package: string;
  ticket_type: string;
  price: number;
  Condition: string;
  block: number;
}





export default function SelectPage() {
  const router = useRouter();
  const { event_idx } = useParams();
  const { member } = useAuthStore(); // useEffect 바깥에서 선언
  const eventId = Array.isArray(event_idx) ? event_idx[0] : event_idx;
  const { t } = useTranslation();



  const [selected, setSelected] = useState({
    room: '',
    course: '',
    grade: '',
    price: '0',
    packageIdx: '',
    packageCode: '', // ✅ 이 줄 추가!
    ticketIdx: '',
    pickupIdx: '',
    optionIdx: '',
  });
  

  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [plans, setPlans] = useState<PackagePlan[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // ✅ 2. alertVisible state 추가
  const [alertMessage, setAlertMessage] = useState('');

  // const [filterType, setFilterType] = useState('');
  // const [filterCourse, setFilterCourse] = useState('');
  // const [filterGrade, setFilterGrade] = useState('');
  // const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [pickupOptions, setPickupOptions] = useState<PickupOption[]>([]);
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);

  const [ticketPlans, setTicketPlans] = useState<TicketPlan[]>([]);
  const ticketSectionRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    const fetchOptions = async () => {
      const [pickupRes, eventOptionRes] = await Promise.all([
        fetch(`/api/event/pickup?event_idx=${eventId}`),
        fetch(`/api/event/options?event_idx=${eventId}`),
      ]);
      const [pickupData, eventData] = await Promise.all([
        pickupRes.json() as Promise<PickupOption[]>,
        eventOptionRes.json() as Promise<EventOption[]>,
      ]);
  
      console.log('✅ pickupData', pickupData);
      console.log('✅ eventData', eventData);
  
      setPickupOptions(pickupData);
      setEventOptions(eventData.filter((o) => o.isDisable !== 'Y'));
  
    };
    if (eventId) fetchOptions();
  }, [eventId]); // ✅ eventId 기준으로 수정
  
  
  
  useEffect(() => {
    const fetchTicketPlans = async () => {
      const res = await fetch(`/api/event/ticketplan?event_idx=${event_idx}&package_code=${selected.packageCode || 'C'}`);
      const data: TicketPlan[] = await res.json(); // ✅ 타입 명시
      setTicketPlans(data.filter((t) => t.Condition === 'Available'));
      console.log("ticketplan");
    };
  
    if (selected.packageIdx && selected.packageCode) {
      fetchTicketPlans();
    }
  }, [selected.packageIdx, selected.packageCode]);
  
  


  useEffect(() => {
    const fetchOptions = async () => {
      const [pickupRes, eventOptionRes] = await Promise.all([
        fetch(`/api/event/pickup?event_idx=${event_idx}`),
        fetch(`/api/event/options?event_idx=${event_idx}`),
      ]);
      const [pickupData, eventData]: [PickupOption[], EventOption[]] = await Promise.all([
        pickupRes.json(),
        eventOptionRes.json(),
      ]);
  
      setPickupOptions(pickupData);
      setEventOptions(eventData.filter((o) => o.isDisable !== 'Y'));

    };
    fetchOptions();
  }, [event_idx]);
  


  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const res = await fetch(`/api/event/detail?event_idx=${event_idx}`);
        const data = await res.json();
        setEventDetail(data);
      } catch (error) {
        console.error('콘서트 상세 정보 불러오기 실패:', error);
      }
    };
    fetchEventDetail();
  }, [event_idx]);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!member?.idx) return;
      try {
        const res = await fetch(`/api/event/plan?event_idx=${event_idx}&member_idx=${member.idx}`);
        const data = await res.json();
        console.log('📦 패키지 플랜 응답:', data); // 디버깅용 로그
        setPlans(data);
      } catch (err) {
        console.error('❌ 패키지 플랜 조회 실패:', err);
      }
    };
    if (event_idx && member?.idx) {
      fetchPlans();
    }
  }, [event_idx, member]);

  useEffect(() => {
    localStorage.setItem('selectedPlan', JSON.stringify(selected));
  }, [selected]); // ✅ 선택값이 바뀔 때만 저장

  const handleNext = async () => {
    console.log('🟡 선택된 값:', selected); // ✅ 전체 selected 상태 확인
  
    if (!selected.course || selected.course.trim() === '') {
      setAlertVisible(true);
      setAlertMessage(t('select.alert.courseRequired'));
      return;
    }
    
    if (!selected.ticketIdx || selected.ticketIdx.trim() === '') {
      setAlertVisible(true);
      setAlertMessage(t('select.alert.ticketRequired'));
      return;
    }
    
    if (pickupOptions.length > 0 && (!selected.pickupIdx || selected.pickupIdx.trim() === '')) {
      setAlertVisible(true);
      setAlertMessage(t('select.alert.pickupRequired'));
      return;
    }
    
    if (eventOptions.length > 0 && (!selected.optionIdx || selected.optionIdx.trim() === '')) {
      setAlertVisible(true);
      setAlertMessage(t('select.alert.optionRequired'));
      return;
    }
    
  
    // ✅ 최종 서버 전송 값 확인
    console.log('🟢 최종 서버 확인 요청 데이터:', {
      Event_Idx: event_idx,
      Package_Idx: selected.packageIdx,
      Ticket_Idx: selected.ticketIdx,
      Pickup_Idx: selected.pickupIdx || '0',
      Option_Idx: selected.optionIdx || '0',
    });
  
    try {
      const res = await fetch('/api/check/package-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Event_Idx: event_idx,
          Package_Idx: selected.packageIdx,
          Ticket_Idx: selected.ticketIdx,
          Pickup_Idx: selected.pickupIdx || '0',
          Option_Idx: selected.optionIdx || '0',
        }),
      });
  
      const data = await res.json();
      console.log('✅ 서버 응답:', data); // 응답 확인
  
      if (data.Result === '0000') {
        router.push(`/${event_idx}/reserve/info`);
      } else {
        setAlertVisible(true);
        setAlertMessage(data.strResult || t('select.alert.noPackage'));
      }
    } catch (err) {
      console.error('블럭 확인 실패:', err);
      setAlertVisible(true);
      setAlertMessage(t('select.alert.serverError'));
    }
  };
  
  
  

  const formatPrice = (price: number) => price.toLocaleString();

  const handleSelect = (room: string, course: string, grade: string) => {
    const matched = plans.find(
      (p) =>
        p.Room_Type === room &&
        p.Course === course &&
        p.Hotel_Grade === grade &&
        p.isPossiblePurchase === 'Y'
    );
    if (!matched) return;
  
    const basePrice = matched.Price || 0;
  
    // 현재 선택된 ticket / pickup / option 항목 찾기
    const selectedTicket = ticketPlans.find((t) => t.Ticket_Idx.toString() === selected.ticketIdx);
    const selectedPickup = pickupOptions.find((p) => p.Pickup_idx.toString() === selected.pickupIdx);
    const selectedOption = eventOptions.find((o) => o.Option_IDX.toString() === selected.optionIdx);
  
    const ticketPrice = selectedTicket?.price || 0;
    const pickupPrice = selectedPickup?.Price || 0;
    const optionName = selectedOption?.Option_Name || '';
  
    const totalPrice =
      room === 'Twin'
        ? (basePrice + ticketPrice) * 2 + pickupPrice
        : basePrice + ticketPrice + pickupPrice;
  
    const newSelection = {
      room,
      course,
      grade,
      price: basePrice.toString(),
      packageIdx: matched.Package_Idx?.toString() || '',
      packageCode: matched.Package_Code || '',
      ticketIdx: selected.ticketIdx || '',
      ticketName: selectedTicket?.course || '',
      ticketPrice,
      pickupIdx: selected.pickupIdx || '',
      pickupName: selectedPickup?.Pickup_Name || '',
      pickupPrice,
      optionIdx: selected.optionIdx || '',
      optionName,
      totalPrice,
    };
  
    setSelected(newSelection);
    localStorage.setItem('selectedPlan', JSON.stringify(newSelection));
  
    if (ticketSectionRef.current) {
      setTimeout(() => {
        ticketSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
  

  const courses = Array.from(new Set(plans.map((p) => p.Course)));

  const getTotalPrice = () => {
    const basePrice = Number(selected.price) || 0;
  
    const ticketPrice =
      ticketPlans.find((t) => t.Ticket_Idx.toString() === selected.ticketIdx)?.price || 0;
  
    const pickupPrice =
      pickupOptions.find((p) => p.Pickup_idx.toString() === selected.pickupIdx)?.Price || 0;
  
    const isTwin = selected.room === 'Twin';
  
    const total = isTwin
      ? basePrice + ticketPrice * 2 + pickupPrice
      : basePrice + ticketPrice + pickupPrice;
  
    return total;
  };
  


  if (!eventDetail) return <Loading />;
  return (
    <div className="px-4 pt-5 pb-32 bg-white text-black">
      
      <BackButton label={t('select.back', 'Reservation')} />

      <div className="mt-6">
        <h1 className="text-[16px] font-bold">
          {eventDetail ? eventDetail.Title.replace(/<br\s*\/?>/gi, ' ') : 'Loading...'}
        </h1>

        <div className="mt-6 ">

          {/* Twin / Single 설명 박스 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[16px] font-semibold">
                <Image src="/event/twin_icon.png" alt="Twin" width={20} height={20} />
                <span>Twin</span>
              </div>
              <div className="flex items-center gap-1 text-[16px] font-semibold">
                <Image src="/event/single_icon.png" alt="Single" width={20} height={20} />
                <span>Single</span>
              </div>
            </div>
            <button
              className="w-6 h-6 bg-gray-200 rounded-full text-[16px] flex items-center justify-center text-gray-700"
              onClick={() => setShowInfo((prev) => !prev)}
            >
              ?
            </button>
          </div>

          {/* 안내 설명창 */}
          {showInfo && (
            <div className="mt-2 p-4 bg-gray-50 border border-gray-300 rounded-xl text-[16px] text-gray-700 leading-relaxed">
              <p className="mb-1">
              <strong>{t('select.room.twinTitle')}</strong>: {t('select.room.twinDesc')}
              </p>
              <p>
              <strong>{t('select.room.singleTitle')}</strong>: {t('select.room.singleDesc')}
              </p>
            </div>
          )}
        </div>



        <div className="space-y-6 mt-[20px]">
        {courses.map((course, i) => (

            <div key={i}>
              <div className="font-semibold text-md mb-2">
                {course.replace(/<br\s*\/?>/gi, ' ')}
              </div>
              <div className="space-y-2">
              {plans
              .filter((p) => p.Course === course)
              .map((plan, idx) => {    console.log('✅ plan data:', plan); // 🔍 콘솔에서 일본어가 깨졌는지 확인

return              (
                
                <button
                  key={idx}
                  onClick={() => handleSelect(plan.Room_Type, plan.Course, plan.Hotel_Grade)}
                  className={clsx(
                    'flex justify-between items-center w-full px-4 py-3 rounded-xl border text-left',
                    selected.course === plan.Course &&
                    selected.grade === plan.Hotel_Grade &&
                    selected.room === plan.Room_Type
                      ? 'border-[#FF8FA9]  bg-blue-50'
                      : 'border-gray-200',
                    plan.Condition !== 'Available' && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={plan.Condition !== 'Available'}
                >
                <span className="flex items-center gap-1">
                  <Image
                    src={plan.Room_Type === 'Twin' ? '/event/twin_icon.png' : '/event/single_icon.png'}
                    alt={plan.Room_Type}
                    width={16}
                    height={16}
                  />
                  <span className="capitalize">{plan.Room_Type}</span>
                </span>

                  <span className="text-[16px]">{plan.Hotel_Grade}</span>
                  <span className="text-[16px] font-medium">
                    ${formatPrice(plan.Room_Type === 'Twin' ? plan.Price / 2 : plan.Price)}
                    {plan.Room_Type === 'Twin' ? ' x2' : ''}
                  </span>
                  <span
                    className={clsx(
                      'text-xs',
                      plan.Condition === 'Available' ? 'text-blue-500' : 'text-red-500'
                    )}
                  >
                    {plan.Condition}
                  </span>
                </button>
              )})}

              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[4px] w-full bg-[#F0F1F3] my-6" />

      <div className="mt-6" ref={ticketSectionRef}>
      <h2 className="font-semibold mb-2 text-[16px]">{t('select.ticketOption')}</h2>

        <div className="space-y-3 mb-[60px]">
          {ticketPlans.map((plan) => (
            <button
            
              key={plan.Ticket_Idx}
              onClick={() => {
                const newSelected = {
                  ...selected,
                  ticketIdx: plan.Ticket_Idx.toString(),
                  ticketName: plan.course,
                  ticketPrice: plan.price
                };
                setSelected(newSelected);
                localStorage.setItem('selectedPlan', JSON.stringify(newSelected));
              }}
              
              className={clsx(
                'w-full border px-4 py-4 rounded-xl text-left',
                selected.ticketIdx === plan.Ticket_Idx.toString()
                  ? 'border-[#FF8FA9] bg-blue-50 font-semibold'
                  : 'border-gray-200'
              )}
            >
              <div className="text-base font-semibold text-black mb-1">{plan.course}</div>
              <div className="text-[16px] text-gray-600">{plan.remark}</div>
              <div className="text-[16px] text-gray-600">
                Package: <span className="font-medium">{plan.package}</span> | Type: <span className="font-medium">{plan.ticket_type}</span>
              </div>
              <div className="text-[16px] mt-2 text-[#12235B] font-bold">
               + ${Number(plan.price).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>



      {/* 픽업 옵션 선택 */}
      {pickupOptions.length > 0 && (
        <>
          <div className="h-[4px] w-full bg-[#F0F1F3] my-6" />
          <div className="mt-6">
          <h2 className="font-semibold mb-2 text-[16px]">{t('select.priceOption')}</h2>

            <div className="space-y-2">
            {pickupOptions.map((pickup) => {
              const cleanName = pickup.Pickup_Name
                ?.replace(/<br\s*\/?>/gi, '\n') // <br> -> 줄바꿈 문자
                ?.replace(/^\s*\/\s*/, '')      // 앞쪽 슬래시 + 공백 제거

              return (
                <button
                  key={pickup.Pickup_idx}
                  onClick={() => {
                    const newSelected = {
                      ...selected,
                      pickupIdx: pickup.Pickup_idx.toString(),
                      pickupName: pickup.Pickup_Name,
                      pickupPrice: pickup.Price
                    };
                    setSelected(newSelected);
                    localStorage.setItem('selectedPlan', JSON.stringify(newSelected));
                  }}
                  
                  className={clsx(
                    'w-full border px-4 py-2 rounded-xl text-[16px] text-left whitespace-pre-line', // 줄바꿈 적용
                    selected.pickupIdx === pickup.Pickup_idx.toString()
                      ? 'border-[#FF8FA9] bg-blue-50 font-semibold'
                      : 'border-gray-200'
                  )}
                >
                  {cleanName}
                  {pickup.Price > 0 && ` (+ $${pickup.Price})`}
                </button>
              );
            })}

            </div>
          </div>
        </>
      )}

      {eventOptions.length > 0 && (
        <>
          <div className="h-[4px] w-full bg-[#F0F1F3] my-6" />
          <div className="mt-6">
          <h2 className="font-semibold mb-2 text-[16px]">{t('select.eventOption')}</h2>

            <div className="space-y-2">
              {eventOptions.map((opt) => (
                <button
                  key={opt.Option_IDX}
                  onClick={() => {
                    const selectedOption = {
                      ...selected,
                      optionIdx: opt.Option_IDX.toString(),
                      optionName: opt.Option_Name
                    };
                    setSelected(selectedOption);
                    localStorage.setItem('selectedPlan', JSON.stringify(selectedOption));
                  }}
                  
                  className={clsx(
                    'w-full border px-4 py-2 rounded-xl text-[16px] text-left',
                    selected.optionIdx === opt.Option_IDX.toString()
                      ? 'border-[#FF8FA9] bg-blue-50 font-semibold'
                      : 'border-gray-200'
                  )}
                >
                  {opt.Option_Name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}


      <div className="h-[4px] w-full bg-[#F0F1F3] my-6" />



      <div className="fixed bottom-0 left-0 right-0 bg-[#12235B] text-white border-t max-w-[430px] m-auto">
  <div className="flex justify-between items-center text-[16px] mb-1 px-4 py-[14px]">
    <span className="flex items-center gap-1">
      <Image
        src={selected.room === 'Twin' ? '/event/twin_icon.png' : '/event/single_icon.png'}
        alt={selected.room}
        width={16}
        height={16}
      />
      {selected.course ? (
        <>
          <span className="capitalize">{selected.room}</span> {/* Twin or Single label */}
          × {selected.course.replace(/<br\s*\/?>/gi, ' ').split('-')[0]} × {selected.grade}
        </>
      ) : (
      <span className="text-red-300 text-xs">{t('select.alert.courseRequired')}</span>

      )}
    </span>
  </div>

  <div className="flex justify-between items-center bg-white text-black py-[12px] px-4">
    <div>
      {selected.course ? (
        <>
          Total{' '}
          <span className="font-bold text-lg">
          ${formatPrice(getTotalPrice())}
          </span>
        </>
      ) : (
        <span className="text-[16px] text-red-500">{t('select.selectCourseMessage', 'Please select a course')}</span> // ✅ 가격 자리도 안내
      )}
    </div>
    <button
      className="bg-[#FF8FA9] px-6 py-2 rounded-xl font-semibold text-[#fff]"
      onClick={handleNext}
    >
    {t('select.next', 'Next')}
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
