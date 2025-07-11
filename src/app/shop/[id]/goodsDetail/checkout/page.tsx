'use client';

import BackButton from '../../../../../../components/common/BackButton';
import Header from '../../../../../../components/common/Header';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen pb-[100px] px-5">
      <Header />
      <BackButton label="Checkout" />

      <div className="mt-6">
        <p className="text-[16px] text-gray-400 mb-1">aespa</p>
        <h2 className="text-lg font-semibold mb-4">Postcard White - 4pcs</h2>
        <p className="text-lg font-bold mb-4">$10</p>

        <div className="mb-6">
          <p className="font-semibold mb-2">Quantity</p>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 border rounded-full flex justify-center items-center text-xl">-</button>
            <span className="text-lg">2</span>
            <button className="w-8 h-8 border rounded-full flex justify-center items-center text-xl">+</button>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">Coupon</p>
          <select className="w-full border rounded-md px-3 py-2">
            <option>Select coupon</option>
          </select>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-1">Point</p>
          <p className="text-[16px] text-[#FF8FA9] ">My point Balance <span className="text-black font-bold ml-1">150P</span></p>
          <p className="text-xs text-blue-500 mb-2">150p can be used for up to 1 dollar.</p>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Usage($)"
            />
            <button className="bg-[#FF8FA9] text-white font-bold px-4 py-2 rounded-lg">Apply</button>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">Agreement to terms</p>
          <div className="text-[16px] space-y-2">
            <p>
              <input type="checkbox" className="mr-2" /> I have checked and agree with the cancellation policy.
            </p>
            <p>
              <input type="checkbox" className="mr-2" /> I have read the below information and agree with the Terms of Use
            </p>
          </div>
        </div>
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 border-t z-50">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-500">Total</p>
          <p className="text-xl font-bold">$19</p>
        </div>
        <button className="w-full bg-[#FF8FA9] text-white py-3 rounded-xl font-semibold">
          Purchase
        </button>
      </div>
    </div>
  );
}
