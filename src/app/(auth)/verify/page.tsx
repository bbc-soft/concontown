// app/(auth)/verify/page.tsx
'use client';

import BackButton from '../../../../components/common/BackButton';
import NextButton from '../../../../components/common/NextButton';

export default function VerificationCodePage() {
  return (
    <div className="min-h-screen px-5 pt-12 pb-6 flex flex-col bg-white">
      <BackButton />

      <div className="mt-8">
        <p className="text-base font-bold leading-snug">
          The verification code has been<br />sent to you email :
        </p>
        <p className="text-[#e7527f] font-bold mt-1">abc@gmail.com</p>
        <p className="text-base font-bold mt-4">Please enter the code.</p>

        <div className="mt-4">
          <label className="block mb-1 text-[16px] font-medium text-gray-700">Verification code</label>
          <input
            type="text"
            placeholder="ABCDEF123"
            className="w-full px-4 py-3 border border-[#e7527f] rounded-lg text-[16px]"
          />
        </div>

        <p className="text-[16px] text-center text-gray-500 mt-6">Has the email not arrived yet?</p>
        <div className="flex justify-center mt-2">
          <button className="bg-[#f8eacc] px-6 py-2 rounded-lg text-[16px] font-semibold">Resend</button>
        </div>
      </div>

      <div className="mt-auto">
        <NextButton label="Next" />
      </div>
    </div>
  );
}
