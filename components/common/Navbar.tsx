'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import AlertModal from './AlertModal';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Shop', path: '/shop', icon: 'Shop' },
    { label: 'Wish', path: '/wish', icon: 'Wish' },
    { label: 'More', path: '/more', icon: 'More' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleNavClick = (path: string) => {
    if (path === '/shop' || path === '/wish') {
      setShowModal(true);
    } else {
      router.push(path);
    }
  };

  return (
    <>
      {/* <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[71px] border-t border-[#e2e3e7] bg-white flex justify-around items-center py-3.5 z-50"> */}
      <div className="fixed bottom-0 w-full max-w-[430px] h-[71px] border-t border-[#e2e3e7] bg-white flex justify-around items-center py-3.5 z-50 mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const iconSrc = `/common/navbar/${item.icon}_${active ? 'On' : 'Off'}.svg`;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="flex flex-col items-center gap-0.5 text-[13px] leading-[17.16px]"
            >
              <Image src={iconSrc} alt={item.label} width={38} height={43} />
            </button>
          );
        })}
      </div>

      <AlertModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t('navbar.comingSoonTitle', 'Coming Soon')}
        description={t('navbar.comingSoonDesc', 'This feature will be available soon!')}
        buttonText={t('navbar.ok', 'OK')}
      />
    </>
  );
}
