-- ====================================================================
-- BÁCH KHOA FINDS & SHARES - DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Project: IM3047 Business Communication - HCMUT Community Project
-- ====================================================================

-- 1. TẠO BẢNG POSTS
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('lost', 'found')),
  title VARCHAR(80) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (
    category IN (
      'Điện thoại', 'Thẻ SV', 'Thẻ giữ xe', 'Chìa khóa', 
      'Balo/Túi', 'Ví', 'Laptop/Tai nghe', 'Khác'
    )
  ),
  description VARCHAR(500),
  campus VARCHAR(50) NOT NULL CHECK (
    campus IN ('Cơ sở 1 (Lý Thường Kiệt)', 'Cơ sở 2 (Dĩ An)')
  ),
  location VARCHAR(150) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('Zalo', 'Facebook', 'SĐT')),
  contact_value TEXT NOT NULL,
  contact_name VARCHAR(50),
  status VARCHAR(10) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'done')),
  manage_code VARCHAR(6) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TẠO INDEXES TỐI ƯU TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_posts_type ON public.posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_campus ON public.posts(campus);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- 3. TẠO STORED PROCEDURE ĐÁNH DẤU "ĐÃ XONG" BẰNG MÃ QUẢN LÝ 6 KÝ TỰ
-- Hàm này chạy với quyền SECURITY DEFINER để bảo mật mã quản lý không bị lộ ra ngoài
CREATE OR REPLACE FUNCTION public.mark_post_done(post_id UUID, input_code VARCHAR(6))
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_post RECORD;
BEGIN
  -- Tìm bài đăng
  SELECT id, manage_code, status INTO target_post
  FROM public.posts
  WHERE id = post_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Không tìm thấy bài đăng.');
  END IF;

  IF target_post.status = 'done' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Bài đăng này đã được đánh dấu hoàn tất trước đó.');
  END IF;

  -- Kiểm tra mã (không phân biệt hoa thường)
  IF UPPER(target_post.manage_code) = UPPER(input_code) THEN
    UPDATE public.posts
    SET status = 'done'
    WHERE id = post_id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Đã chuyển trạng thái sang Hoàn tất thành công!');
  ELSE
    RETURN jsonb_build_object('success', false, 'message', 'Mã quản lý 6 ký tự không chính xác. Vui lòng thử lại!');
  END IF;
END;
$$;

-- 4. BẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc danh sách tin công khai (anon select)
CREATE POLICY "Public Read Access"
ON public.posts
FOR SELECT
TO public
USING (true);

-- Cho phép người dùng đăng tin mới mà không cần tài khoản
CREATE POLICY "Public Insert Access"
ON public.posts
FOR INSERT
TO public
WITH CHECK (true);

-- ====================================================================
-- 5. CẤU HÌNH SUPABASE STORAGE CHO BUCKET ẢNH 'post-images'
-- ====================================================================
-- Chạy phần này nếu bạn muốn tự động tạo Storage bucket qua SQL
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images', 
  'post-images', 
  true, 
  2097152, -- 2MB giới hạn tối đa theo PRD
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152;

-- Policy cho phép mọi người xem ảnh
CREATE POLICY "Public Read Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');

-- Policy cho phép mọi người upload ảnh (<= 2MB)
CREATE POLICY "Public Upload Images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'post-images');
