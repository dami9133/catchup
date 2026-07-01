'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { signupUser, loginUser } from '@/app/actions/auth';

type ViewMode = 'login';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLoginAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await loginUser(formData);
      if (result.success && result.user) {
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userLevel', String(result.user.level));
        localStorage.setItem('subStatus', result.user.sub_status);
        
        router.push('/dashboard');
      } else {
        setLoginError(result.message || '아이디 또는 비밀번호가 잘못되었습니다.');
        // 입력 폼 초기화를 위해 리셋
        e.currentTarget.reset();
      }
    } catch (error) {
      setLoginError('로그인 처리 중 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <main className="flex flex-col min-h-full relative overflow-hidden bg-transparent">
      {/* Header part */}
      <div className="pt-24 pb-12 px-8 text-center relative z-10">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          CATCHUP
        </h1>
        <p className="text-slate-400 mb-4 font-medium tracking-wide">
          불확실한 미래를 확신으로
        </p>
      </div>

      {/* Body part */}
      <div className="flex-1 bg-white w-full rounded-t-[32px] px-8 pt-10 pb-16 shadow-[0_-10px_40px_rgb(0,0,0,0.12)] flex flex-col relative z-20 overflow-y-auto">

        {/* 로그인 폼 */}
        <form onSubmit={handleLoginAction} className="w-full space-y-4">
          {loginError && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600">!</span>
              {loginError}
            </div>
          )}
          
          <div>
            <input name="email" type="email" placeholder="이메일 주소" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)]" />
          </div>
          <div>
            <input name="password" type="password" placeholder="비밀번호" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)]" />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-sm">
            {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : '로그인하고 시작하기'}
          </button>
        </form>

        <div className="mt-8 text-[13px] text-slate-500 flex justify-center gap-4">
          <button className="hover:text-slate-900 transition-colors font-bold">비밀번호 찾기</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => router.push('/signup')} className="hover:text-blue-600 transition-colors font-bold">회원가입</button>
        </div>

      </div>
    </main>
  );
}
