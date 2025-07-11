"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import Navbar from "../../components/common/Navbar";
import NotificationBar from "../../components/home/NotificationBar";
import MainScrollSlider from "../../components/home/MainScrollSlider";
import Footer from "../../components/common/Footer";
import TicketSection from "../../components/home/TicketSection";
import Loading from "../../components/common/Loading"; // ✅ 추가
import { useAuthStore } from "@/stores/useAuthStore"; // zustand import 추가
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuthStore(); // ✅ 유저 상태 접근
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // ✅ Flutter에서 호출할 수 있도록 전역 함수 정의
      (window as any).noticeFromPush = function (pathWithQuery: string) {
        console.log("📥 Flutter에서 받은 pathWithQuery:", pathWithQuery);
        // 예시: 해당 경로로 이동
        // window.location.href = pathWithQuery;

        router.push(pathWithQuery)
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
    if (auth.isLoggedIn && typeof window !== "undefined" && (window as any).LoginChannel) {
      const payload = {
        user_id: auth.member?.member_id ?? "",
        email: auth.member?.email ?? "",
        firstname: auth.member?.Name_1st ?? "",
        lastname : auth.member?.Name_3rd ?? "",
        member_idx: auth.member?.idx ?? 0, // ✅ 추가됨
      };
  
      (window as any).LoginChannel.postMessage(JSON.stringify(payload));
      console.log("✅ Flutter에 유저 정보 전달:", payload);
    }
  }, [auth.isLoggedIn, auth.member]);
  
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
      <div>
        <MainScrollSlider />
      </div>
      <div>
        <TicketSection />
      </div>
      <div className="pt-6">
        <Footer />
      </div>
      <div className="fixed bottom-0 left-0 w-full max-w-[430px] mx-auto z-50">
        <Navbar />
      </div>
    </div>
  );
}
