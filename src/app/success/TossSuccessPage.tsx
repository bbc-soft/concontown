// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';

// interface TossPaymentResult {
//   orderId: string;
//   totalAmount: number;
//   approvedAt: string;
//   method?: string;
// }

// export default function TossSuccessPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [status, setStatus] = useState<'pending' | 'success' | 'fail'>('pending');
//   const [result, setResult] = useState<TossPaymentResult | null>(null);

//   useEffect(() => {
//     const confirmPayment = async () => {
//       const paymentKey = searchParams.get('paymentKey');
//       const orderId = searchParams.get('orderId');
//       const amount = searchParams.get('amount');

//       if (!paymentKey || !orderId || !amount) {
//         setStatus('fail');
//         return;
//       }

//       try {
//         const res = await fetch('/api/toss/confirm', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
//         });

//         const data = await res.json();

//         if (data.success) {
//           setStatus('success');
//           setResult(data.data);
//         } else {
//           console.error('Payment approval failed:', data.error);
//           setStatus('fail');
//         }
//       } catch (err) {
//         console.error('API call failed:', err);
//         setStatus('fail');
//       }
//     };

//     confirmPayment();
//   }, [searchParams]);

//   return (
//     <div className="min-h-screen bg-white text-black px-6 py-20 text-center">
//       {status === 'pending' && (
//         <p className="text-lg font-semibold text-gray-700">Verifying your payment...</p>
//       )}

//       {status === 'success' && result && (
//         <div>
//           <h1 className="text-2xl font-bold text-[#FF8FA9] mb-4">🎉 Payment Successful!</h1>
//           <p className="text-base text-gray-800 mb-1">
//             <span className="font-semibold">Order ID:</span> {result.orderId}
//           </p>
//           <p className="text-base text-gray-800 mb-1">
//             <span className="font-semibold">Amount:</span>{' '}
//             ${result.totalAmount.toLocaleString(undefined, {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </p>
//           <p className="text-[16px] text-gray-500 mb-8">
//             Payment Date: {new Date(result.approvedAt).toLocaleString()}
//           </p>

//           <button
//             className="mt-4 px-6 py-3 rounded-xl bg-[#FF8FA9] text-white font-semibold"
//             onClick={() => router.push('/')}
//           >
//             Go to Home
//           </button>
//         </div>
//       )}

//       {status === 'fail' && (
//         <div>
//           <h1 className="text-2xl font-bold text-red-500 mb-4">❌ Payment Failed</h1>
//           <p className="text-[16px] text-gray-600 mb-4">
//             We couldn’t verify your payment. Please contact customer support.
//           </p>
//           <button
//             className="mt-4 px-6 py-3 rounded-xl bg-gray-300 text-black font-semibold"
//             onClick={() => router.push('/')}
//           >
//             Back to Home
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
