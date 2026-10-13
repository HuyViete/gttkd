'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { MapPin, Calendar, CheckCircle2, ChevronRight, PackageOpen } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const isLost = post.type === 'lost';
  const isDone = post.status === 'done';

  return (
    <article
      id={`post-card-${post.id}`}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isDone
          ? 'opacity-70 border-slate-200 bg-slate-50/70'
          : 'border-slate-200/90 hover:border-slate-400/80 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* KHUNG HÌNH ẢNH */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt={post.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
              isDone ? 'grayscale-[50%]' : ''
            }`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100/80">
            <PackageOpen className="w-8 h-8 mb-1 text-slate-300" />
            <span className="text-[11px] font-medium text-slate-400">Không kèm ảnh</span>
          </div>
        )}

        {/* BADGES: LOẠI TIN & TRẠNG THÁI */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {isLost ? (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-tight uppercase bg-rose-600 text-white shadow-xs">
              Mất đồ
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-tight uppercase bg-emerald-700 text-white shadow-xs">
              Nhặt được
            </span>
          )}

          {isDone && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-800 text-white shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Đã xong
            </span>
          )}
        </div>

        {/* THỜI GIAN ĐĂNG TƯƠNG ĐỐI (MONO) */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-[10px] font-mono font-medium text-white shadow-xs">
          {formatRelativeTime(post.created_at)}
        </div>
      </div>

      {/* THÔNG TIN CHI TIẾT */}
      <div className="flex flex-col flex-1 p-4">
        {/* Phân loại & Cơ sở */}
        <div className="flex items-center gap-2 mb-2 text-xs">
          <span className="px-2 py-0.5 rounded-md font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {post.category}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-mono text-[11px] truncate max-w-[160px]">
            {post.campus === 'Cơ sở 1 (Lý Thường Kiệt)' ? 'CS1: Q.10' : 'CS2: Dĩ An'}
          </span>
        </div>

        {/* Tiêu đề */}
        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
          {post.title}
        </h3>

        {/* Mô tả ngắn */}
        {post.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {post.description}
          </p>
        )}

        {/* Vị trí cụ thể & Ngày */}
        <div className="mt-auto pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-700">{post.location}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Ngày {formatDate(post.date)}</span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="mt-3.5 pt-1">
          <Link
            id={`link-view-post-${post.id}`}
            href={`/post/${post.id}`}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/60 transition-all group/btn"
          >
            <span>Chi tiết & Liên hệ</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:translate-x-0.5 group-hover/btn:text-slate-900 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
