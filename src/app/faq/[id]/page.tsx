'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/useLanguageStore';

interface FaqDetail {
  NO: number;
  CATEGORY: string;
  QUESTIONS: string;
  CONTENTS: string;
  SUB_NO: number;
}

export default function FaqDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [faq, setFaq] = useState<FaqDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const langId = useLanguageStore.getState().langId.toUpperCase();

  useEffect(() => {
    const fetchFaqDetail = async () => {
      try {
        const res = await fetch(`/api/faq/${id}?LangId=${langId}`);
        const data = await res.json();
        setFaq(data);
      } catch (err) {
        console.error('FAQ detail fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFaqDetail();
  }, [id]);

  return (
    <div className="min-h-screen bg-white text-black px-5 pt-12 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{t('faq.title')}</h1>
      </div>

      {loading ? (
        <p className="text-[16px] text-gray-400 text-center">{t('faq.loading')}</p>
      ) : faq ? (
        <div>
          <p className="text-[16px] text-gray-400 mb-2">{faq.CATEGORY}</p>
          <h2 className="text-lg font-bold mb-4 leading-tight whitespace-pre-line">
            {faq.QUESTIONS}
          </h2>

          <div
            className="text-[16px] text-gray-800 whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: faq.CONTENTS.replace(/\n/g, '<br />'),
            }}
          />
        </div>
      ) : (
        <p className="text-[16px] text-gray-400 text-center">{t('faq.notFound')}</p>
      )}
    </div>
  );
}
