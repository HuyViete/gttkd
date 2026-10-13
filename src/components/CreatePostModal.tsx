'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Upload,
  ShieldAlert,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  AlertCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { PostType, Category, Campus, ContactType, CreatePostInput } from '@/types/post';
import { createPost, uploadImage } from '@/lib/postsService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
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

export default function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  // Form states
  const [type, setType] = useState<PostType>('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Chìa khóa');
  const [campus, setCampus] = useState<Campus>('Cơ sở 1 (Lý Thường Kiệt)');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetAndClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  const [contactType, setContactType] = useState<ContactType>('Zalo');
  const [contactValue, setContactValue] = useState('');
  const [contactName, setContactName] = useState('');

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status & Success state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Ảnh không được vượt quá 2MB theo quy định.');
      return;
    }

    setErrorMsg(null);
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleCopyCode = async () => {
    if (!createdCode) return;
    try {
      await navigator.clipboard.writeText(createdCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề bài đăng.');
      return;
    }
    if (title.length > 80) {
      setErrorMsg('Tiêu đề không được vượt quá 80 ký tự.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Vui lòng nhập vị trí cụ thể (nhà xe, phòng học, thư viện...).');
      return;
    }
    if (!contactValue.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại hoặc liên kết Facebook.');
      return;
    }

    try {
      setLoading(true);
      let uploadedUrl: string | undefined = undefined;

      if (imageFile) {
        uploadedUrl = await uploadImage(imageFile);
      }

      const postInput: CreatePostInput = {
        type,
        title: title.trim(),
        category,
        campus,
        location: location.trim(),
        date,
        description: description.trim() || undefined,
        image_url: uploadedUrl,
        contact_type: contactType,
        contact_value: contactValue.trim(),
        contact_name: contactName.trim() || undefined,
      };

      const result = await createPost(postInput);

      // Trigger celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setCreatedCode(result.manage_code);
      setCreatedPostId(result.post.id);

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã xảy ra lỗi khi tạo bài đăng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setCreatedCode(null);
    setCreatedPostId(null);
    setTitle('');
    setLocation('');
    setDescription('');
    setContactValue('');
    setContactName('');
    handleRemoveImage();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-lg">
              {createdCode ? 'Đăng tin thành công!' : 'Đăng tin tìm đồ / Nhặt được'}
            </span>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {createdCode ? (
            /* MÀN HÌNH ĐĂNG THÀNH CÔNG & HIỆN MÃ QUẢN LÝ (Mục 6 #3) */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  Bài đăng của bạn đã được lưu!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Dưới đây là mã quản lý bài đăng của bạn. Dùng mã này để đánh dấu{' '}
                  <strong className="text-slate-900">&ldquo;Đã tìm thấy / Đã trả&rdquo;</strong> khi hoàn tất.
                </p>
              </div>

              {/* MÃ QUẢN LÝ NỔI BẬT */}
              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300">
                <span className="text-xs uppercase font-bold text-amber-700 tracking-wider block mb-1">
                  Mã quản lý của bạn (6 ký tự)
                </span>
                <div className="text-3xl font-black font-mono tracking-widest text-slate-900 mb-3">
                  {createdCode}
                </div>
                <button
                  id="btn-copy-manage-code"
                  onClick={handleCopyCode}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã sao chép mã!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép mã này</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-left max-w-md mx-auto flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Lưu ý quan trọng:</strong> Mã này chỉ hiển thị một lần duy nhất tại đây. Hãy chụp màn hình hoặc sao chép mã để sau này đóng bài đăng nhé!
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href={`/post/${createdPostId}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  <span>Xem tin của tôi</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            /* FORM ĐĂNG TIN */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* LỰA CHỌN: TÔI BỊ MẤT / TÔI NHẶT ĐƯỢC */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bạn muốn đăng tin gì? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('lost')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      type === 'lost'
                        ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Tôi bị mất đồ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('found')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      type === 'found'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Tôi nhặt được đồ</span>
                  </button>
                </div>
              </div>

              {/* TIÊU ĐỀ */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="post-title" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tiêu đề bài đăng <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{title.length}/80 ký tự</span>
                </div>
                <input
                  id="post-title"
                  type="text"
                  maxLength={80}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === 'lost'
                      ? 'VD: Mất chùm chìa khóa xe Wave, có móc gấu dâu đỏ'
                      : 'VD: Nhặt được thẻ sinh viên kẹt ở lầu 2 thư viện'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* LOẠI ĐỒ & CƠ SỞ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="post-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Loại đồ vật <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="post-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="post-campus" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cơ sở HCMUT <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="post-campus"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value as Campus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {CAMPUSES.map((cam) => (
                      <option key={cam} value={cam}>
                        {cam}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* VỊ TRÍ CỤ THỂ & NGÀY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="post-location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Vị trí cụ thể <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="post-location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="VD: Nhà xe B1, Thư viện, Canteen B6, Tòa H6..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="post-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ngày xảy ra <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="post-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* MÔ TẢ ĐẶC ĐIỂM NHẬN DẠNG */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="post-description" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mô tả đặc điểm nhận dạng
                  </label>
                  <span className="text-[11px] text-slate-400">{description.length}/500 ký tự</span>
                </div>
                <textarea
                  id="post-description"
                  rows={3}
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    type === 'found'
                      ? 'Gợi ý: Chỉ mô tả đặc điểm chung, KHÔNG nên ghi hết các chi tiết bí mật để người nhận xác minh.'
                      : 'Mô tả màu sắc, vết xước, hình dán, hoặc đồ đạc kèm theo để người nhặt nhận biết...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* TẢI ẢNH (<= 2MB) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ảnh đồ vật (Tùy chọn, tối đa 2MB)
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 text-xs text-slate-600 truncate">
                      <div className="font-semibold text-slate-800 truncate">{imageFile?.name}</div>
                      <div className="text-slate-400">{((imageFile?.size || 0) / 1024).toFixed(1)} KB</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="upload-post-image"
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl cursor-pointer transition-all text-center"
                  >
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      Bấm vào đây để tải ảnh lên
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Hỗ trợ JPG, PNG, WEBP (tối đa 2MB)
                    </span>
                    <input
                      id="upload-post-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* KÊNH LIÊN HỆ */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Kênh liên hệ (Người khác sẽ liên hệ với bạn qua đây)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Kênh liên lạc <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value as ContactType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="Zalo">Zalo</option>
                      <option value="SĐT">Số điện thoại</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {contactType === 'Facebook' ? 'Link Facebook' : 'Số điện thoại'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      placeholder={
                        contactType === 'Facebook'
                          ? 'https://facebook.com/username'
                          : '09xxxxxxxx'
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Tên hiển thị (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="VD: Minh K23"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* LƯU Ý AN TOÀN TRÊN FORM (MỤC 7 PRD) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Quy tắc an toàn & bảo vệ quyền riêng tư
                </div>
                <ul className="list-disc pl-4 space-y-1 text-amber-800/90 text-[11px] leading-relaxed">
                  <li>
                    <strong>Che thông tin nhạy cảm:</strong> Tuyệt đối không đăng rõ số CCCD, MSSV, mã số thẻ ngân hàng.
                  </li>
                  <li>
                    <strong>Giữ lại đặc điểm xác minh:</strong> Nếu bạn nhặt được đồ, hãy giữ lại 1 chi tiết nhỏ bí mật để đối chiếu khi người liên hệ mô tả lại.
                  </li>
                  <li>
                    <strong>Địa điểm trao trả:</strong> Luôn hẹn giao trả tại nơi công cộng (Bàn bảo vệ, thư viện, sảnh nhà trường).
                  </li>
                </ul>
              </div>

              {/* FOOTER NÚT SUBMIT */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  id="btn-submit-post"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Đang xử lý...' : 'Đăng tin ngay'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
