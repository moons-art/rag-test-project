'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, Save, Power, PowerOff, Loader2, KeyRound, LogOut } from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAppActive, setIsAppActive] = useState(true);
  const [appPassword, setAppPassword] = useState('0000');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const data = await res.json();
        setIsAppActive(data.isAppActive ?? true);
        setAppPassword(data.appPassword || '0000');
      } else if (res.status === 401) {
        router.push('/admin/login');
      } else {
        showMessage('설정을 불러오지 못했습니다.', 'error');
      }
    } catch (err) {
      showMessage('서버 연결 오류', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      if (appPassword.length !== 4) {
        showMessage('비밀번호는 반드시 숫자 4자리여야 합니다.', 'error');
        setIsSaving(false);
        return;
      }

      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAppActive, appPassword }),
      });

      if (res.ok) {
        showMessage('설정이 성공적으로 저장되었습니다.', 'success');
      } else {
        showMessage('설정 저장에 실패했습니다.', 'error');
      }
    } catch (err) {
      showMessage('서버 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    // A simple way to logout is to clear the cookie via a document.cookie rewrite
    // or by calling an API. For simplicity here, we clear client-side and redirect
    document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/admin/login');
    router.refresh();
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Settings className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">관리자 제어 패널</h1>
              <p className="text-slate-400">RAG 시스템의 인증 및 운영 상태를 관리합니다.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="/" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition" target="_blank" rel="noreferrer">
              앱으로 이동
            </a>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> 로그아웃
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: App Status Toggle */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
              <Power className="w-5 h-5 text-purple-400" /> 메인 앱 스위치
            </h2>
            <div className="relative z-10 flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
              <div>
                <p className="text-white font-medium">{isAppActive ? '구동 정상 로딩 중' : '일시 정지됨'}</p>
                <p className="text-sm text-slate-400">비활성화 시 일반 사용자의 입장이 차단됩니다.</p>
              </div>
              <button
                onClick={() => setIsAppActive(!isAppActive)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
                  isAppActive ? 'bg-purple-500' : 'bg-slate-600'
                }`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isAppActive ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            {!isAppActive && (
              <p className="mt-4 text-sm text-amber-400 flex items-center gap-2">
                <PowerOff className="w-4 h-4" /> 현재 앱이 차단 상태입니다.
              </p>
            )}
          </div>

          {/* Card 2: App Password Control */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
              <KeyRound className="w-5 h-5 text-blue-400" /> 일반 사용자 입장 비밀번호
            </h2>
            <div className="relative z-10">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                4자리 숫자 (기본값: 0000)
              </label>
              <input
                type="text"
                maxLength={4}
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-2xl font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all tracking-[0.5em]"
              />
              <p className="mt-2 text-sm text-slate-500">
                이 비밀번호를 알고 있는 사람만 `/login`을 거쳐 AI와 대화할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
          <div className="flex-1">
            {message.text && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
              >
                {message.text}
              </motion.p>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            설정 저장 및 적용
          </button>
        </div>

      </motion.div>
    </div>
  );
}
