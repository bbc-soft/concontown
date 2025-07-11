'use client';

import Image from 'next/image';
import BackButton from '../../../../../components/common/BackButton';
import NextButton from '../../../../../components/common/NextButton';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import AlertModal from '../../../../../components/common/AlertModal';
import Loading from '../../../../../components/common/Loading';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/useLanguageStore';

interface EventDetail {
  event_idx: number;
  Title: string;
  Title_image: string;
  location: string;
  master_notice?: string;
  sub_notice?: string;
  CANCEL_FEE_TEXT?: string;
  etc1?: string;
  etc2?: string;
  etc3?: string;
  etc4?: string;
  etc5?: string;
  seatMap?: string;
  isAllCutoff : string;
  isWaiting: string;
}

interface CancelPolicy {
  s_date: string;
  e_date: string;
  penalty: number;

}

export default function ReserveDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { event_idx } = useParams();
  const { member } = useAuthStore();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [cancelPolicy, setCancelPolicy] = useState<CancelPolicy[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });
  // 아래 영역에서 버튼 텍스트 설정
  const reserveButtonLabel =
  event?.isAllCutoff === 'Y'
    ? t('reserve.cutoff', '판매중지')
    : event?.isWaiting === 'Y'
    ? t('reserve.waiting', '판매대기')
    : t('reserve.reserveBtn', 'Reserve');

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const langId = useLanguageStore.getState().langId.toUpperCase();
        const res = await fetch('/api/reserve/check-allowed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_idx, member_idx: member?.idx, LangId: langId }),
        });
        const data = await res.json();

        if (data.isAllowedMember !== 'Y') {
          setAlertContent({
            title: t('reservation.title', 'Reservation Not Allowed'),
            description: t('reservation.notAllowed', 'You are not allowed to reserve this package.'),
          });
          setAlertOpen(true);
          return;
        }
        const eventRes = await fetch(`/api/event/detail?event_idx=${event_idx}&LangId=${langId}`);;
        const eventData = await eventRes.json();
        setEvent(eventData);

        const cancelRes = await fetch(`/api/event/cancel-policy?event_idx=${event_idx}`);
        const cancelData = await cancelRes.json();
        setCancelPolicy(cancelData);
      } catch (err) {
        console.error('예약 진입 로직 실패:', err);
      }
    };

    if (event_idx && member?.idx) fetchData();
  }, [event_idx, member]);

  const handleReserve = () => {
    router.push(`/${event_idx}/reserve/select`);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    router.replace('/');
  };

  if (!event) return <Loading />;

  return (
    <div className="px-4 pb-[100px] bg-white text-black min-h-[100vh]">
      <div className="py-4 flex items-center">
        <BackButton />
        <h1 className="ml-2 text-lg font-semibold">{t('reserve.title', 'Package')}</h1>
      </div>

      <div className="rounded-lg overflow-hidden">
      {event.Title_image ? (
        <Image
          src={event.Title_image}
          alt={event.Title || 'package image'}
          width={320}
          height={450}
          className="w-full h-auto object-cover"
        />
      ) : (
        <div className="w-full h-[450px] flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Loading ...
        </div>
      )}

      </div>

      <div className="flex justify-between items-start mt-4">
        <div>
          <div className="text-xs text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded-full mb-1">
            {event.location || t('wish.location', 'location')}
          </div>
          <h2 className="text-[16px] font-bold leading-tight">{event.Title}</h2>
        </div>
        <Image src="/home/heart.svg" alt="heart" width={24} height={24} />
      </div>

      <div className="my-4 space-y-6">
        {event.seatMap && (
          <div>
            <Image
              src={event.seatMap}
              alt="seatmap"
              width={600}
              height={400}
              className="w-full max-w-[430px] rounded-md border"
            />
          </div>
        )}

        {[event.etc1, event.etc2, event.etc3, event.etc4, event.etc5].map((content, idx) => {
          if (!content) return null;
          const textOnly = content
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/gi, '')
            .replace(/\s+/g, '');
          if (!textOnly) return null;

          return (
            <div
              key={idx}
              className="text-[16px] leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                lineHeight: '1.75',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            />
          );
        })}

        {event.CANCEL_FEE_TEXT && (
          <div>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: event.CANCEL_FEE_TEXT }}
            />
            {cancelPolicy.length > 0 && (
              <div className="mt-6 text-[16px] border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-3 font-semibold border-b text-gray-800">
                  {t('reservation.cancel', 'Cancellation Fee Policy')}
                </div>
                <div className="divide-y divide-gray-200">
                  {cancelPolicy.map((policy, idx) => {
                    const formatDate = (dateStr: string) =>
                      new Date(dateStr).toISOString().slice(0, 10).replace(/-/g, '.');
                    return (
                      <div
                        key={idx}
                        className="flex justify-between px-4 py-3 bg-white hover:bg-gray-50"
                      >
                        <span className="text-gray-700">
                          {formatDate(policy.s_date)} ~ {formatDate(policy.e_date)}
                        </span>
                        <span className="font-medium text-gray-900">
                          {policy.penalty}% {t('reservation.fee', 'Fee')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-[430px] m-auto">
        <div className='px-4 py-3'>  
          <NextButton label={reserveButtonLabel} onClick={handleReserve} />
        </div>
      
      </div>

      <AlertModal
        isOpen={alertOpen}
        onClose={handleAlertClose}
        title={alertContent.title}
        description={alertContent.description}
      />
    </div>
  );
}
