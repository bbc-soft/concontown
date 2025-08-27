'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';

interface QnaItem {
  idx: number;
  title: string;
  ins_date: string;
  replyYN: 'Y' | 'N';
  event_name: string | null;
  SUB_CATEGORY: string | null;
  contents?: string;
  reply_content?: string;
  parents?: number | null;
  depth?: number;
  file_url?: string;
}

interface SiteInfo {
  Service_Time: string;
}

interface Category {
  VALUE: string;
  TITLE: string;
}

export default function QnaPage() {
  const router = useRouter();
  const { member } = useAuthStore();
  const { t, i18n } = useTranslation();
  const langCode = i18n.language?.toUpperCase() || 'EN';

  const [info, setInfo] = useState<SiteInfo | null>(null);
  const [qnaList, setQnaList] = useState<QnaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<string>('All');

  const [toastMessage, setToastMessage] = useState('');

  const fetchQnA = async () => {
    if (!member?.idx) return;
    if(member?.idx === 169 || member?.idx === 17076) {
      setToastMessage('Get qna list');
    }
    const res = await fetch(`/api/qna?lang=${langCode}&member_idx=${member.idx}&page=1&size=20`);
    const data = await res.json();
    setQnaList(data);
  };

  const fetchCategories = async () => {
    const res = await fetch(`/api/qna/category-list?LangId=${langCode}&isGeneral=Y`);
    const data = await res.json();
    setCategories([{ VALUE: 'All', TITLE: t('faq.faqTabs.all', 'All') }, ...data]);
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const res = await fetch(`/api/siteInfo?LangId=${langCode}`);
      const data = await res.json();
      setInfo(data);
    };
    fetchInfo();
    fetchCategories();
  }, [langCode]);

  useEffect(() => {
    if (member?.idx) fetchQnA();
  }, [member]);

  const selectedCategoryTitle =
    selectedCategoryValue === 'All'
      ? null
      : categories.find((c) => c.VALUE === selectedCategoryValue)?.TITLE;

  const filteredParents = selectedCategoryTitle
    ? qnaList.filter((q) => q.depth === 0 && q.SUB_CATEGORY === selectedCategoryTitle)
    : qnaList.filter((q) => q.depth === 0);

  return (
    <div className="min-h-screen px-5 pt-12 pb-10 bg-white text-black">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{t('QnA.title', 'Q&A')}</h1>
      </div>

      {info?.Service_Time && (
        <div
          className="bg-[#FFF3DC] rounded-xl p-4 text-[12px] mt-2 mb-4 text-black"
          dangerouslySetInnerHTML={{ __html: info.Service_Time }}
        />
      )}

      <div className="flex gap-2 overflow-x-auto mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.VALUE}
            onClick={() => setSelectedCategoryValue(cat.VALUE)}
            className={`px-4 py-1 rounded-full border text-[16px] font-medium whitespace-nowrap ${
              selectedCategoryValue === cat.VALUE
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {cat.TITLE}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-10">
        {filteredParents.map((parent) => {
          const reply = qnaList.find((item) => item.depth === 1 && item.parents === parent.idx);
          return (
            <div key={parent.idx} className="border rounded-xl p-4 bg-white">
              <div className="text-[12px] text-gray-400 mb-1">{parent.ins_date.split(' ')[0]}</div>
              <div className="font-semibold text-[16px] mb-2">
                [{parent.SUB_CATEGORY || t('ask.Select Category', 'Uncategorized')}] {parent.title}
              </div>
              <div className="text-[16px] text-gray-700 leading-tight whitespace-pre-line">
                {parent.contents || t('ask.inquiry', 'No description provided.')}
              </div>
              {parent.file_url && (
                <div className="mt-2">
                  <img
                    src={parent.file_url}
                    alt="Attached"
                    className="max-w-full h-auto rounded-md shadow"
                  />
                </div>
              )}

              {reply && (
                <div className="mt-4 bg-[#F8F9FB] rounded-lg p-3 text-[16px]">
                  <div className="font-semibold mb-1 text-[#12235B]">
                    {t('ask.answer', 'Answer')}
                  </div>
                  <div className="text-gray-800 whitespace-pre-line">
                    {reply.contents || t('ask.noAnswer', 'No reply content.')}
                  </div>
                  <div className="text-xs text-right mt-2 text-gray-500">
                    {reply.ins_date.split(' ')[0]}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-4 left-4 right-4 max-w-[1008px] mx-auto">
        <button
          onClick={() => router.push('/qna/ask')}
          className="bg-[#FF8FA9] text-white w-full py-3 rounded-xl font-semibold"
        >
          {t('QnA.button', 'Ask a question')}
        </button>
      </div>

      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white text-[16px] py-2 px-4 rounded-full shadow-lg animate-fade-in-out">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
