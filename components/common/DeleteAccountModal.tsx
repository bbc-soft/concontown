// DeleteAccountModal (matching AlertModal tone and translated to English)
'use client';

import { useState } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string, password2: string) => void;
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!password || !password2) {
      setError('Please enter both password fields.');
      return;
    }
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }
    onConfirm(password, password2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-2xl w-[85%] max-w-sm p-6 text-center shadow-xl">
        <h2 className="text-lg font-bold text-black mb-2">Delete Account</h2>
        <p className="text-[16px] text-gray-700 mb-4">To delete your account, please enter your password below.</p>
        <input
          type="password"
          placeholder="Enter password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-[16px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-[16px]"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        {error && <p className="text-[16px] text-red-500 mb-2">{error}</p>}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-800 font-semibold text-[16px]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-lg bg-[#F48DA0] text-white font-semibold text-[16px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
