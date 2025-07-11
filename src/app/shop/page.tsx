'use client';

import Header from '../../../components/common/Header';
import Navbar from '../../../components/common/Navbar';
// import Header from '../../../components/common/Header';
// import Navbar from '../../../components/common/Navbar';

export default function ShopPage() {
  // const router = useRouter();

  return (
<div className="relative min-w-[320px] mx-auto max-w-[430px] min-h-screen bg-white overflow-hidden pb-[100px] text-black px-4">
      {/* 헤더 */}
      <Header title="Shop" hasNotification />

      {/* 본문: Coming Soon */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center px-6">
        <h1 className="text-[24px] font-bold text-[#FF8FA9] mb-4">CONCONTOWN</h1>
        <p className="text-[16px] text-gray-700">COMING SOON</p>
      </div>

      {/* 네비게이션 */}
      <Navbar />
    </div>
  );
  // return (
  //   <div className="relative min-w-[320px] mx-auto max-w-[430px] min-h-screen bg-white overflow-hidden pb-[100px] text-black px-4">
  //     <Header title="Shop" hasNotification />
  //     <h2 className="text-[15px] font-semibold">My reserved Concert</h2>
  //     <p className="text-[16px] text-gray-500 mb-4">
  //       You can only buy goods for your booked concert.
  //     </p>

  //     <div className="rounded-xl overflow-hidden shadow-md">
  //       <Image
  //         src="/dummy/concert2.png"
  //         width={500}
  //         height={500}
  //         alt="concert"
  //         className="w-full h-auto object-cover"
  //       />
  //       <div className="bg-white p-4">
  //         <span className="text-xs bg-[#eee] rounded-full px-2 py-1 font-semibold text-gray-600">
  //           location
  //         </span>
  //         <h3 className="text-[15px] font-bold mt-2 leading-tight">
  //           2024–25 aespa LIVE TOUR – SYNK : PARALLEL LINE – ENCORE
  //         </h3>
  //         <button
  //           onClick={() => router.push('/shop/1')}
  //           className="mt-4 w-full py-2 rounded-xl bg-[#FF8FA9] text-white text-[16px] font-semibold"
  //         >
  //           Go to shop
  //         </button>
  //       </div>
  //     </div>
  //     <Navbar />
  //   </div>
  // );
}
