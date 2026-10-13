'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { markPostDone } from '@/lib/postsService';

interface VerifyDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  onSuccess: () => void;
}

export default function VerifyDoneModal({
  isOpen,
  onClose,
  postId,
  postTitle,
  onSuccess,
}: VerifyDoneModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Tự động viết hoa và giới hạn 6 ký tự
    const val = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 6);
    setCode(val);
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMsg('Vui lòng nhập đủ 6 ký tự mã quản lý.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const result = await markPostDone(postId, code);

      if (!result.success) {
        setErrorMsg(result.message);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
      }

      // Thành công: Bắn pháo hoa & thông báo
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi xác minh mã quản lý');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Xác minh người đăng bài
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <p className="text-xs text-slate-500 mb-1">Đánh dấu hoàn tất cho bài đăng:</p>
            <p className="text-sm font-bold text-slate-800 line-clamp-2">
              &ldquo;{postTitle}&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600">
            Nhập <strong>mã quản lý 6 ký tự</strong> bạn đã nhận được khi tạo bài đăng để chuyển trạng thái sang{' '}
            <span className="font-semibold text-emerald-700">&ldquo;Đã tìm thấy / Đã trả&rdquo;</span>.
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="input-manage-code"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center"
            >
              Mã quản lý (6 ký tự)
            </label>
            <div className="flex justify-center">
              <input
                id="input-manage-code"
                type="text"
                autoFocus
                value={code}
                onChange={handleCodeChange}
                placeholder="BK••••"
                className="w-48 text-center text-2xl font-black font-mono tracking-widest py-3 px-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 bg-slate-50 uppercase"
              />
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Ví dụ: BK8291, BK1102...
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              id="btn-confirm-mark-done"
              type="submit"
              disabled={loading || code.length !== 6}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                'Đang xác nhận...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận Đã Xong</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
