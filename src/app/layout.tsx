// src/app/layout.tsx

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import RootProvider from "./rootProvider";
import LanguageInitializer from "../../components/setting/LanguageInitializer";
import KeyboardHeightAdjuster from "../../components/common/KeyboardHeightAdjuster";

export const metadata: Metadata = {
  title: "CONCONTOWN",
  description: "콘콘타운에 오신 것을 환영합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-smtown">
      <head>
      <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        

        <Script id="disable-zoom" strategy="beforeInteractive">
          {`
            document.addEventListener('gesturestart', function (e) {
              e.preventDefault();
            });
            document.addEventListener('gesturechange', function (e) {
              e.preventDefault();
            });
            document.addEventListener('gestureend', function (e) {
              e.preventDefault();
            });
          `}
        </Script>
      </head>
      <body className="max-w-[430px] w-full mx-auto bg-white text-black">
        <LanguageInitializer />
        <KeyboardHeightAdjuster />
        <RootProvider>
          <Script
            src="https://js.tosspayments.com/v1/payment-widget"
            strategy="afterInteractive"
          />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
