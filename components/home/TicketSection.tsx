'use client';

import TicketTabFilter from './TicketTabFilter';
import TicketListCard from './TicketListCard';
import { useState, useEffect, useState as useReactState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function TicketSection() {
  const { member } = useAuthStore();
  const [selected, setSelected] = useState<'all' | 'coming' | 'reserve'  | 'closing' | 'waiting' | 'end'>('all');
  const [isAndroidApp, setIsAndroidApp] = useReactState(false);
  const [isIosApp, setIsIosApp] = useReactState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      console.log('userAgent', navigator.userAgent);
      setIsAndroidApp(navigator.userAgent.includes('concontown-android'));
      setIsIosApp(navigator.userAgent.includes('concontown-ios'));
    }
  }, []);

  return (
    <div>
      <TicketTabFilter selected={selected} setSelected={setSelected} />
      {((!isAndroidApp && !isIosApp) || member?.idx === 169) && <div className="px-4 space-y-6">
        <TicketListCard selected={selected} />
      </div>}
    </div>
  );
}
