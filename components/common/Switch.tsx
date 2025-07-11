'use client';

import { useEffect, useState } from 'react';

interface SwitchProps {
  label: string;
  subtitle?: string;
  defaultChecked?: boolean;
  checked?: boolean; // ✅ 추가
  onChange?: (checked: boolean) => void;
}

export default function Switch({
  label,
  subtitle,
  defaultChecked = false,
  checked,
  onChange,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // ✅ 외부에서 제어할 경우 내부 상태 업데이트
  useEffect(() => {
    if (checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked]);

  const toggle = () => {
    const next = !internalChecked;
    if (checked === undefined) {
      // ✅ 비제어형일 때 내부 상태 업데이트
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  return (
    <div className="flex justify-between items-start py-4">
      <div className="flex-1 pr-4">
        <div className="text-[16px] font-medium text-black">{label}</div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1 leading-snug">
            {subtitle}
          </div>
        )}
      </div>
      <button
        onClick={toggle}
        className={`relative inline-flex h-[28px] w-[48px] rounded-full transition-colors duration-200 ${
          internalChecked ? 'bg-[#FF8FA9]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-[4px] left-[4px] h-[20px] w-[20px] rounded-full bg-white shadow transition-transform duration-200 transform ${
            internalChecked ? 'translate-x-[20px]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
