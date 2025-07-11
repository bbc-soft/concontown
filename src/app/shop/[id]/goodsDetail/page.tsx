'use client';

import Image from 'next/image';
import Header from '../../../../../components/common/Header';
import { useState } from 'react';

export default function GoodsDetailPage() {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white pb-[100px]">
      <Header />

      <div className="px-4 pt-4">
        <button className="text-[16px] text-gray-500 mb-2" onClick={() => history.back()}>
          ← Postcard White - 4set
        </button>

        {/* 이미지 및 indicator */}
        <div className="w-full flex justify-center">
          <Image
            src="/mock/postcard-white.jpg"
            alt="Postcard"
            width={180}
            height={180}
            className="rounded-md"
          />
        </div>
        <div className="flex justify-center space-x-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-pink-300' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-400 mb-1">aespa</div>
          <h2 className="text-lg font-semibold">Postcard White - 4pcs</h2>
          <div className="text-lg font-bold mt-1">$10</div>

          {/* 수량 */}
          <div className="mt-4">
            <label className="text-[16px] font-medium">Quantity</label>
            <div className="flex items-center mt-2 space-x-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 rounded-full border flex justify-center items-center"
              >
                -
              </button>
              <span className="text-base font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-full border flex justify-center items-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Product Detail, Notice */}
          <div className="mt-6 border-t pt-4 text-[16px]">
            <p className="font-medium mb-2">Product Detail</p>
            <p className="text-gray-500">...</p>

            <p className="font-medium mt-6 mb-2">Notice</p>
            <p className="text-gray-500">...</p>
          </div>
        </div>
      </div>

      {/* 하단 바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[430px] w-full px-4 py-4 bg-white flex justify-between gap-3">
        <button className="bg-pink-300 text-white flex-1 py-3 rounded-xl font-semibold text-[16px]">
          Buy {quantity} Products
        </button>
        <button className="bg-gray-700 text-white flex-1 py-3 rounded-xl font-semibold text-[16px]">
          added !
        </button>
      </div>
    </div>
  );
}
