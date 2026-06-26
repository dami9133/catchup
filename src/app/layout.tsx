import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { NavigationWrapper } from "@/components/NavigationWrapper";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "캐치업 - 커리어 페르소나 매칭",
  description: "당신에게 딱 맞는 진로를 찾아보세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} antialiased bg-slate-100 flex justify-center`}
      >
        <div className="w-full max-w-[480px] h-[100dvh] bg-white shadow-2xl relative overflow-hidden flex flex-col border-x border-slate-200">
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </div>
      </body>
    </html>
  );
}
