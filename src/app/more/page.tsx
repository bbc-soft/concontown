'use client';

import Header from '../../../components/common/Header';
import Navbar from '../../../components/common/Navbar';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '../../stores/useAuthStore';
import DeleteAccountModal from '../../../components/common/DeleteAccountModal';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/useLanguageStore';

interface Point {
  POINT: number;
}

interface Coupon {
  COUPON_IDX: number;
  COUPON_NAME: string;
  DISCOUNT_PRICE: number;
  LIMIT_DATE: string;
  USE_YN: string;
  ABLE_YN: string;
  isExpire: string;
}

export default function MorePage() {
  const { t } = useTranslation();
  const { member, isLoggedIn, logout } = useAuthStore();
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const langId = useLanguageStore.getState().langId.toUpperCase();

  const [summary, setSummary] = useState({
    point: 0,
    coupon: 0,
    wishlist: 0,
  });

  const fetchTotalPoint = async (): Promise<number> => {
    const res = await fetch('/api/point', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_idx: member?.idx, lang: 'EN' }),
    });
    const data: Point[] = await res.json();
    return data.reduce((acc, item) => acc + item.POINT, 0);
  };

  const fetchCouponCount = async (): Promise<number> => {
    const res = await fetch(`/api/coupon/list?LangId=${langId}&member_idx=${member?.idx}`);
    const data: Coupon[] = await res.json();
    return data.filter((c) => c.USE_YN === 'N' && c.isExpire === 'N').length;
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [point, coupon] = await Promise.all([
          fetchTotalPoint(),
          fetchCouponCount(),
        ]);

        setSummary({
          point,
          coupon,
          wishlist: 0,
        });
      } catch (err) {
        console.error('Summary fetch failed:', err);
      }
    };

    if (member?.idx) fetchSummary();
  }, [member]);

  useEffect(() => {
    if(isLoggedIn === false) {
        //console.log("logout!!!!");
      localStorage.setItem("sns_provider", "");
      if(typeof window !== "undefined" && (window as any).LogoutChannel) {
        const payload = {
        };
    
        (window as any).LogoutChannel.postMessage(JSON.stringify(payload));
      }
    }
  }, [isLoggedIn]);

  const handleAccountDelete = async (pwd: string, pwd2: string) => {
    if (!member) return;

    try {
      const res = await fetch('/api/member/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: member.member_id,
          member_idx: member.idx,
          member_pwd: pwd,
          member_pwd2: pwd2,
          U_IP: '',
        }),
      });

      const data = await res.json();

      if (data.Result === '0000') {
        alert('Account deleted successfully.');
        logout();
        router.replace('/login');
      } else {
        alert(`Failed to delete: ${data.ResultStr || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Account deletion failed:', err);
      alert('Server error occurred.');
    }
  };

  return (
    <div className="relative min-w-[320px] mx-auto max-w-[430px] min-h-screen bg-white overflow-hidden pb-[100px] px-4 text-black">
      <Header />

      <div className="">
        <div className="mt-2">
          <h2 className="text-base font-semibold">
            {member?.Name_1st || member?.Name_3rd
              ? `${member?.Name_1st || ''} ${member?.Name_3rd || ''}`.trim()
              : t('common.guest', 'Guest')}
          </h2>
          <p className="text-[16px] text-gray-400">{member?.email || t('loginEmail.title')}</p>
        </div>

        <button
          className="w-full bg-[#ff8fa9] text-white font-semibold text-[16px] py-3 rounded-xl mt-4 flex justify-between items-center px-4"
          onClick={() => router.push('/myinfo')}
        >
          <Image src="/common/user-edit.svg" alt="userEdit" width={24} height={24} />
          {t('more.myPersonalInfo', 'My Personal Info')}
          <ChevronRight size={18} />
        </button>

        <div className="flex justify-around text-center bg-[#f6f6f6] rounded-xl p-4 mt-4 text-[16px] font-semibold">
          <button onClick={() => router.push('/point')}>
            <div>
              <div className="text-black">{t('point.title', 'Point')}</div>
              <div className="text-[#1a1a1a]">
                {summary.point.toLocaleString()}p
              </div>
            </div>
          </button>
          <button onClick={() => router.push('/coupon')}>
            <div>
              <div className="text-black">{t('coupon.title', 'Coupon')}</div>
              <div className="text-[#1a1a1a]">{summary.coupon}</div>
            </div>
          </button>
          <div>
            <div className="text-black">{t('wishlist.title', 'Wishlist')}</div>
            <div className="text-[#1a1a1a]">{summary.wishlist}</div>
          </div>
        </div>

        <div
          className="py-[20px] border-b-[1px] border-[#F0F1F3] cursor-pointer"
          onClick={() => router.push('/mybooking')}
        >
          <div className="text-[16px] flex justify-between">
            {t('myBooking.title', 'My Booking')}
            <ChevronRight size={18} />
          </div>
        </div>

        <ul className="divide-y divide-[#F0F1F3] text-[16px] font-medium text-[#1a1a1a]">
          {[
            { label: t('QnA.title', 'Q&A'), path: '/qna' },
            { label: t('faq.title', 'FAQ'), path: '/faq' },
            { label: t('more.setting', 'Setting'), path: '/setting' },
            { label: t('myFanclub', 'My Fanclub'), path: '/myfanclub' }

          ].map((item) => (
            <li
              key={item.path}
              className="flex justify-between items-center py-4 cursor-pointer"
              onClick={() => router.push(item.path)}
            >
              {item.label}
              <ChevronRight size={18} />
            </li>
          ))}
        </ul>
      </div>

      {isLoggedIn && (
        <>
          <button
            className="mt-6 w-full py-3 rounded-xl bg-[#FDF1F3] text-[#FF5A5A] font-semibold text-[16px] flex justify-center items-center gap-2 border border-[#FFE1E1] hover:bg-[#ffe8ec] transition"
            onClick={() => {
              logout();
              router.replace('/login');
            }}
          >
            {t('logout', 'Logout')}
          </button>
          <div className="mt-6 text-center">
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="text-[16px] text-[#999] underline underline-offset-4 hover:text-[#FF5A5A] transition"
            >
              {t('deleteAccount', 'Delete Account')}
            </button>
          </div>



          <DeleteAccountModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleAccountDelete}
          />
        </>
      )}

      <Navbar />
    </div>
  );
}
