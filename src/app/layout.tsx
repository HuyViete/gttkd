import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bách Khoa Finds & Shares | Web App Tìm Đồ Thất Lạc Sinh Viên HCMUT',
  description:
    'Cổng thông tin tìm đồ thất lạc tập trung dành riêng cho sinh viên Trường Đại học Bách Khoa – ĐHQG-HCM. Hỗ trợ cả Cơ sở 1 (Lý Thường Kiệt) và Cơ sở 2 (Dĩ An).',
  keywords: [
    'Bách Khoa',
    'HCMUT',
    'Tìm đồ thất lạc',
    'Bách Khoa Finds & Shares',
    'Đại học Bách Khoa',
    'Sinh viên HCMUT',
    'Lost and Found',
  ],
  authors: [{ name: 'HCMUT Student Community Project - IM3047' }],
  openGraph: {
    title: 'Bách Khoa Finds & Shares | Web App Tìm Đồ Thất Lạc Sinh Viên HCMUT',
    description:
      'Nền tảng kết nối trực tiếp người mất và người nhặt đồ tại 2 cơ sở ĐH Bách Khoa TP.HCM.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
