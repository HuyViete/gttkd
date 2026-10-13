import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  HeartHandshake,
  ShieldCheck,
  MapPin,
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Giới thiệu dự án | Bách Khoa Finds & Shares - HCMUT',
  description: 'Dự án cộng đồng tìm đồ thất lạc cho sinh viên HCMUT - Môn IM3047 Business Communication',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* HERO TITLE */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Community Project • IM3047 Business Communication</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Về dự án Bách Khoa Finds & Shares
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Nền tảng kết nối tìm kiếm và trao trả đồ thất lạc dành riêng cho sinh viên Trường Đại học Bách Khoa – ĐHQG-HCM.
          </p>
        </div>

        {/* THÔNG TIN MÔN HỌC & BỐI CẢNH */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              BK
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dự án phục vụ cộng đồng Bách Khoa
              </h2>
              <p className="text-xs text-slate-500">
                Khoa Quản Lý Công Nghiệp (SIM) & Đại học Bách Khoa TP.HCM
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Vấn đề thực tế:</strong> Mỗi học kỳ, sinh viên Bách Khoa làm rơi và để quên hàng trăm món đồ giá trị như thẻ sinh viên, chìa khóa xe máy, AirPods, laptop, củ sạc, ví tiền... Tuy nhiên, các bài đăng trên Facebook confession hay hội nhóm Zalo bị phân tán, trôi tin rất nhanh và khó tìm kiếm lại.
            </p>
            <p>
              <strong>Giải pháp của nhóm:</strong> <em>Bách Khoa Finds & Shares</em> ra đời nhằm cung cấp một cổng tập trung, gọn nhẹ, không yêu cầu đăng nhập rườm rà. Bất kỳ bạn sinh viên nào cũng có thể đăng tin trong chưa đầy 1 phút và kết nối nhanh qua Zalo / Facebook / Điện thoại.
            </p>
          </div>
        </div>

        {/* HƯỚNG DẪN 3 BƯỚC */}
        <div className="mb-10">
          <h3 className="text-xl font-extrabold text-slate-900 text-center mb-6">
            Quy trình sử dụng 3 bước đơn giản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Đăng tin nhanh</h4>
              <p className="text-xs text-slate-500">
                Điền thông tin món đồ, chụp ảnh (đã che thông tin nhạy cảm) và để lại phương thức liên hệ.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 font-extrabold flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Kết nối trực tiếp</h4>
              <p className="text-xs text-slate-500">
                Người mất hoặc người nhặt bấm liên hệ qua Zalo/FB. Xác minh đặc điểm nhận dạng và hẹn gặp.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Đóng bài đăng</h4>
              <p className="text-xs text-slate-500">
                Nhập mã quản lý 6 ký tự để đánh dấu &ldquo;Đã xong&rdquo;, tránh nhận thêm liên hệ nhầm lẫn.
              </p>
            </div>
          </div>
        </div>

        {/* ĐỊA ĐIỂM GIAO NHẬN ĐỒ AN TOÀN TẠI HCMUT */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold">Gợi ý địa điểm bàn giao đồ an toàn tại trường</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Để đảm bảo an toàn cho cả hai bên, hãy ưu tiên hẹn gặp tại những điểm công cộng có bảo vệ hoặc camera an ninh:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 space-y-2">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Cơ sở 1 (Lý Thường Kiệt, Q.10)
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-200">
                <li>Phòng trực bảo vệ Cổng A2 (Lý Thường Kiệt) hoặc Cổng Tô Hiến Thành</li>
                <li>Sảnh Thư viện Trung tâm Tòa A2</li>
                <li>Canteen B6 hoặc Quầy trà sữa khuôn viên B1</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 space-y-2">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Cơ sở 2 (Khu đô thị ĐHQG Dĩ An)
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-200">
                <li>Sảnh trệt Tòa H6 (Gần bàn bảo vệ)</li>
                <li>Bàn tự học sảnh Thư viện Trung tâm ĐHQG</li>
                <li>Văn phòng Quản lý Ký túc xá Khu B</li>
              </ul>
            </div>
          </div>
        </div>

        {/* NÚT QUAY LẠI TRANG CHỦ */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>Trở về Trang chủ tìm kiếm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
