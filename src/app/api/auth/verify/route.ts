import { NextResponse } from 'next/server';
import { getAppSettings } from '@/lib/config';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const settings = await getAppSettings();

    // The default is '0000' if not set in Firestore
    const currentAppPassword = settings.appPassword || '0000';

    if (password === currentAppPassword) {
      // Create response and set cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('app_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '인증 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
