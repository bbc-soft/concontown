'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import AlertModal from '../common/AlertModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguageStore } from '@/stores/useLanguageStore'; 

interface TicketItem {
  event_idx: number;
  master_image: string;
  title: string;
  location: string;
  isCommingSoon: string;
  isJoin: string;
  isWaiting: string;
  isAllCutoff?: string;
  master_notice?: string;
  end_date?: string;
  strAlert?: string; 
  strBtn?: string;  
  Order_No: number;
}

interface TicketListCardProps {
  selected: 'all' | 'coming' | 'reserve' | 'closing' | 'waiting' | 'end';
}

export default function TicketListCard({ selected }: TicketListCardProps) {
  const router = useRouter();
  const { member } = useAuthStore();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });
  const { langId } = useLanguageStore(); // ✅ 상태에서 langId 추출

  useEffect(() => {
    const fetchTickets = async () => {
      if (!member?.idx) return;
  
      try {
        const res = await fetch(`/api/event/list?LangId=${langId}&member_idx=${member.idx}`);
        const data = await res.json();
  
        if (Array.isArray(data)) {
          // const nullItems = data.filter((item) => !item.event_idx);
          // if (nullItems.length > 0) {
          //   console.error('다음 항목에서 event_idx가 null입니다:', nullItems);
          // }
          const uniqueData = uniqueByEventIdx(data); // 중복 제거
          setTickets(uniqueData);
        } else {
          console.error('API 응답이 배열이 아닙니다:', data);
        }
      } catch (error) {
        console.error('티켓 데이터를 불러오지 못했습니다:', error);
      }
    };
  
    fetchTickets();
  }, [member?.idx]);

  const uniqueByEventIdx = (arr: TicketItem[]) => {
    const seen = new Set();
    return arr.filter(item => {
      if (seen.has(item.Order_No)) return false;
      seen.add(item.Order_No);
      return true;
    });
  };
  

  const now = new Date();

  // const filteredTickets = tickets.filter((item) => {
  //   const isExpired = item.end_date && new Date(item.end_date) < now;
    
  //   if (selected === 'all') return true;
  //   if (selected === 'coming') return item.isJoin === 'N' && item.isCommingSoon === 'Y';
  //   if (selected === 'reserve') return item.isWaiting === 'N' && !isExpired;
  //   if (selected === 'closing') return isExpired;
  //   if (selected === 'waiting') return item.isWaiting === 'Y';
  //   if (selected === 'end') return item.isJoin === 'N' && item.isCommingSoon === 'N';
  //   return false;
  // });


const filteredTickets = useMemo(() => {
  return tickets.filter((item) => {
    const isExpired = item.end_date && new Date(item.end_date) < now;

    if (selected === 'all') return true;
    if (selected === 'coming') return item.isJoin === 'N' && item.isCommingSoon === 'Y';
    if (selected === 'reserve') return item.isWaiting === 'N' && !isExpired;
    if (selected === 'closing') return isExpired;
    if (selected === 'waiting') return item.isWaiting === 'Y';
    if (selected === 'end') return item.isJoin === 'N' && item.isCommingSoon === 'N';
    return false;
  });
}, [tickets, selected]);  

  const handleClick = (ticket: TicketItem) => {
    router.push(`/${ticket.event_idx}/reserve/detail`);
  };
  

  return (
    <div className="overflow-y-auto space-y-4">
      {filteredTickets.map((ticket) => {
        const isExpired = ticket.end_date && new Date(ticket.end_date) < now;
        const canEnterDetail = ticket.isCommingSoon !== 'Y' && !isExpired;
        const status = ticket.strBtn;
        return (
          <div
            key={ticket.event_idx}
            className="w-full flex gap-3 bg-white rounded-lg shadow-[0_16px_16px_0px_rgba(240,241,243,1)] border border-[#f0f1f3] cursor-pointer"
          >
            <Image
              src={ticket.master_image || '/dummy/ticket1.png'}
              alt={ticket.title}
              width={125}
              height={170}
              className="rounded-l-lg object-cover pointer-events-none"
            />
            <div className="flex flex-col justify-between py-4 pr-4 flex-1">
              <div className="flex justify-between items-start w-full">
                <div className="px-2 py-1 bg-[#f0f1f3] rounded-full text-[13px] font-bold text-[#454545] w-fit">
                  {ticket.Nation_Name} {ticket.City_Name} 
                </div>
              </div>

              <div className="text-[16px] font-bold leading-snug text-[#111] line-clamp-2">
                {ticket.title}
              </div>
              {ticket.master_notice && (
                <div
                  className="text-xs text-gray-500 mt-1 line-clamp-2 text-left"
                  dangerouslySetInnerHTML={{ __html: ticket.master_notice }}
                />
              )}

              <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!ticket.strAlert) {//canEnterDetail
                    handleClick(ticket);
                  } else {
                    setAlertContent({
                      title: 'Alert',
                      description: ticket.strAlert || 'This package is not yet available.',
                    });
                    setAlertOpen(true);
                  }
                }}
                className={`flex-1 py-2 text-[13px] font-bold rounded-lg ${
                  !ticket.strAlert
                    ? 'bg-[#ff8fa9] text-white'
                    : 'bg-[#e2e3e7] text-[#a3a6aa]'
                }`}
              >
                {status}
              </button>

              </div>
            </div>
          </div>
        );
      })}

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertContent.title}
        description={alertContent.description}
      />
    </div>
  );
}
