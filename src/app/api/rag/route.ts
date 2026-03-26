import { NextResponse } from 'next/server';
import { getModel } from '@/lib/gemini';
import { db, auth } from '@/lib/firebase-admin';
import { getAppSettings } from '@/lib/config';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { prompt, manualModel } = await req.json();

    // 1. App Active Check (Admin can bypass)
    const settings = await getAppSettings();
    if (!settings.isAppActive) {
      const cookieStore = await cookies();
      const adminAuth = cookieStore.get('admin_auth')?.value;
      if (adminAuth !== 'true') {
        return NextResponse.json({ 
          error: '서비스가 관리자에 의해 일시적으로 중단되었습니다.' 
        }, { status: 503 });
      }
    }

    // 2. Session & Admin Check (Server side)
    // This is a simplified version for the MVP.
    // In production, use Firebase Admin SDK to verify the ID token or Session Cookie.
    // const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    // const decodedToken = await auth.verifyIdToken(idToken);
    // if (!decodedToken.admin) throw new Error('Forbidden');

    // 2. Model Routing
    const model = getModel(prompt, manualModel);

    // 3. RAG Logic (Placeholder)
    // Here you would fetch relevant documents from Firestore/Vector Store
    // and provide them as context to the model.
    const context = "This is a placeholder for RAG context.";

    const result = await model.generateContent(`${context}\n\nUser Question: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('RAG API Error:', error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 });
  }
}
