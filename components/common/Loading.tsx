"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      {/* ✅ 핑크색 스피너 */}
      <div className="w-8 h-8 border-4 border-[#FF8FA9] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[16px] mt-4 font-medium text-gray-600">Loading...</p>
    </div>
  );
}
