'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/useLanguageStore';
import clsx from 'clsx';

interface Coupon {
  COUPON_IDX: number;
  COUPON_NAME: string;
  DISCOUNT_PRICE: number;
  LIMIT_DATE: string;
  USE_YN: string;
  ABLE_YN: string;
  isExpire: string;
}

export default function CouponPage() {
  const { t } = useTranslation();
  const { member } = useAuthStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'expired'>('available');
  const router = useRouter();
  const langId = useLanguageStore.getState().langId.toUpperCase();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`/api/coupon/list?LangId=${langId}&member_idx=${member?.idx}`);
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      }
    };

    if (member?.idx) fetchCoupons();
  }, [member]);

  const availableCoupons = coupons.filter(
    (c) => c.ABLE_YN === 'Y' && c.isExpire === 'N' && c.USE_YN === 'N'
  );
  
  const expiredCoupons = coupons.filter(
    (c) => !(c.ABLE_YN === 'Y' && c.isExpire === 'N' && c.USE_YN === 'N')
  );
  

  const displayedCoupons = activeTab === 'available' ? availableCoupons : expiredCoupons;

  return (
    <div className="min-h-screen px-5 pt-12 pb-10 bg-white text-black">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{t('coupon.title') || 'Coupon'}</h1>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={clsx(
            'flex-1 text-center py-2 font-medium',
            activeTab === 'available' ? 'border-b-2 border-[#FF8FA9] text-[#FF8FA9]' : 'text-gray-500'
          )}
          onClick={() => setActiveTab('available')}
        >
          {t('coupon.tab.available') || 'Available'}
        </button>
        <button
          className={clsx(
            'flex-1 text-center py-2 font-medium',
            activeTab === 'expired' ? 'border-b-2 border-[#FF8FA9] text-[#FF8FA9]' : 'text-gray-500'
          )}
          onClick={() => setActiveTab('expired')}
        >
          {t('coupon.tab.expired') || 'Expired / Used'}
        </button>
      </div>

      {/* Coupon List */}
      {displayedCoupons.length > 0 ? (
        <div className="space-y-3">
          {displayedCoupons.map((coupon) => (
            <div
              key={coupon.COUPON_IDX}
              className={clsx(
                'border rounded-xl p-4 text-[16px] bg-white shadow-sm',
                activeTab === 'expired' && 'opacity-50'
              )}
            >
              <div className="flex justify-between items-center font-semibold mb-1">
                <div>{coupon.COUPON_NAME}</div>
                <div className="text-[#FF8FA9] font-bold">
                  ${coupon.DISCOUNT_PRICE}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                {coupon.LIMIT_DATE
                  ? `${t('coupon.validUntil') || 'Valid until'} ${coupon.LIMIT_DATE}`
                  : t('coupon.noExpiration') || 'No expiration date'}
              </div>

              {coupon.isExpire === 'Y' && (
                <div className="text-xs text-red-500 mt-1">
                  {t('coupon.expired') || 'Expired'}
                </div>
              )}
              {coupon.ABLE_YN === 'N' && (
                <div className="text-xs text-yellow-600 mt-1">
                  {t('coupon.notAvailable') || 'Not available for use'}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[16px] text-center text-gray-500 mt-10">
          {t('coupon.empty') || 'No coupons found.'}
        </div>
      )}
    </div>
  );
}
