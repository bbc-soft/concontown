'use client';
import { useEffect, useState } from 'react';

interface Country {
  Nation: string;
  National_Code: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
}

export default function NationalityModal({ isOpen, onClose, onSelect }: Props) {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/nationality')
        .then((res) => res.json())
        .then((data) => {
          setCountries(data);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-h-[80%] overflow-auto w-full max-w-sm p-4">
        <h2 className="text-lg font-bold mb-4">Select your country</h2>
        <ul className="divide-y text-[16px]">
          {countries.map((item, i) => (
            <li
              key={i}
              className="py-2 cursor-pointer hover:bg-gray-100 px-2"
              onClick={() => {
                onSelect(item);
                onClose();
              }}
            >
              {item.Nation} ({item.National_Code})
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 w-full py-2 bg-gray-200 rounded-lg text-[16px]">
          Close
        </button>
      </div>
    </div>
  );
}
