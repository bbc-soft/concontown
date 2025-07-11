import TicketTabFilter from './TicketTabFilter';
import TicketListCard from './TicketListCard';
import { useState } from 'react';

export default function TicketSection() {
  const [selected, setSelected] = useState<'all' | 'coming' | 'reserve'  | 'closing' | 'waiting' | 'end'>('all');

  return (
    <div>
      <TicketTabFilter selected={selected} setSelected={setSelected} />
      <div className="px-4 space-y-6">
        <TicketListCard selected={selected} />
      </div>
    </div>
  );
}
