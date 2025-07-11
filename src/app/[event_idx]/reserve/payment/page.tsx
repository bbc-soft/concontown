'use client';

import BackButton from '../../../../../components/common/BackButton';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface SelectedPlan {
  room: string;
  course: string;
  grade: string;
  price: string;
}

export default function ReservationPaymentPage() {
  const { t } = useTranslation();
  const { event_idx } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedMethod, setSelectedMethod] = useState('TOSS PAYMENTS');
  const [selected, setSelected] = useState<SelectedPlan | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedPlan');
    if (stored) {
      try {
        setSelected(JSON.parse(stored));
      } catch {
        setSelected(null);
      }
    }

    const priceParam = searchParams.get('price');
    if (priceParam) {
      const price = Number(priceParam);
      if (!isNaN(price)) {
        setFinalPrice(price);
      }
    }
  }, [event_idx, searchParams]);

  const handlePay = () => {
    if (selectedMethod === 'TOSS PAYMENTS') {
      router.push(`/${event_idx}/reserve/payment/tosspay?price=${finalPrice}`);
    } else {
      alert(`${t('payment.processing')} : ${selectedMethod}`);
    }
  };

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string' ? parseInt(price) : price;
    return `$${isNaN(num) ? '0' : num.toLocaleString()}`;
  };

  return (
    <div className="max-w-[430px] min-h-screen mx-auto bg-white text-black">
      <div className="px-5 pt-6 pb-32">
        <BackButton label={t('payment.title') || 'Payment'} />

        <h1 className="text-lg font-bold mt-6 mb-4">
          {t('payment.methodTitle') || 'Payment method'}
        </h1>

        <div className="space-y-3">
          <button
            className={`flex items-center justify-center w-full border rounded-xl px-4 py-3 text-[16px] ${
              selectedMethod === 'TOSS PAYMENTS'
                ? 'border-[#FF8FA9]  font-semibold'
                : 'border-gray-200'
            }`}
            onClick={() => setSelectedMethod('TOSS PAYMENTS')}
          >
            <Image src="/payment/toss.png" alt="Toss Pay" width={70} height={20} />
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t max-w-[430px] m-auto">
        <button
          onClick={handlePay}
          className="w-full bg-[#FF8FA9] text-white font-semibold py-3 rounded-xl"
        >
          {selected
            ? `${formatPrice(finalPrice ?? selected.price)} ${t('payment.purchase') || 'Purchase'}`
            : t('payment.purchase') || 'Purchase'}
        </button>
      </div>
    </div>
  );
}
