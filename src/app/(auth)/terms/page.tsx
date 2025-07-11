// app/(auth)/terms/page.tsx
'use client';

import BackButton from '../../../../components/common/BackButton';
import NextButton from '../../../../components/common/NextButton';
import { useState } from 'react';

const TERMS = [
  { label: 'Terms of Use', required: true },
  { label: 'Privacy Policy', required: true },
  { label: 'Marketing Consent', required: false },
];

export default function TermsAgreePage() {
  const [checked, setChecked] = useState<string[]>([]);

  const toggleCheck = (label: string) => {
    setChecked((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const allChecked = TERMS.every((term) => checked.includes(term.label));

  return (
    <div className="min-h-screen px-5 pt-12 pb-6 flex flex-col bg-white">
      <BackButton />

      <div className="mt-8">
        <p className="text-base font-bold mb-6">Please agree to the terms.</p>

        <div className="mb-4">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={() => {
                if (allChecked) {
                  setChecked([]);
                } else {
                  setChecked(TERMS.map((t) => t.label));
                }
              }}
            />
            <span className="text-[16px] font-semibold">Agree to all</span>
          </label>

          {TERMS.map((term) => (
            <label
              key={term.label}
              className="flex items-center gap-2 py-2 border-t text-[16px]"
            >
              <input
                type="checkbox"
                checked={checked.includes(term.label)}
                onChange={() => toggleCheck(term.label)}
              />
              <span>{term.label} {term.required && <span className="text-[#e7527f]">(Required)</span>}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <NextButton label="Next" disabled={!TERMS.filter(t => t.required).every(t => checked.includes(t.label))} />
      </div>
    </div>
  );
}