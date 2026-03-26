import { NextResponse } from 'next/server';
import { getAppSettings, updateAppSettings } from '@/lib/config';
import { cookies } from 'next/headers';

// Require admin_auth cookie for these operations
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;
    if (adminAuth !== 'true') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const settings = await getAppSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: '설정을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;
    if (adminAuth !== 'true') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    // Only update allowed fields
    const updates: any = {};
    if (typeof body.isAppActive === 'boolean') updates.isAppActive = body.isAppActive;
    if (typeof body.appPassword === 'string' && body.appPassword.length === 4) updates.appPassword = body.appPassword;

    await updateAppSettings(updates);
    return NextResponse.json({ success: true, settings: updates });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: '설정을 저장하는데 실패했습니다.' }, { status: 500 });
  }
}
