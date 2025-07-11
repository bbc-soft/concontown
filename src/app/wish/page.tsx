'use client';


import Image from 'next/image';
import { useState } from 'react';
import Header from '../../../components/common/Header';
import Navbar from '../../../components/common/Navbar';

const categories = ['All', 'Coming soon', 'Reserve', 'Waiting'];

export default function WishPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const wishList = [
    {
      id: 1,
      title: '2024-25 aespa LIVE TOUR – SYNK : PARALLEL LINE – ENCORE',
      location: 'location',
      image: '/concerts/aespa.png',
      status: 'Coming soon',
      reserved: false,
    },
    {
      id: 2,
      title: '2025 NCT WISH ASIA TOUR LOG in TAIPEI',
      location: 'location',
      image: '/concerts/nctwish.png',
      status: 'Reserve',
      reserved: true,
    },
  ];

  return (
    <div className="relative min-w-[320px] mx-auto max-w-[430px] min-h-screen bg-white overflow-hidden pb-[100px] px-4 text-black">
      <Header />
      <div className="px-5">
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-[16px] rounded-full px-4 py-2 border ${
                activeCategory === category
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'text-[#1a1a1a] border-[#e4e4e4]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {wishList
            .filter((item) => activeCategory === 'All' || item.status === activeCategory)
            .map((item) => (
              <div
                key={item.id}
                className="rounded-xl shadow-md overflow-hidden flex bg-white"
              >
                <Image
                  src="/dummy/concert2.png"
                  alt={item.title}
                  width={125}
                  height={170}
                  className="object-cover w-[125px] h-[170px]"
                />
                <div className="flex-1 p-3 relative">
                  {/* 하트 */}
                  <Image
                    src="/home/heart.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="absolute top-3 right-3"
                  />
                  <div className="text-[12px] mb-1 text-[#333] font-semibold bg-[#F3F3F4] px-2 py-1 rounded-full w-fit">
                    {item.location}
                  </div>
                  <div className="font-bold text-[14px] leading-[1.4] line-clamp-2">
                    {item.title}
                  </div>
                  <div className="text-[12px] text-[#ff8fa9] mt-1">
                    for International Fans only
                  </div>
                  <button
                    className={`mt-3 w-full text-[16px] font-semibold rounded-lg py-2 ${
                      item.reserved
                        ? 'bg-[#ff8fa9] text-white'
                        : 'bg-[#e6e7eb] text-[#b2b3b6]'
                    }`}
                  >
                    {item.reserved ? 'Reserve' : 'Coming soon'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Navbar />
    </div>
  );
}
