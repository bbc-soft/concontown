// app/shop/[goodsId]/page.tsx → ✅

'use client';

import Image from 'next/image';
import Header from '../../../../components/common/Header';
import { useRouter } from 'next/navigation';

export default function ShopDetailPage() {
  const router = useRouter();

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white pb-[80px]">
      <Header />
      <div className="px-4 py-2">
        {/* Title */}
        <div className="text-lg font-bold mt-3">2024–25 aespa LIVE TOUR…</div>
        <div className="text-[16px] text-[#f18ca2] mt-1">for International Fans only</div>

        {/* 대표 이미지 & location */}
        <div className="flex gap-4 items-center mt-5">
          <Image
            src="/mock/concert-cover.jpg"
            alt="concert"
            width={80}
            height={100}
            className="rounded-md"
          />
          <div>
            <div className="text-[11px] font-medium px-2 py-1 rounded-full bg-[#f3f3f3] inline-block mb-1">
              location
            </div>
            <div className="font-semibold text-[16px] leading-[18px]">
              2024–25 aespa LIVE TOUR – SYNK : PARALLEL LINE – ENCORE
            </div>
            <div className="text-xs text-[#f18ca2] mt-0.5">for International Fans only</div>
          </div>
        </div>

        {/* 상품 리스트 */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* 상품 1 */}
          <div
            onClick={() => router.push('/shop/white-postcard')}
            className="cursor-pointer"
          >
            <Image
              src="/mock/postcard-white.jpg"
              alt="postcard-white"
              width={180}
              height={180}
              className="rounded-md"
            />
            <div className="text-xs text-gray-400 mt-1">aespa</div>
            <div className="font-semibold text-[16px]">Postcard White - 4pcs</div>
            <div className="text-[16px] font-bold mt-1">$10</div>
            <button className="mt-2 w-full bg-pink-300 text-white py-1.5 text-[16px] rounded-full">
              add to cart
            </button>
          </div>

          {/* 상품 2 */}
          <div className="cursor-pointer">
            <Image
              src="/mock/postcard-black.jpg"
              alt="postcard-black"
              width={180}
              height={180}
              className="rounded-md"
            />
            <div className="text-xs text-gray-400 mt-1">aespa</div>
            <div className="font-semibold text-[16px]">Postcard Black - 4pcs</div>
            <div className="text-[16px] font-bold mt-1">$10</div>
            <button className="mt-2 w-full bg-gray-600 text-white py-1.5 text-[16px] rounded-full">
              added!
            </button>
          </div>
        </div>
      </div>

      {/* 하단 바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[430px] w-full px-4 py-2 bg-gradient-to-r from-[#9c5fff] to-[#f18ca2] flex justify-between text-white text-[16px] font-medium">
        <div>24:24 left</div>
        <div>2 products</div>
      </div>
    </div>
  );
}
