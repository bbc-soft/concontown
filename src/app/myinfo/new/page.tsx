'use client';

import { useState } from 'react';
import Header from '../../../../components/common/Header';
import clsx from 'clsx';
import AlertModal from '../../../../components/common/AlertModal';

export default function NewPersonalInfoPage() {

  const [alert, setAlert] = useState({
    open: false,
    title: '',
    description: '',
    buttonText: 'OK',
  });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'female',
    country: '',
    city: '',
    email: '',
    phoneCode: '',
    phoneNumber: '',
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      setAlert({
        open: true,
        title: 'Missing Information',
        description: 'Please fill out all required fields.',
        buttonText: 'OK',
      });
      return;
    }

    await fetch('/api/member/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'INSERT',
        member_id: form.email,
        member_pwd: 'test',
        Name_1st: form.firstName,
        Name_3rd: form.lastName,
        Birth_day: form.birthDate.split('-')[2],
        Birth_month: form.birthDate.split('-')[1],
        Birth_year: form.birthDate.split('-')[0],
        Gender: form.gender,
        Nationality: form.country,
        City: form.city,
        National_Code: form.phoneCode,
        Phone: form.phoneNumber,
        Mail: form.email,
        site_language: 'EN',
        U_IP: 'user_ip_here',
      }),
    });

    setAlert({
      open: true,
      title: 'Success',
      description: 'Your information has been updated.',
      buttonText: 'OK',
    });
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white pt-5 pb-28 px-5 text-black relative">
      <Header title="Personal Information" />

      <p className="text-[16px] text-gray-600 mb-4">
        We kindly ask you to update your personal information for the global package tour.
      </p>

      <div className="space-y-4">
        <div>
          <input
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="First Name"
            className="w-full border rounded-xl px-4 py-3 text-[16px] border-red-400"
          />
          <p className="text-xs text-red-500 mt-1">Please check English name as in passport.</p>
        </div>

        <div>
          <input
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Last name"
            className="w-full border rounded-xl px-4 py-3 text-[16px]"
          />
          <p className="text-xs text-blue-500 mt-1">Please check English name as in passport.</p>
        </div>

        <input
          type="date"
          value={form.birthDate}
          onChange={(e) => handleChange('birthDate', e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-[16px]"
        />

        <div>
          <label className="text-[16px] font-medium block mb-2">Gender</label>
          <div className="flex gap-2">
            {['female', 'male', 'both'].map((g) => (
              <button
                key={g}
                type="button"
                className={clsx(
                  'px-4 py-2 rounded-full border text-[16px]',
                  form.gender === g ? 'bg-[#12235B] text-white' : 'border-gray-300 text-gray-700'
                )}
                onClick={() => handleChange('gender', g)}
              >
                {g === 'female' ? 'Female' : g === 'male' ? 'Male' : 'Both'}
              </button>
            ))}
          </div>
        </div>

        <select
          value={form.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-[16px]"
        >
          <option value="">Country/Region</option>
          <option value="Republic of Korea">Republic of Korea</option>
          <option value="United States">United States</option>
        </select>

        <div>
          <input
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City of residence"
            className="w-full border rounded-xl px-4 py-3 text-[16px]"
          />
          <p className="text-xs text-blue-500 mt-1">Do not put full address.(ex. Seoul)</p>
        </div>

        <div>
          <input
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email address"
            className="w-full border rounded-xl px-4 py-3 text-[16px]"
          />
          <p className="text-xs text-blue-500 mt-1">
            Receive the confirmation letter from CONCONTOWN 
          </p>
        </div>

        <select
          value={form.phoneCode}
          onChange={(e) => handleChange('phoneCode', e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-[16px]"
        >
          <option value="">Country code</option>
          <option value="+82">Republic of Korea (+82)</option>
          <option value="+1">United States (+1)</option>
        </select>

        <input
          value={form.phoneNumber}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          placeholder="Contact Number"
          className="w-full border rounded-xl px-4 py-3 text-[16px]"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t max-w-[430px] m-auto">
        <button
          className="bg-[#FF8FA9] text-white rounded-xl py-3 font-semibold w-full"
          onClick={handleSubmit}
        >
          Update information
        </button>
      </div>

      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        title={alert.title}
        description={alert.description}
        buttonText={alert.buttonText}
      />
    </div>
  );
}
