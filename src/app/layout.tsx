import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "زلزله‌نگار آریان",
  description: "رصد لحظه‌ای زلزله‌های ایران و جهان همراه با هشدار هوشمند زلزله",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "زلزله‌نگار آریان",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-slate-950 font-sans text-slate-50 antialiased">
        <ServiceWorkerRegister />
        <Header />
        <main className="mx-auto w-full max-w-md flex-1 pb-24">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
