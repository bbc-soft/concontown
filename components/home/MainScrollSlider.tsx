'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AlertModal from '../common/AlertModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguageStore } from '@/stores/useLanguageStore'; 


interface EventItem {
  event_idx: number;
  master_image: string;
  title: string;
  start_date: string;
  end_date: string;
  isWaiting: string;
  isCommingSoon: string;
  isJoin: string;
  isLiked: boolean;
  master_notice?: string;
  isClosed?: boolean;
  strAlert?: string;
  strBtn?: string;
}


export default function MainScrollSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<EventItem[]>([]);
  const [displayItems, setDisplayItems] = useState<EventItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });
  const router = useRouter();
  const { member } = useAuthStore(); 
  const { langId } = useLanguageStore(); // ✅ 상태에서 langId 추출


  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement;
    if (!card) return;

    container.scrollTo({
      left: card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2,
      behavior,
    });
  };

  const toggleLike = (eventIdx: number) => {
    setDisplayItems(prev =>
      prev.map(item =>
        item.event_idx === eventIdx ? { ...item, isLiked: !item.isLiked } : item
      )
    );
  };
  const getDefaultAlertMessage = (langId: string) => {
    switch (langId) {
      case 'KR':
        return '본 패키지는 판매 마감되었습니다.';
      case 'JP':
        return 'このパッケージツアーの募集は終了いたしました。';
      case 'CN':
        return '本套餐已结束';
      case 'EN':
      default:
        return 'The tour package is closed.';
    }
  };
  
  const handleReserveClick = (item: EventItem) => {
    const canEnter = item.isCommingSoon !== 'Y' && !item.isClosed;
  
    console.log('🧪 strAlert 값 확인:', item.strAlert);
    console.log('🧪 strAlert 타입:', typeof item.strAlert);
  
    if (!item.strAlert) {//canEnter
      router.push(`/${item.event_idx}/reserve/detail`);
    } else {
      setAlertContent({
        title: 'Alert',
        description:
          item.strAlert && item.strAlert.trim() !== ''
            ? item.strAlert
            : getDefaultAlertMessage(langId),
      });
      
      setAlertOpen(true);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      
      if (!member?.idx) return; // ✅ 멤버 정보 없으면 패스

      // try {
      //   const res = await fetch(`/api/event/list?LangId=${langId}&member_idx=${member.idx}`);

      //   const data = await res.json();
        
      //   if (!Array.isArray(data)) {
      //     console.error('❌ API 응답이 배열이 아님:', data);
      //     return;
      //   }

      //   const now = new Date();
      //   const updated = data.map((item: EventItem) => ({
      //     ...item,
      //     isClosed: new Date(item.end_date) < now,
      //   }));
      //   setItems(updated);
        
      //   // displayItems도 isClosed 반영한 데이터로
      //   if (updated.length > 0) {
      //     const looped = [...updated, ...updated, ...updated];
      //     setDisplayItems(looped);
      //     const initialIndex = updated.length;
      //     setCurrentIndex(initialIndex);
      //     setTimeout(() => scrollToIndex(initialIndex, 'auto'), 50);
      //   }
      // } catch (error) {
      //   console.error('행사 데이터를 불러오지 못했습니다 ❌', error);
      // }
    };

    fetchData();
  }, [member]);

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  const handleScrollEnd = () => {
    const container = scrollRef.current;
    const originalLength = items.length;

    if (!container) return;

    if (currentIndex <= originalLength / 2) {
      const newIndex = currentIndex + originalLength;
      setCurrentIndex(newIndex);
      requestAnimationFrame(() => {
        container.style.scrollBehavior = 'auto';
        scrollToIndex(newIndex, 'auto');
        requestAnimationFrame(() => {
          container.style.scrollBehavior = 'smooth';
        });
      });
    } else if (currentIndex >= originalLength * 2 + (originalLength / 2)) {
      const newIndex = currentIndex - originalLength;
      setCurrentIndex(newIndex);
      requestAnimationFrame(() => {
        container.style.scrollBehavior = 'auto';
        scrollToIndex(newIndex, 'auto');
        requestAnimationFrame(() => {
          container.style.scrollBehavior = 'smooth';
        });
      });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let startX = 0;
    let isSwiping = false;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isSwiping) return;
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) setCurrentIndex(prev => prev + 1);
      else if (endX - startX > 50) setCurrentIndex(prev => prev - 1);
      isSwiping = false;
    };

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="mt-5 px-0 w-full overflow-visible pb-2.5">
      <div
        className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4 pb-2.5"
        ref={scrollRef}
        onTransitionEnd={handleScrollEnd}
        style={{
          WebkitOverflowScrolling: 'touch', // iOS에서 터치 스크롤 활성화
          overscrollBehaviorX: 'contain',   // 바운스 최소화
        }}
      >
        {displayItems.map((item, idx) => {
          const isActive = idx === currentIndex;
          // const canEnter = item.isCommingSoon !== 'Y' && !item.isClosed;

          const buttonLabel = item.strBtn;
          const buttonColor = !item.strAlert ? 'bg-[#ff8fa9]' : 'bg-[#e2e3e7]';

          return (
            <div
              key={`${item.event_idx}-${idx}`}
              className={`flex-shrink-0 transition-all duration-300 ${
                isActive ? 'scale-100' : 'scale-90 opacity-60'
              } w-[320px] rounded-xl shadow-md bg-white`}
            >
              <div className="rounded-t-xl overflow-hidden">
                <Image
                  src={item.master_image || '/dummy/concert1.png'}
                  alt={item.title}
                  width={320}
                  height={400}
                  className="object-cover pointer-events-none"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-[16px] text-black font-bold font-smtown leading-tight">
                  {item.title}
                </h3>
                {item.master_notice && (
                  <div
                    className="text-xs text-gray-500 leading-snug text-left line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: item.master_notice }}
                  />
                )}

                <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReserveClick(item);
                  }}
                  className={`flex-1 mt-2 py-2 text-[16px] font-bold text-white rounded-lg ${buttonColor}`}
                >
                  {buttonLabel}
                </button>


                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.event_idx);
                    }}
                    className="mt-2 w-10 h-10 border border-[#e2e3e7] rounded-lg flex items-center justify-center"
                  >
                    <Image
                      src={item.isLiked ? '/home/heart-filled.svg' : '/home/heart.svg'}
                      alt="heart"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {Array.isArray(items) &&
          items.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                currentIndex % items.length === i ? 'bg-[#ff8fa9]' : 'bg-[#cbced4]'
              }`}
            ></div>
          ))}
      </div>

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertContent.title}
        description={alertContent.description}
      />
    </div>
  );
}
