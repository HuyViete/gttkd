import { Post, CreatePostInput } from '@/types/post';
import { INITIAL_POSTS } from '@/data/seedData';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'bk_finds_shares_posts_v2';

// Tự sinh mã quản lý 6 ký tự gồm chữ và số in hoa
export function generateManageCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Loại bỏ số 0, 1, chữ O, I để tránh nhầm lẫn
  let code = 'BK';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Lấy danh sách bài đăng từ LocalStorage (chế độ demo/fallback)
function getLocalPosts(): Post[] {
  if (typeof window === 'undefined') {
    return INITIAL_POSTS;
  }
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_POSTS;
  }
}

// Lưu danh sách vào LocalStorage
function saveLocalPosts(posts: Post[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  }
}

/**
 * Lấy tất cả bài đăng
 */
export async function getPosts(): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Lỗi Supabase, chuyển sang chế độ Local/Seed:', error.message);
        return getLocalPosts();
      }

      if (data && data.length > 0) {
        return data as Post[];
      }
      
      // Nếu bảng trên Supabase rỗng, trả về local posts
      return getLocalPosts();
    } catch (err) {
      console.warn('Exception Supabase:', err);
      return getLocalPosts();
    }
  }

  return getLocalPosts();
}

/**
 * Lấy chi tiết một bài đăng theo ID
 */
export async function getPostById(id: string): Promise<Post | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Post;
      }
    } catch (err) {
      console.warn('Exception getPostById Supabase:', err);
    }
  }

  const localList = getLocalPosts();
  return localList.find((p) => p.id === id) || null;
}

/**
 * Upload ảnh lên Supabase Storage hoặc đọc Base64
 */
export async function uploadImage(file: File): Promise<string> {
  // Kiểm tra dung lượng <= 2MB theo PRD
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Dung lượng ảnh phải nhỏ hơn hoặc bằng 2MB.');
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.warn('Không thể upload lên Supabase Storage:', uploadError.message);
      } else {
        const { data } = supabase.storage.from('post-images').getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (e) {
      console.warn('Lỗi khi upload ảnh Supabase:', e);
    }
  }

  // Fallback: Chuyển sang Base64 để hiển thị ngay lập tức
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Tạo một bài đăng mới
 */
export async function createPost(input: CreatePostInput): Promise<{ post: Post; manage_code: string }> {
  const manage_code = generateManageCode();
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `post-${Date.now()}`;
  const now = new Date().toISOString();

  const newPost: Post = {
    ...input,
    id,
    status: 'open',
    manage_code,
    created_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            id: newPost.id,
            type: newPost.type,
            title: newPost.title,
            category: newPost.category,
            description: newPost.description || null,
            campus: newPost.campus,
            location: newPost.location,
            date: newPost.date,
            image_url: newPost.image_url || null,
            contact_type: newPost.contact_type,
            contact_value: newPost.contact_value,
            contact_name: newPost.contact_name || null,
            status: 'open',
            manage_code,
            created_at: now,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        // Đồng bộ thêm vào cache local
        const currentLocal = getLocalPosts();
        saveLocalPosts([data as Post, ...currentLocal]);
        return { post: data as Post, manage_code };
      } else {
        console.warn('Supabase insert error:', error?.message);
      }
    } catch (err) {
      console.warn('Exception createPost Supabase:', err);
    }
  }

  // Local/Offline Mode
  const current = getLocalPosts();
  const updated = [newPost, ...current];
  saveLocalPosts(updated);

  return { post: newPost, manage_code };
}

/**
 * Đánh dấu bài đăng thành 'done' bằng mã 6 ký tự
 */
export async function markPostDone(
  postId: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  const cleanCode = code.trim().toUpperCase();

  if (cleanCode.length !== 6) {
    return {
      success: false,
      message: 'Mã quản lý phải có đúng 6 ký tự.',
    };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.rpc('mark_post_done', {
        post_id: postId,
        input_code: cleanCode,
      });

      if (!error && data) {
        const result = data as { success: boolean; message: string };
        if (result.success) {
          // Cập nhật lại cache local
          const local = getLocalPosts();
          saveLocalPosts(
            local.map((p) => (p.id === postId ? { ...p, status: 'done' } : p))
          );
        }
        return result;
      }
    } catch (err) {
      console.warn('Exception markPostDone RPC Supabase:', err);
    }
  }

  // Local / Offline Verification
  const posts = getLocalPosts();
  const index = posts.findIndex((p) => p.id === postId);

  if (index === -1) {
    return { success: false, message: 'Không tìm thấy bài đăng này.' };
  }

  const post = posts[index];
  if (post.status === 'done') {
    return { success: true, message: 'Bài đăng này đã hoàn tất trước đó.' };
  }

  if ((post.manage_code || '').toUpperCase() === cleanCode) {
    posts[index] = { ...post, status: 'done' };
    saveLocalPosts(posts);
    return {
      success: true,
      message: 'Xác thực thành công! Đã chuyển trạng thái bài đăng sang Đã xong.',
    };
  }

  return {
    success: false,
    message: 'Mã quản lý 6 ký tự không chính xác. Vui lòng kiểm tra lại!',
  };
}
