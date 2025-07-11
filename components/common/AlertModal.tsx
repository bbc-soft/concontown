'use client';

import React from 'react';


interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  title = 'Restock Alert',
  description = 'Description about restock policy',
  buttonText = 'OK',
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-2xl w-[85%] max-w-sm p-6 text-center shadow-xl">
        <h2 className="text-lg font-bold text-black mb-2">{title}</h2>
        <p className="text-[16px] text-gray-700 mb-5">{description}</p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-[#F48DA0] text-white font-semibold text-[15px]"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
