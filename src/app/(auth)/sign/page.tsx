// app/(auth)/sign/page.tsx
'use client';
export const runtime = 'nodejs'; 
import { Suspense } from 'react';
import SignEmailPageInner from '../../../../components/sign/SignEmailPageInner';


export default function SignPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignEmailPageInner />
    </Suspense>
  );
}
