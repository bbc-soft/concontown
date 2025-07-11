'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { CompanionInfo } from '@/types/companion';

interface CompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: CompanionInfo) => void;
}

export default function CompanionModal({ isOpen, onClose, onSubmit }: CompanionModalProps) {
  const [formData, setFormData] = useState<CompanionInfo>({
    firstName: '',
    lastName: '',
    email: '',
    backupEmail: '',
    birthDate: '',
    gender: 'female',
    country: '',
    city: '',
    phoneNumber: '',
    phoneCode: '+82',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const {
      firstName, lastName, email, backupEmail, birthDate,
      country, city, phoneNumber
    } = formData;

    if (!firstName || !lastName || !email || !backupEmail || !birthDate || !country || !city || !phoneNumber) {
      alert('Please fill out all fields before completing.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className={clsx(
      'fixed inset-0 z-50 transition-all duration-300 ease-in-out',
      isOpen ? 'visible opacity-100' : 'invisible opacity-0'
    )}>
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />

      <div className={clsx(
        'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl pt-6 pb-4 px-6 max-w-[430px] mx-auto transition-transform duration-300 ease-in-out overflow-y-auto max-h-[90vh]',
        isOpen ? 'translate-y-0' : 'translate-y-full'
      )}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-4 underline text-[14px]">
            CLOSE
        </button>

        <h2 className="text-lg font-semibold mb-4 pr-6">Please enter your tour companion Information manually</h2>

        <form className="space-y-4 text-[16px]">
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
          <input name="lastName" placeholder="Last/Family Name" value={formData.lastName} onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
          <input name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
          <input name="backupEmail" placeholder="Backup E-mail" value={formData.backupEmail} onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
          <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />

          <div>
            <label className="block font-medium mb-1">Gender</label>
            <div className="flex gap-2">
              {['female', 'male', 'both'].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={clsx(
                    'px-4 py-2 rounded-full border text-[16px]',
                    formData.gender === g ? 'bg-[#12235B] text-white' : 'border-gray-300 text-gray-700'
                  )}
                  onClick={() => setFormData((prev) => ({ ...prev, gender: g }))}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <input name="country" placeholder="Country/Region" value={formData.country} onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
          <input name="city" placeholder="City of residence" value={formData.city} onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
          <input name="phoneNumber" placeholder="Contact Number" value={formData.phoneNumber} onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
        </form>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 rounded-lg bg-[#FF8FA9] text-white font-semibold"
        >
          Complete
        </button>
      </div>
    </div>
  );
}
