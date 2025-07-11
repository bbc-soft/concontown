// app/(auth)/language/page.tsx
'use client';

import BackButton from '../../../../components/common/BackButton';
import NextButton from '../../../../components/common/NextButton';
import { useState } from 'react';

const LANGUAGES = [
  'English',
  'Korean',
  'Japanese',
  'Chinese',
];

export default function LanguageSelectPage() {
  const [selected, setSelected] = useState('Korean');

  return (
    <div className="min-h-screen px-5 pt-12 pb-6 flex flex-col bg-white">
      <BackButton />

      <div className="mt-8">
        <p className="text-base font-bold mb-6">Please select your language.</p>

        <ul className="space-y-3">
          {LANGUAGES.map((lang) => (
            <li
              key={lang}
              className={`w-full px-4 py-3 rounded-lg border ${
                selected === lang ? 'border-[#e7527f] bg-[#fef4f7]' : 'border-gray-200'
              } text-[16px] flex justify-between items-center`}
              onClick={() => setSelected(lang)}
            >
              {lang}
              {selected === lang && <span className="text-[#e7527f]">✔</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <NextButton label="Next" />
      </div>
    </div>
  );
}