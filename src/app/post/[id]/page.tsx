'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerifyDoneModal from '@/components/VerifyDoneModal';
import CreatePostModal from '@/components/CreatePostModal';
import { Post } from '@/types/post';
import { getPostById, getPosts } from '@/lib/postsService';
import { formatDate, formatRelativeTime, getZaloUrl, getFacebookUrl } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ShieldAlert,
  CheckCircle2,
  KeyRound,
  ExternalLink,
  PackageOpen,
  Share2,
} from 'lucide-react';

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function DetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-20 text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Đang tải thông tin bài đăng...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function PostDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const data = await getPostById(id);
      setPost(data);

      if (data) {
        const all = await getPosts();
        // Lấy các bài liên quan cùng cơ sở hoặc loại đồ
        const related = all
          .filter((p) => p.id !== data.id && (p.category === data.category || p.campus === data.campus))
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết bài:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  const handleCopyContact = async () => {
    if (!post?.contact_value) return;
    try {
      await navigator.clipboard.writeText(post.contact_value);
      setCopiedContact(true);
      setTimeout(() => setCopiedContact(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 text-slate-400">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium">Đang tải thông tin bài đăng...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy bài đăng</h2>
          <p className="text-sm text-slate-500 mb-6">
            Bài đăng này có thể đã bị gỡ bỏ hoặc liên kết không chính xác.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLost = post.type === 'lost';
  const isDone = post.status === 'done';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onOpenCreateModal={() => setIsCreateOpen(true)} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* NÚT QUAY LẠI & CHIA SẺ */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </Link>

          <button
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã sao chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ tin này</span>
              </>
            )}
          </button>
        </div>

        {/* KHỐI NỘI DUNG CHÍNH (CARD TO) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* BANNER THÔNG BÁO HOÀN TẤT */}
          {isDone && (
            <div className="bg-emerald-500 text-white px-6 py-3 text-center text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>
                Tin này đã được đánh dấu &ldquo;ĐÃ TÌM THẤY / ĐÃ TRẢ LẠI&rdquo;. Cảm ơn cộng đồng HCMUT!
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* CỘT TRÁI: ẢNH LỚN */}
            <div className="md:col-span-5 bg-slate-100 p-4 sm:p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-200">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-inner">
                {post.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className={`w-full h-full object-cover ${isDone ? 'grayscale-[40%]' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <PackageOpen className="w-16 h-16 mb-2 text-slate-300" />
                    <span className="text-sm font-medium text-slate-500">
                      Người đăng không đính kèm ảnh
                    </span>
                  </div>
                )}

                {/* Badge đè trên ảnh */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {isLost ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-rose-600 text-white shadow-md">
                      Tôi bị mất
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-600 text-white shadow-md">
                      Nhặt được
                    </span>
                  )}
                </div>
              </div>

              {/* Gợi ý xác minh ảnh */}
              <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
                Ảnh minh họa / thực tế do người đăng cung cấp. Hãy kiểm tra kỹ đặc điểm khi nhận lại.
              </p>
            </div>

            {/* CỘT PHẢI: CHI TIẾT TIN & NÚT LIÊN HỆ */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Tag & Campus */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {post.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {post.campus}
                  </span>
                </div>

                {/* Tiêu đề */}
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-4">
                  {post.title}
                </h1>

                {/* Metadata List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-150 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Vị trí cụ thể:</span>
                      <strong className="text-slate-800">{post.location}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Ngày xảy ra:</span>
                      <strong className="text-slate-800">{formatDate(post.date)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 sm:col-span-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Đăng lúc:</span>
                      <span className="text-slate-600 font-medium">
                        {formatRelativeTime(post.created_at)} ({new Date(post.created_at).toLocaleString('vi-VN')})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mô tả chi tiết */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Mô tả đặc điểm nhận dạng
                  </h3>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {post.description || 'Người đăng không để lại thêm mô tả chi tiết.'}
                  </div>
                </div>

                {/* KÊNH LIÊN HỆ NHANH (PRD F3) */}
                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-sky-50/50 border border-blue-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Thông tin liên hệ trực tiếp
                    </h3>
                    {post.contact_name && (
                      <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                        {post.contact_name}
                      </span>
                    )}
                  </div>

                  {/* CÁC NÚT BẤM LIÊN HỆ TƯƠNG ỨNG */}
                  <div className="space-y-3">
                    {post.contact_type === 'Zalo' && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <a
                          id="btn-contact-zalo"
                          href={getZaloUrl(post.contact_value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 active:scale-95 transition-all"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>Nhắn Zalo: {post.contact_value}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                        </a>
                        <button
                          onClick={handleCopyContact}
                          className="p-3 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-center cursor-pointer"
                          title="Sao chép số điện thoại Zalo"
                        >
                          {copiedContact ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {post.contact_type === 'Facebook' && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <a
                          id="btn-contact-facebook"
                          href={getFacebookUrl(post.contact_value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all truncate"
                        >
                          <FacebookIcon className="w-4 h-4 fill-white" />
                          <span className="truncate">Mở trang Facebook</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                        </a>
                        <button
                          onClick={handleCopyContact}
                          className="p-3 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-center cursor-pointer"
                          title="Sao chép liên kết"
                        >
                          {copiedContact ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {post.contact_type === 'SĐT' && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <a
                          id="btn-contact-phone"
                          href={`tel:${post.contact_value}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Gọi điện: {post.contact_value}</span>
                        </a>
                        <button
                          onClick={handleCopyContact}
                          className="p-3 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center cursor-pointer"
                          title="Sao chép số điện thoại"
                        >
                          {copiedContact ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {copiedContact && (
                      <p className="text-center text-[11px] font-semibold text-blue-800">
                        Đã sao chép thông tin liên hệ vào bộ nhớ tạm!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* NÚT QUẢN LÝ BÀI ĐĂNG (F4 ĐÁNH DẤU "ĐÃ XONG") */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  id="btn-open-verify-done"
                  onClick={() => setIsVerifyOpen(true)}
                  disabled={isDone}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDone
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isDone ? 'Đã hoàn tất bài này' : 'Tôi là người đăng (Đánh dấu đã xong)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LƯU Ý AN TOÀN RIÊNG CHO TRANG CHI TIẾT (MỤC 7 PRD) */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-800">
              Nhắc nhở an toàn khi giao nhận đồ tại Bách Khoa
            </div>
            <p className="text-amber-800/90 leading-relaxed">
              Trang web chỉ đóng vai trò kết nối thông tin. Hai bên vui lòng tự hẹn gặp tại các địa điểm công cộng trong trường (Cổng A2 Lý Thường Kiệt, Sảnh tòa H6 Dĩ An, Thư viện, hoặc nhờ Phòng Bảo vệ giữ hộ). Người nhặt được hãy hỏi người liên hệ mô tả thêm chi tiết để chắc chắn đúng chủ nhân món đồ!
            </p>
          </div>
        </div>

        {/* BÀI ĐĂNG LIÊN QUAN */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Bài đăng liên quan tại {post.campus}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/post/${rel.id}`}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all block group"
                >
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase mb-2 ${
                      rel.type === 'lost'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {rel.type === 'lost' ? 'Mất đồ' : 'Nhặt được'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 mb-1">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{rel.location}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* MODAL NHẬP MÃ QUẢN LÝ (F4) */}
      <VerifyDoneModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        postId={post.id}
        postTitle={post.title}
        onSuccess={fetchPostData}
      />

      {/* MODAL TẠO BÀI ĐĂNG */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={() => router.push('/')}
      />
    </div>
  );
}

export default function PostDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <React.Suspense fallback={<DetailLoading />}>
      <PostDetailContent {...props} />
    </React.Suspense>
  );
}
