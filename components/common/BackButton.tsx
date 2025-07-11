'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BackButton({ label }: { label?: string }) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="p-4 flex items-center gap-1">
      <Image src="/arrow-left.svg" alt="Back" width={20} height={20} />
      {label && <span className="text-base font-semibold">{label}</span>}
    </button>
  );
}
