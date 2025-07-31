// ✅ /app/qna/ask/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react'
import AlertModal from '../../../../components/common/AlertModal';

export default function QnAAskPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const langCode = i18n.language?.toUpperCase() || 'EN';
  const { token, isLoggedIn, member } = useAuthStore();

  const [eventList, setEventList] = useState<{ event_idx: number; title: string }[]>([]);
  const [categoryList, setCategoryList] = useState<{ code: string; name: string }[]>([]);
  const [event, setEvent] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const [alert, setAlert] = useState({
    open: false,
    title: '',
    description: '',
    buttonText: t('loginEmail.modal.button', 'OK'),
  });

  useEffect(() => {
    const fetchEventAndCategory = async () => {
      try {
        const eventRes = await fetch(`/api/qna/event-list?LangId=${langCode}&member_idx=${member?.idx || ''}`);
        const eventData = await eventRes.json();
        setEventList(eventData.map((item: any) => ({ event_idx: item.VALUE, title: item.TITLE })));

        const categoryRes = await fetch(`/api/qna/category-list?LangId=${langCode}&isGeneral=Y`);
        const categoryData = await categoryRes.json();
        setCategoryList(categoryData.map((item: any) => ({ code: item.VALUE, name: item.TITLE })));
      } catch (err) {
        console.error('Failed to fetch event/category:', err);
      }
    };

    fetchEventAndCategory();
  }, [langCode, member]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onDeletePreview = () => {
      setImage(null);
      setImagePreview(null);
  }

  const uploadToAzureBlob = async (file: File) => {
    const extension = file.name.split('.').pop() || 'bin';
    const now = new Date();
    const folder = now.toISOString().slice(0, 7).replace('-', '');
    const fileName = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 17) + '.' + extension;

    const blobAccount = 'concontown';
    const blobContainer = 'data';  // 컨테이너명만 넣기 (예: 'data')
    const blobName = `qna/${folder}/${fileName}`;  // blob 이름에 경로 포함

    const fileUrl = `https://${blobAccount}.blob.core.windows.net/${blobContainer}/${blobName}`;

    const sasToken = '?sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-23T22:16:36Z&st=2025-06-23T13:16:36Z&spr=https&sig=ldloFAIOFbKYFNoFUlz6yrdcS2Hu%2Fq8XK9IPe95stbw%3D';
    const fullUrl = fileUrl + sasToken;

    const uploadRes = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Azure upload error:', uploadRes.status, errorText);
      throw new Error(`Azure Blob upload failed: ${uploadRes.status}`);
    }

    return { fileName, fileUrl };
  };  

  const handleSubmit = async () => {
    if (!category || !title || !content) {
      setToastMessage(t('QnAAsk.toast.fillAllFields', 'Please fill in all required fields.'));
      return;
    }

    setAlert({
      open: true,
      title: 'Upload',
      description: content,
      buttonText: 'OK',
    });

    try {
      let fileUrl = '';
      let fileName = '';

      // if (image) {
      //   const uploaded = await uploadToAzureBlob(image);
      //   fileUrl = uploaded.fileUrl;
      //   fileName = uploaded.fileName;
      // }

      // if (!isLoggedIn || !token) {
      //   alert(t('QnAAsk.toast.loginRequired', 'Login is required.'));
      //   return;
      // }

      // setAlert({
      //   open: true,
      //   title: 'Upload',
      //   description: fileUrl + '/' + fileName,
      //   buttonText: 'OK',
      // });



      // const res = await fetch('/api/qna/ask', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     member_idx: member?.idx,
      //     member_id: member?.member_id,
      //     event_idx: event || null,
      //     category,
      //     title,
      //     content,
      //     file_name: fileName,
      //     file_url: fileUrl,
      //   }),
      // });

      // const result = await res.json();

      // if (result.result === '0000') {
      //   setToastMessage(t('QnAAsk.toast.success', 'Successfully submitted.'));
      //   setTimeout(() => router.push('/qna'), 1500);
      // } else {
      //   setToastMessage(t('QnAAsk.toast.failed', 'Failed to submit inquiry.'));
      // }
    } catch (err : any) {
      console.error('Submit failed:', err);
      // setToastMessage(t('QnAAsk.toast.error', 'An error occurred. Please try again.'));
      // setToastMessage(err.message || String(err));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-5 pt-12 pb-20 relative">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">{t('QnA.title', 'Q&A')}</h1>
      </div>

      <div className="space-y-4">
        <select value={event} onChange={(e) => setEvent(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-[16px]">
          <option value="">{t('QnAAsk.form.selectEvent', 'Select Event')}</option>
          {eventList.map((item) => (
            <option key={item.event_idx} value={item.event_idx}>{item.title}</option>
          ))}
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-[16px]">
          <option value="">{t('QnAAsk.form.selectCategory', 'Select Category')}</option>
          {categoryList.map((item, idx) => (
            <option key={item.code || idx} value={item.code}>{item.name}</option>
          ))}
        </select>

        <input type="text" placeholder={t('QnAAsk.form.title', 'Title')} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-[16px]" />
        <textarea placeholder={t('QnAAsk.form.content', 'Content')} value={content} onChange={(e) => setContent(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-[16px] h-36" />

        <div>
          <div className="text-[16px] font-semibold text-gray-700 mb-2">{t('QnAAsk.form.uploadImage', 'Upload Image')}</div>
          <label className="flex items-center gap-2 cursor-pointer text-[#FF8FA9] text-[16px]">
            <Image src="/upload.svg" alt="Upload" width={20} height={20} />
            <span>{t('QnAAsk.form.upload', 'Upload')}</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {imagePreview && (
            <div className="relative mt-2 w-[120px] h-[120px]">
              <Image src={imagePreview} alt="preview" width={120} height={120} className="rounded-lg" />
                    {/* 삭제 아이콘 */}
              <button
                onClick={onDeletePreview}
                className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button className="w-full bg-[#FF8FA9] text-white font-semibold py-3 rounded-xl mt-6" onClick={handleSubmit}>
          {t('QnAAsk.form.submit', 'Submit')}
        </button>
      </div>

      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white text-[16px] py-2 px-4 rounded-full shadow-lg animate-fade-in-out">
          {toastMessage}
        </div>
      )}

            <AlertModal
              isOpen={alert.open}
              onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
              title={alert.title}
              description={alert.description}
              buttonText={alert.buttonText}
              />
    </div>
  );
}