import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Thông tin dự án */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-slate-900 text-base">
                Bách Khoa Finds & Shares
              </span>
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                MVP v1.0
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Dự án kết nối cộng đồng tìm đồ thất lạc dành riêng cho sinh viên Trường Đại học Bách Khoa – ĐHQG-HCM. Giúp sinh viên tìm lại đồ nhanh chóng, một nơi tập trung và hoàn toàn miễn phí.
            </p>
            <p className="text-xs text-slate-400">
              Môn học: <strong>IM3047 Business Communication</strong> – Học kỳ 261
            </p>
          </div>

          {/* Cột 2: Quy tắc an toàn */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Lưu ý an toàn & Quyền riêng tư
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Luôn che ảnh thông tin nhạy cảm: MSSV, CCCD, thẻ ngân hàng.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Người nhặt được nên giữ lại chi tiết bí mật để người mất xác minh.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Hẹn nhận lại đồ tại các điểm công cộng: Phòng bảo vệ, Thư viện, Căn tin.</span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Phạm vi hỗ trợ */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Phạm vi hỗ trợ 2 Cơ sở
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                <div className="font-semibold text-slate-800">Cơ sở 1 (Q.10)</div>
                <div>268 Lý Thường Kiệt, P.14, Quận 10, TP.HCM</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                <div className="font-semibold text-slate-800">Cơ sở 2 (Dĩ An)</div>
                <div>Khu Đô thị ĐHQG-HCM, TP. Dĩ An, Bình Dương</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>Xây dựng với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>bởi Nhóm sinh viên HCMUT</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              Về dự án
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
