'use client';

import React from 'react';
import { Search, X, MapPin, Tag, Check, Filter } from 'lucide-react';
import { PostType, Category, Campus } from '@/types/post';

interface FilterBarProps {
  typeFilter: 'all' | PostType;
  setTypeFilter: (t: 'all' | PostType) => void;
  categoryFilter: 'all' | Category;
  setCategoryFilter: (c: 'all' | Category) => void;
  campusFilter: 'all' | Campus;
  setCampusFilter: (c: 'all' | Campus) => void;
  searchKeyword: string;
  setSearchKeyword: (s: string) => void;
  showDone: boolean;
  setShowDone: (b: boolean) => void;
  totalFilteredCount: number;
}

const CATEGORIES: Category[] = [
  'Điện thoại',
  'Thẻ SV',
  'Thẻ giữ xe',
  'Chìa khóa',
  'Balo/Túi',
  'Ví',
  'Laptop/Tai nghe',
  'Khác',
];

const CAMPUSES: Campus[] = [
  'Cơ sở 1 (Lý Thường Kiệt)',
  'Cơ sở 2 (Dĩ An)',
];

export default function FilterBar({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  campusFilter,
  setCampusFilter,
  searchKeyword,
  setSearchKeyword,
  showDone,
  setShowDone,
  totalFilteredCount,
}: FilterBarProps) {
  const hasActiveFilters =
    categoryFilter !== 'all' || campusFilter !== 'all' || searchKeyword.trim() !== '' || showDone;

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setCampusFilter('all');
    setSearchKeyword('');
    setShowDone(false);
  };

  return (
    <div
      id="filter-section"
      className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm mb-6 space-y-3.5"
    >
      {/* HÀNG 1: SEGMENTED CONTROLS & TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmented Filter Pills */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl max-w-full overflow-x-auto border border-slate-200/60">
          <button
            id="tab-filter-all"
            onClick={() => setTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>

          <button
            id="tab-filter-lost"
            onClick={() => setTypeFilter('lost')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              typeFilter === 'lost'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
            Tôi bị mất
          </button>

          <button
            id="tab-filter-found"
            onClick={() => setTypeFilter('found')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              typeFilter === 'found'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            Tôi nhặt được
          </button>
        </div>

        {/* Tactile Switch cho tin Đã xong */}
        <label
          htmlFor="checkbox-show-done"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <input
            type="checkbox"
            id="checkbox-show-done"
            checked={showDone}
            onChange={(e) => setShowDone(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span>Hiện cả tin đã tìm thấy</span>
        </label>
      </div>

      {/* HÀNG 2: THANH TÌM KIẾM KEYBOARD-FRIENDLY */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="input-search-keyword"
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Tìm theo từ khóa (VD: chìa khóa wave, thẻ SV, AirPods, thư viện...)"
          className="w-full pl-9 pr-14 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
          {searchKeyword ? (
            <button
              onClick={() => setSearchKeyword('')}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* HÀNG 3: DROPDOWNS PHÂN LOẠI & CƠ SỞ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <select
            id="select-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả loại đồ vật</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <select
            id="select-campus-filter"
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value as any)}
            className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả cơ sở HCMUT</option>
            {CAMPUSES.map((cam) => (
              <option key={cam} value={cam}>
                {cam}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* HÀNG 4: THỐNG KÊ KẾT QUẢ VÀ NÚT RESET */}
      <div className="flex items-center justify-between pt-1 text-xs text-slate-500 font-mono">
        <div>
          Hiển thị <span className="text-slate-900 font-bold">{totalFilteredCount}</span> tin phù hợp
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1 font-sans"
          >
            <X className="w-3 h-3" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>
    </div>
  );
}
