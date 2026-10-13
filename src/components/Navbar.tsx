import React from 'react';
import Link from 'next/link';
import { PlusCircle, Info, HeartHandshake, Search } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal?: () => void;
}

export default function Navbar({ onOpenCreateModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO & BRANDING */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#002855] via-blue-900 to-sky-600 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-all">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                  Bách Khoa <span className="text-sky-600">Finds</span> & Shares
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded">
                  HCMUT
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                Cổng tìm đồ thất lạc sinh viên 2 cơ sở
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-100/80 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-100/80 transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Về dự án IM3047</span>
            </Link>
          </nav>

          {/* ACTION BUTTON */}
          <div className="flex items-center gap-2">
            <Link
              href="/about"
              className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Về dự án"
            >
              <Info className="w-5 h-5" />
            </Link>

            {onOpenCreateModal ? (
              <button
                id="btn-nav-create-post"
                onClick={onOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#002855] hover:bg-[#003875] text-white text-xs sm:text-sm font-bold shadow-sm ring-1 ring-white/10 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Đăng tin</span>
              </button>
            ) : (
              <Link
                href="/?create=true"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#002855] hover:bg-[#003875] text-white text-xs sm:text-sm font-bold shadow-sm ring-1 ring-white/10 transition-all"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Đăng tin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
