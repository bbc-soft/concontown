'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface Country {
  Nation: string;
  National_Code: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'country' | 'code'; // country → Nation / code → National_Code
  onSelect: (value: string) => void;
}

export default function CountrySelectModal({ isOpen, onClose, type, onSelect }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/nationality');
        const data = await res.json();
        setCountries(data);
      } catch (error) {
        console.error('국가 코드 불러오기 실패', error);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleSelect = (item: Country) => {
    const value = type === 'country' ? item.Nation : item.National_Code;
    setSelected(value);
    onSelect(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-[430px] rounded-t-2xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-[16px] font-bold">
            {type === 'country' ? 'Country/Region' : 'Country Code'}
          </h2>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {countries.map((item, index) => {
            const value = type === 'country' ? item.Nation : item.National_Code;
            return (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className={clsx(
                  'px-5 py-4 cursor-pointer hover:bg-gray-100',
                  selected === value && 'bg-yellow-100'
                )}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
