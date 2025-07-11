// ✅ 수정된 CouponModal.tsx
'use client';

import clsx from 'clsx';
import { Coupon } from '@/types/coupon';
import { useTranslation } from 'react-i18next'; // ✅ 추가

interface Props {
  coupons: Coupon[];
  selected: number | null;
  onSelect: (idx: number) => void;
  onClose: () => void;
}

export default function CouponModal({ coupons, selected, onSelect, onClose }: Props) {
  const { t } = useTranslation(); // ✅ 추가

  return (
    <div className={clsx(
      'fixed inset-0 z-50 transition-all duration-300 ease-in-out',
      'visible opacity-100'
    )}>
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className={clsx(
        'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-w-[430px] mx-auto transition-transform duration-300 ease-in-out',
        'translate-y-0'
      )}>
        <h2 className="text-lg font-semibold mb-3">{t('reservation.coupon.modalTitle')}</h2>
        {coupons.length === 0 ? (
          <div className="text-[16px] text-gray-500 text-center py-6">
            {t('reservation.coupon.empty')}
          </div>
        ) : (
          <ul className="space-y-2 max-h-[50vh] overflow-y-auto">
            {coupons.map((coupon) => {
              const isSelected = coupon.COUPON_IDX === selected;
              return (
                <li
                  key={coupon.COUPON_IDX}
                  className={clsx(
                    'border px-4 py-3 rounded-xl cursor-pointer',
                    isSelected ? 'bg-[#FDF1D6]' : 'bg-white'
                  )}
                  onClick={() => onSelect(coupon.COUPON_IDX)}
                >
                   <p className="font-bold text-[#1A2456] mb-1">{coupon.COUPON_NAME}</p> 
                  <p className="text-[16px] text-gray-500">
                    {t('reservation.coupon.validUntil', { date: coupon.LIMIT_DATE })}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-lg bg-[#FF8FA9] text-white font-semibold"
        >
          {t('reservation.coupon.close')}
        </button>
      </div>
    </div>
  );
}
