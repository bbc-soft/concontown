'use client';

import Header from '../../../../components/common/Header';
import BackButton from '../../../../components/common/BackButton';

export default function ShopPaymentPage() {
  return (
    <div className="relative min-w-[320px] mx-auto max-w-[430px] min-h-screen bg-white overflow-hidden pb-[100px]">
      <Header title="Payment" />
      <BackButton label="Back" />

      <h2 className="text-lg font-bold mt-6 mb-4">Payment Summary</h2>

      <section className="text-[16px] mb-6">
        <div className="flex justify-between mb-1">
          <span>Postcard White - 4pcs</span>
          <span>$10</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Postcard Black - 4pcs</span>
          <span>$10</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-3 mt-3">
          <span>Total</span>
          <span>$20</span>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-[16px] mb-2">Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" defaultChecked />
            <span className="text-[16px]">Credit Card</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" />
            <span className="text-[16px]">PayPal</span>
          </label>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold text-[16px] mb-2">Agreement</h3>
        <label className="flex gap-2 text-[16px]">
          <input type="checkbox" /> I agree to the terms and conditions.
        </label>
      </section>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white px-5 py-4 border-t">
        <div className="flex justify-between mb-2">
          <span className="text-[16px]">Final Total</span>
          <span className="text-lg font-bold">$20</span>
        </div>
        <button className="w-full bg-[#FF8FA9] text-white py-3 rounded-xl text-[16px] font-semibold">
          Pay Now
        </button>
      </div>
    </div>
  );
}