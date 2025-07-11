// app/(auth)/login/page.tsx
'use client';
export const runtime = 'nodejs'; 
import { Suspense } from 'react';
import LoginEmailPageInner from '../../../../components/login/LoginEmailPageInner';


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginEmailPageInner />
    </Suspense>
  );
}
