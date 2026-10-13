'use client';

import React from 'react';
import { PlusCircle, Search, Sparkles, MapPin } from 'lucide-react';

interface HeroBannerProps {
  onOpenCreate: () => void;
  onScrollToSearch: () => void;
  openCount: number;
  doneCount: number;
}

export default function HeroBanner({
  onOpenCreate,
  onScrollToSearch,
  openCount,
  doneCount,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#002855] text-white p-6 sm:p-8 mb-6 shadow-sm border border-slate-800/80 bg-tech-grid">
      {/* Subtle depth lighting */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Eyebrow: exactly 1 allowed, subtle mono styling */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-sky-200 text-xs font-mono mb-3 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-sky-300" />
          <span>IM3047 Business Communication • HCMUT</span>
        </div>

        {/* Headline: max 2 lines */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
          Cổng tìm đồ thất lạc sinh viên{' '}
          <span className="text-sky-300">Bách Khoa</span>
        </h1>

        {/* Subtext: under 20 words as mandated by Taste Skill v2 */}
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-5 max-w-xl">
          Một nơi tập trung đăng tin mất đồ và nhặt được. Kết nối nhanh qua Zalo, Facebook, SĐT tại cả hai cơ sở.
        </p>

        {/* CTAs: 1 primary + 1 secondary */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <button
            id="btn-hero-create"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Đăng tin tìm đồ</span>
          </button>

          <button
            id="btn-hero-search"
            onClick={onScrollToSearch}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-300" />
            <span>Tìm kiếm danh sách</span>
          </button>
        </div>

        {/* Live Status Indicators (Metrics Strip) */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <div>
              <span className="font-bold text-white text-sm">{openCount}</span>
              <span className="text-slate-300 text-[11px] block">Tin đang tìm</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <span className="font-bold text-white text-sm">{doneCount}</span>
              <span className="text-slate-300 text-[11px] block">Đã tìm thấy</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <div>
              <span className="font-bold text-white text-sm">CS1 & CS2</span>
              <span className="text-slate-300 text-[11px] block">Q.10 & Dĩ An</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
