'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function AddTourFriendPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRequest = () => {
    if (!email) {
      setError('Please enter an email.');
      return;
    }
    if (!validateEmail(email)) {
      setError('The email address is not valid.');
      return;
    }

    // TODO: 실제 요청 API 연동 예정
    alert('Friend request sent.');
    router.push('/tourfriends');
  };

  return (
    <div className="min-h-screen bg-white text-black px-5 pt-12 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Add Tour Friend</h1>
      </div>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="concontown email (ID)"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          className={`w-full border px-4 py-3 rounded-lg text-[16px] ${
            error ? 'border-red-400' : 'border-gray-300'
          }`}
        />

        {error && <p className="text-red-500 text-[16px]">{error}</p>}

        <textarea
          placeholder="Enter the message you want to send to your friend."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[16px] h-32"
        />

        <button
          className="w-full bg-[#FF8FA9] text-white font-semibold py-3 rounded-xl"
          onClick={handleRequest}
        >
          Request
        </button>
      </div>
    </div>
  );
}
