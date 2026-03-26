import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD is not set in environment variables');
      return NextResponse.json({ error: '서버 설정 오류: 관리자 비밀번호가 설정되지 않았습니다.' }, { status: 500 });
    }

    if (password === adminPassword) {
      // Create response and set cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: '관리자 비밀번호가 일치하지 않습니다.' }, { status: 401 });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: '인증 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
