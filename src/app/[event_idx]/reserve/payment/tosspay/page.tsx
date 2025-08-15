'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '../../../../../../components/common/BackButton';
import AlertModal from '../../../../../../components/common/AlertModal';
import { useTranslation } from 'react-i18next';

interface TossPaymentsWidgetInstance {
  renderPaymentMethods: (
    selector: string,
    options: { value: number; currency?: string; country?: string },
    config?: { variantKey?: string }
  ) => Promise<void>;
  renderAgreement: (
    selector: string,
    options?: { variantKey?: string }
  ) => Promise<void>;
  requestPayment: (params: {
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
  }) => Promise<void>;
}

declare global {
  interface Window {
    PaymentWidget?: (clientKey: string, customerKey: string) => TossPaymentsWidgetInstance;
  }
}

type TabType = 'KR' | 'PAYPAL' | 'USD';

export default function TossPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TabType>('KR');
  const [finalPrice, setFinalPrice] = useState(0);
  const [krwPrice, setKrwPrice] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const paymentWidgetRef = useRef<TossPaymentsWidgetInstance | null>(null);
  const { t } = useTranslation();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const clientKey = 'live_gck_P9BRQmyarYY5JzmZYJb7rJ07KzLN';
  const customerKey = 'customer-1234';

  const tabLabels = {
    KR: t('paymentTab.localCard', 'Local Card'),
    PAYPAL: t('paymentTab.paypal', 'PayPal'),
    USD: t('paymentTab.overseasCard', 'Overseas Card'),
  };

  const loadTossSdk = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window !== 'undefined' && typeof window.PaymentWidget === 'function') {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1/payment-widget';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject('Toss SDK load failed');
      document.head.appendChild(script);
    });
  };

  const fetchExchangeRate = async () => {
    try {
      const res = await fetch('/api/exchange-rate');
      const data = await res.json();
      if (data.success && data.rate) {
        const usd = Number(searchParams.get('price') || '0');
        const krw = Math.ceil(usd * data.rate);
        setExchangeRate(data.rate);
        setKrwPrice(krw);
      }
    } catch (err) {
      console.error('환율 조회 실패:', err);
    }
  };

  const renderPaymentUI = async (
    widget: TossPaymentsWidgetInstance,
    price: number,
    tab: TabType
  ) => {
    const isKR = tab === 'KR';
    const value = isKR ? krwPrice : price;
    if (!value || value <= 0) return;

    const options = {
      value,
      currency: isKR ? 'KRW' : 'USD',
      country: isKR ? 'KR' : 'US',
    };

    const config = {
      variantKey: isKR ? 'DEFAULT' : tab === 'PAYPAL' ? 'paypalkr' : 'usd',
    };

    const agreementKey = isKR ? 'agreement-kr' : 'AGREEMENT';

    await widget.renderPaymentMethods('#payment-method', options, config);
    await widget.renderAgreement('#agreement', { variantKey: agreementKey });
  };

  const initWidget = async () => {
    try {
      await loadTossSdk();
      const price = Number(searchParams.get('price') || '0');
      setFinalPrice(price);
      await fetchExchangeRate(); // 환율 먼저 세팅
  
      if (typeof window === 'undefined' || typeof window.PaymentWidget !== 'function') return;
  
      const widget = window.PaymentWidget(clientKey, customerKey);
      paymentWidgetRef.current = widget;
  
      // ✅ 환율과 krwPrice가 준비되면 KR 결제수단을 최초 한 번 렌더링
      const interval = setInterval(() => {
        if (selectedTab === 'KR' && exchangeRate && krwPrice && krwPrice > 0) {
          renderPaymentUI(widget, price, 'KR');
          clearInterval(interval);
        }
      }, 200);
    } catch (err) {
      console.error('Toss initWidget error:', err);
    }
  };
  

  useEffect(() => {
    initWidget();
  }, []);
  

  useEffect(() => {
    if (!paymentWidgetRef.current || finalPrice <= 0) return;
    const widget = paymentWidgetRef.current;

    if (selectedTab === 'KR') {
      if (!exchangeRate || !krwPrice || krwPrice <= 0) return;
      renderPaymentUI(widget, finalPrice, 'KR');
    } else {
      renderPaymentUI(widget, finalPrice, selectedTab);
    }
  }, [selectedTab, krwPrice, exchangeRate, finalPrice]);

  const handlePay = async () => {
    try {
      const orderId = localStorage.getItem('reservationOrderCode');
      if (!orderId || !paymentWidgetRef.current) return;

      if (selectedTab === 'KR' && (!exchangeRate || !krwPrice || krwPrice <= 0)) {
        setAlertTitle(t('payment.requestError', 'Payment Error'));
        setAlertMessage(t('payment.notReadyMethod', '결제 수단이 아직 준비되지 않았습니다.'));
        setAlertOpen(true);
        return;
      }

      const rateToSave = selectedTab === 'KR' && exchangeRate ? exchangeRate : 1;
      localStorage.setItem('reservationExchangeRate', String(rateToSave));

      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName: 'CONCONTOWN package',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (e) {
      console.error('Payment error:', e);
      setAlertTitle(t('payment.requestFail', 'Payment Error'));
      setAlertMessage(t('payment.agreeRequireTerms', '필수 약관에 동의해주세요.'));
      setAlertOpen(true);
    }
  };

  return (
    <div className="max-w-[430px] min-h-screen mx-auto bg-white text-black">
      <div className="px-5 pt-6 pb-32">
        <BackButton label={t('payment.back', 'Back to Payment Method')} />

        <div className="flex w-full mt-6 border border-gray-200 rounded-xl overflow-hidden text-center text-[16px] font-medium">
          {(['KR', 'PAYPAL', 'USD'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`w-1/3 py-3 transition ${
                selectedTab === tab
                  ? 'bg-white text-black border-b-2 border-[#FF8FA9] font-semibold'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {selectedTab === 'KR' && krwPrice !== null && (
          <div className="mt-4 text-right text-[16px] text-gray-600">
            {t('payment.krwAmount', 'KRW Amount')}: <strong>{krwPrice.toLocaleString()} 원</strong>
          </div>
        )}

        <div className="mt-6">
          <div id="payment-method" className="mb-6" />
          <div id="agreement" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t w-full max-w-[430px] m-auto">
        {selectedTab === 'KR' && exchangeRate && (
          <div className="text-[16px] text-gray-500 text-center mb-2">
            {t('exchange.notice', { rate: exchangeRate.toLocaleString() })}
          </div>
        )}

        <button
          onClick={handlePay}
          className="w-full bg-[#FF8FA9] text-white font-semibold py-3 rounded-xl"
        >
          {finalPrice ? `$${finalPrice.toFixed(2)} ${t('confirmation.payNow', 'Pay Now')}` : t('payment.preparing', 'Preparing payment...')}
        </button>
      </div>

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        description={alertMessage}
        buttonText={t('payment.confirm', 'OK')}
      />
    </div>
  );
}
