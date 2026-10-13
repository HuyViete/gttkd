import { NextResponse } from 'next/server';
import { markPostDone } from '@/lib/postsService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp mã quản lý 6 ký tự.' },
        { status: 400 }
      );
    }

    const result = await markPostDone(id, code);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
