import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/postsService';
import { CreatePostInput } from '@/types/post';

export async function GET() {
  try {
    const posts = await getPosts();
    // Ẩn manage_code khi trả về cho public client
    const sanitizedPosts = posts.map(({ manage_code, ...rest }) => rest);
    return NextResponse.json(sanitizedPosts);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Lỗi khi tải danh sách bài đăng' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePostInput;
    if (!body.title || !body.category || !body.campus || !body.location || !body.contact_value) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const { post, manage_code } = await createPost(body);
    return NextResponse.json({ success: true, post, manage_code }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Lỗi khi tạo bài đăng' },
      { status: 500 }
    );
  }
}
