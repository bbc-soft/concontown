'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/useLanguageStore';




interface FAQ {
  NO: number;
  CATEGORY: string;
  QUESTIONS: string;
  CONTENTS: string;
}

export default function FAQPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [faqList, setFaqList] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState('All');
  const [error, setError] = useState('');
  const langId = useLanguageStore.getState().langId.toUpperCase();


  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch(`/api/faq?LangId=${langId}`); // 백틱 사용
        if (!res.ok) throw new Error('Failed to load FAQs');

        const data: FAQ[] = await res.json();

        setFaqList(data);

        const uniqueCats = Array.from(new Set(data.map(f => f.CATEGORY)));
        setCategories(['All', ...uniqueCats]);
      } catch (err) {
        console.error(err);
        setError(t('faq.fetchError') || 'Failed to load FAQ data.');
      }
    };

    fetchFAQs();
  }, [t]);

  const filtered = selected === 'All' ? faqList : faqList.filter(f => f.CATEGORY === selected);

  return (
    <div className="min-h-screen px-4 pt-12 pb-10 bg-white text-black">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{t('faq.title') || 'FAQ'}</h1>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto mb-5 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full border text-[16px] whitespace-nowrap ${
              selected === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3 w-full">
        {error && (
          <p className="text-[16px] text-center text-red-500">{error}</p>
        )}

        {!error && filtered.length === 0 ? (
          <p className="text-[16px] text-center text-gray-400">
            {t('faq.noData') || 'No FAQ available.'}
          </p>
        ) : (
          filtered.map(faq => (
            <button
              key={faq.NO}
              onClick={() => router.push(`/faq/${faq.NO}`)}
              className="w-full text-left border rounded-xl p-4 bg-white shadow-sm"
              title={faq.QUESTIONS} // Hover 시 전체 질문 표시
            >
              <div className="text-[12px] text-gray-400 mb-1">{faq.CATEGORY}</div>
              <div className="text-[15px] font-semibold flex justify-between items-center">
                <span className="truncate max-w-[250px]">{faq.QUESTIONS}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
