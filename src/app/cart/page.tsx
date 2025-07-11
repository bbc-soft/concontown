'use client';

import Header from '../../../components/common/Header';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ShopCartPage() {
  const router = useRouter();

  return (
    <div className="relative min-w-[320px] mx-auto max-w-[430px] min-h-screen bg-white overflow-hidden pb-[100px] px-4 text-black" >
      <Header title="Cart" />

      <h2 className="text-lg font-bold mt-4 mb-6">My cart (2)</h2>

      {/* 상품 리스트 */}
      <div className="space-y-5">
        {/* 상품 */}
        <div className="flex items-start gap-4">
          <Image
            src="/mock/postcard-white.jpg"
            alt="item"
            width={100}
            height={100}
            className="rounded-lg"
          />
          <div className="flex-1 space-y-1">
            <div className="text-xs text-gray-400">aespa</div>
            <div className="font-bold text-[16px] leading-5">Postcard White - 4pcs</div>
            <div className="text-[16px] font-bold">$10</div>
            <div className="text-[16px]">Quantity: 1</div>
            <div className="text-right text-xs text-blue-500 underline cursor-pointer">
              x
            </div>
          </div>
        </div>

        {/* 상품2 (예시) */}
        <div className="flex items-start gap-4">
          <Image
            src="/mock/postcard-black.jpg"
            alt="item"
            width={100}
            height={100}
            className="rounded-lg"
          />
          <div className="flex-1 space-y-1">
            <div className="text-xs text-gray-400">aespa</div>
            <div className="font-bold text-[16px] leading-5">Postcard Black - 4pcs</div>
            <div className="text-[16px] font-bold">$10</div>
            <div className="text-[16px]">Quantity: 1</div>
            <div className="text-right text-xs text-blue-500 underline cursor-pointer">
              x
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white px-5 py-4 border-t">
        <div className="flex justify-between mb-2">
          <span className="text-[16px]">Total</span>
          <span className="text-lg font-bold">$20</span>
        </div>
        <button
          onClick={() => router.push('/shop/payment')}
          className="w-full bg-[#FF8FA9] text-white py-3 rounded-xl text-[16px] font-semibold"
        >
          Purchase All
        </button>
      </div>
    </div>
  );
}
