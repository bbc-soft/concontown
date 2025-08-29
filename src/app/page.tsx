"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import Navbar from "../../components/common/Navbar";
import NotificationBar from "../../components/home/NotificationBar";
import MainScrollSlider from "../../components/home/MainScrollSlider";
import Footer from "../../components/common/Footer";
import TicketSection from "../../components/home/TicketSection";
import BottomPopup from "../../components/home/BottomPopup";
import Loading from "../../components/common/Loading"; // ✅ 추가
import { useAuthStore } from "@/stores/useAuthStore"; // zustand import 추가
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useRouter, useSearchParams } from 'next/navigation';

interface Notice {
  NOTICE_MASTER_IDX: number;
  NOTICE_SUB_IDX: number;
  TITLE: string;
  PUB_DATE: string;
  LANGUAGE_YN: string;
  READ_DATE?: string | null;
  ALL_YN?: string;
  MAIN_YN?: string;
  POPUP_YN?: string;
  LOGIN_YN?: string;
  BANNER_URL?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, member } = useAuthStore();
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const { langId } = useLanguageStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // ✅ Flutter에서 호출할 수 있도록 전역 함수 정의
      (window as any).noticeFromPush = function (pathWithQuery: string) {
        console.log("📥 Flutter에서 받은 pathWithQuery:", pathWithQuery);
        // 예시: 해당 경로로 이동
        // window.location.href = pathWithQuery;

        router.push(pathWithQuery)
      };

      (window as any).onFlutterVersionReceived = (localVersion: string, storeVersion: string) => {
        console.log('Flutter로부터 받은 버전 정보:', localVersion, storeVersion);
        localStorage.setItem('localVersion', localVersion);
        localStorage.setItem('storeVersion', storeVersion);

        // if (localVersion !== storeVersion) {
        //   alert(`업데이트가 필요합니다.\n현재 버전: ${localVersion}\n최신 버전: ${storeVersion}`);
        // }
      };
    }
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Flutter WebView로 유저 정보 전달 (최초 진입 시 1회)
  useEffect(() => {
    if (isLoggedIn && typeof window !== "undefined" && (window as any).LoginChannel) {
      const payload = {
        user_id: member?.member_id ?? "",
        email: member?.email ?? "",
        firstname: member?.Name_1st ?? "",
        lastname : member?.Name_3rd ?? "",
        member_idx: member?.idx ?? 0, // ✅ 추가됨
      };
  
      (window as any).LoginChannel.postMessage(JSON.stringify(payload));
      console.log("✅ Flutter에 유저 정보 전달:", payload);
    }

    if (isLoggedIn && typeof window !== "undefined" && window.flutter_inappwebview) {
      const payload = {
        user_id: member?.member_id ?? "",
        email: member?.email ?? "",
        firstname: member?.Name_1st ?? "",
        lastname: member?.Name_3rd ?? "",
        member_idx: member?.idx ?? 0,
      };

      window.flutter_inappwebview.callHandler('LoginChannel', JSON.stringify(payload));
      console.log("✅ Flutter에 유저 정보 전달:", payload);
    }

  }, [isLoggedIn, member]);

  useEffect(() => {
    fetchNoticeList();
  }, [langId, member]);

  const fetchNoticeList = async () => {
    if (!member?.idx) return;
      const bannerRes = await fetch(
        `/api/notice/banner?lang=${langId.toUpperCase()}&member=${member.idx}`
      );

      const bannerData = await bannerRes.json();

      setNotices(bannerData);
  };

  
  if (isLoading) {
    return <Loading />;
  }

  // 기존 컴포넌트 유지
  return (
    <div className="relative min-w-[320px] mx-auto max-w-[430px] min-h-screen bg-white overflow-hidden pb-[80px]">
      <div className="mx-4">
        <Header />
      </div>
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
        <NotificationBar />
      </div>
      {<div>
        <MainScrollSlider />
      </div>}
      <div>
        <TicketSection />
      </div>
      <div className="pt-6">
        <Footer />
      </div>
      <div className="fixed bottom-0 left-0 w-full max-w-[430px] mx-auto z-50">
        <Navbar />
      </div>
      <div>
        <BottomPopup notices={notices} />
      </div>
    </div>
  );
}
