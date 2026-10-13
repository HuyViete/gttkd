'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import FilterBar from '@/components/FilterBar';
import PostCard from '@/components/PostCard';
import CreatePostModal from '@/components/CreatePostModal';
import { Post, PostType, Category, Campus } from '@/types/post';
import { getPosts } from '@/lib/postsService';
import { Plus, SearchX, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Bộ lọc
  const [typeFilter, setTypeFilter] = useState<'all' | PostType>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [campusFilter, setCampusFilter] = useState<'all' | Campus>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showDone, setShowDone] = useState(false);

  // Load danh sách bài đăng
  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Lỗi khi tải bài đăng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();

    // Check query params if ?create=true
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('create') === 'true') {
        setIsCreateOpen(true);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        const searchInput = document.getElementById('input-search-keyword');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Đếm số lượng tin open và done
  const openCount = useMemo(() => posts.filter((p) => p.status === 'open').length, [posts]);
  const doneCount = useMemo(() => posts.filter((p) => p.status === 'done').length, [posts]);

  // Lọc và tìm kiếm danh sách bài đăng
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Lọc theo trạng thái hoàn tất (Nếu không check showDone thì ẩn bài done)
      if (!showDone && post.status === 'done') {
        return false;
      }

      // 2. Lọc theo loại (Lost / Found / All)
      if (typeFilter !== 'all' && post.type !== typeFilter) {
        return false;
      }

      // 3. Lọc theo danh mục
      if (categoryFilter !== 'all' && post.category !== categoryFilter) {
        return false;
      }

      // 4. Lọc theo cơ sở
      if (campusFilter !== 'all' && post.campus !== campusFilter) {
        return false;
      }

      // 5. Tìm kiếm theo từ khóa (tiêu đề + mô tả + địa điểm)
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase().trim();
        const titleMatch = post.title.toLowerCase().includes(query);
        const descMatch = (post.description || '').toLowerCase().includes(query);
        const locMatch = post.location.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !locMatch) {
          return false;
        }
      }

      return true;
    });
  }, [posts, typeFilter, categoryFilter, campusFilter, searchKeyword, showDone]);

  const scrollToSearch = () => {
    const el = document.getElementById('filter-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* THANH ĐIỀU HƯỚNG */}
      <Navbar onOpenCreateModal={() => setIsCreateOpen(true)} />

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* HERO BANNER */}
        <HeroBanner
          onOpenCreate={() => setIsCreateOpen(true)}
          onScrollToSearch={scrollToSearch}
          openCount={openCount}
          doneCount={doneCount}
        />

        {/* BỘ LỌC VÀ TÌM KIẾM (F1) */}
        <FilterBar
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          campusFilter={campusFilter}
          setCampusFilter={setCampusFilter}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          showDone={showDone}
          setShowDone={setShowDone}
          totalFilteredCount={filteredPosts.length}
        />

        {/* DANH SÁCH BÀI ĐĂNG (LƯỚI CARD) */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Đang tải danh sách bài đăng...</span>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          /* TRẠNG THÁI KHÔNG TÌM THẤY KẾT QUẢ */
          <div className="py-16 px-4 bg-white rounded-3xl border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Không tìm thấy tin nào phù hợp
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc danh mục và cơ sở.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setCategoryFilter('all');
                  setCampusFilter('all');
                  setSearchKeyword('');
                  setShowDone(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                + Đăng tin mới
              </button>
            </div>
          </div>
        )}
      </main>

      {/* NÚT NỔI MOBILE ĐĂNG TIN NHANH (FLOATING ACTION BUTTON) */}
      <div className="fixed bottom-6 right-6 z-30 sm:hidden">
        <button
          id="btn-fab-create-post"
          onClick={() => setIsCreateOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
          title="Đăng tin mới"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* MODAL TẠO BÀI ĐĂNG */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={loadPosts}
      />
    </div>
  );
}
