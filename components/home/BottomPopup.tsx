'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination, Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

interface Notice {
  NOTICE_MASTER_IDX: number;
  NOTICE_SUB_IDX: number;
  TITLE: string;
  PUB_DATE: string;
  LANGUAGE_YN: string;
  READ_DATE?: string | null;
  ALL_YN?: string;
  MAIN_YN?: string;
  POPUP_YN?: string;
  LOGIN_YN?: string;
  BANNER_URL?: string;
}

interface Props {
  notices: Notice[];
}

export default function BottomPopup({ notices }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const { t } = useTranslation();
  const router = useRouter();

  // 필터: POPUP_YN === 'Y'인 공지만
  const popupNotices = notices.filter(n => n.POPUP_YN === 'Y' && n.BANNER_URL);

  useEffect(() => {
    const dismissedDate = localStorage.getItem('popupDismissedDate');
    const today = getTodayString();
    if (dismissedDate === today) {
      setIsOpen(false);
    }
  }, []);

  if (!isOpen || popupNotices.length === 0) return null;

  function getTodayString() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center">
      <div className="bg-white rounded-t-3xl shadow-2xl w-[100%] max-w-md overflow-hidden p-0">
        <div className="relative w-full">
          <Swiper
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false, // 유저가 터치해도 자동 롤링 계속됨
            }}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex + 1)}
          >
            {popupNotices.map((notice, i) => (
              <SwiperSlide key={i}>
                <img
                  src={notice.BANNER_URL!}
                  alt={notice.TITLE}
                  className="w-full h-auto object-cover"
                  // onClick={() =>
                  //   router.push(`/notice/${notice.NOTICE_MASTER_IDX}?type=notice&isPersonal=false`)
                  // }
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex} / {popupNotices.length}
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-gray-300 px-4 py-3 text-sm bg-white">
          <button
            onClick={() => {
                const today = getTodayString();
                console.log('today', today);
                localStorage.setItem('popupDismissedDate', today);
                setIsOpen(false);
            }}
            className="text-[#101010] font-bold"
          >
            {t('home.modal.sub')}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#101010] font-bold"
          >
            {t('home.modal.button')}
          </button>
        </div>
      </div>
    </div>
  );
}