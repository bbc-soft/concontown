'use client';

import { useTranslation } from 'react-i18next';

export type FilterType = 'all' | 'coming' | 'reserve' | 'closing' | 'waiting' | 'end';

interface Props {
  selected: FilterType;
  setSelected: React.Dispatch<React.SetStateAction<FilterType>>;
}



export default function TicketTabFilter({ selected, setSelected }: Props) {
  const { t } = useTranslation();

  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: t('home.tabs.0', 'All') },
    { key: "coming", label: t('home.tabs.1', 'Coming soon') },
    { key: "reserve", label: t('home.tabs.2', 'Reserve') },
    { key: "closing", label: t('home.tabs.3', 'Closing') },
    { key: "waiting", label: t('home.tabs.4', 'Waiting') },
    { key: "end", label: t('home.tabs.5', 'Ended') },
  ];

  return (
    <div className="flex items-center gap-[4px] px-4 overflow-x-auto pb-[20px] pt-[10px]">
      {tabs.map((tab) => {
        const isActive = selected === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setSelected(tab.key)}
            className={`flex items-center justify-center gap-1 px-4 py-2 text-[16px] rounded-full ${
              isActive
                ? "bg-[#12325B] text-white font-bold"
                : "bg-white text-[#111] outline outline-1 outline-[#e1e3e6]"
            }`}
          >
            <span className="font-smtown font-medium leading-[18px] whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
