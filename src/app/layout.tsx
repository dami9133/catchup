import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationWrapper } from "@/components/NavigationWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 flex justify-center`}
      >
        <div className="w-full max-w-[480px] h-[100dvh] bg-background shadow-2xl relative overflow-hidden flex flex-col">
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </div>
      </body>
    </html>
  );
}
