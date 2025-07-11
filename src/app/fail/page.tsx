'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  const message = decodeURIComponent(searchParams.get('message') || 'Payment failed.');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    console.error('❌ Payment failed:', { code, message, orderId });
  }, [code, message, orderId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-5">

      <h1 className="text-2xl font-bold text-[#FF5A5A] mb-3">Payment Failed</h1>
      <p className="text-base text-gray-600 mb-1">{message}</p>
      {orderId && <p className="text-[16px] text-gray-400">Order ID: {orderId}</p>}

      <div className="mt-8 w-full max-w-xs space-y-3">
        <button
          onClick={() => router.back()}
          className="w-full py-3 rounded-xl bg-[#FF8FA9] text-white font-semibold"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 rounded-xl border border-gray-300 text-gray-800"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
