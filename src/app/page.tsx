'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { signupUser, loginUser } from '@/app/actions/auth';

type ViewMode = 'login' | 'snsSignup' | 'emailSignup' | 'snsDetail';

export default function LoginPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // SNS 가입 시 사용할 임시 상태
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isAgreed, setIsAgreed] = useState(false);

  // 이메일 분리 상태
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  
  // 비밀번호 상태 및 유효성
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  const isPasswordValid = password === '' || passwordRegex.test(password);
  const isPasswordMatch = confirmPassword === '' || password === confirmPassword;

  // 전체 이메일 문자열 만들기
  const getFullEmail = () => {
    const domain = emailDomain === 'custom' ? customDomain : emailDomain;
    return `${emailId}@${domain}`;
  };

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
        alert(result.message);
      }
    } catch (error) {
      alert('로그인 처리 중 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnsClick = (provider: string) => {
    setSelectedProvider(provider);
    setViewMode('snsDetail');
  };

  const handleSignupAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAgreed) {
      alert('개인정보 수집 및 이용에 동의해야 합니다.');
      return;
    }

    if (!isPasswordValid || password === '') {
      alert('비밀번호 유효성 조건을 만족해주세요.');
      return;
    }

    if (viewMode === 'emailSignup' && !isPasswordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    if (viewMode === 'emailSignup') {
      formData.set('email', getFullEmail());
    }

    try {
      const result = await signupUser(formData);
      if (result.success) {
        alert(result.message);
        if (result.email) {
          localStorage.setItem('userEmail', result.email);
        }
        router.push('/test');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('회원가입 처리 중 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-full p-8 relative overflow-y-auto bg-background">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl -z-10"></div>
      
      <div className="w-full flex-1 flex flex-col justify-center items-center py-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-indigo-600 mb-2 tracking-tight">
          CATCHUP
        </h1>
        <p className="text-slate-500 mb-12 font-medium tracking-wide">
          불확실한 미래를 확신으로
        </p>

        {viewMode === 'login' && (
          // 1. 로그인 모드
          <>
            <form onSubmit={handleLoginAction} className="w-full space-y-4">
              <div>
                <input name="email" type="email" placeholder="이메일 주소" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div>
                <input name="password" type="password" placeholder="비밀번호" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm" />
              </div>
              
              <button type="submit" disabled={isSubmitting} className="w-full mt-6 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold shadow-[0_8px_30px_rgb(168,85,247,0.2)] transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center">
                {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : '로그인하고 시작하기'}
              </button>
            </form>

            <div className="mt-8 text-sm text-slate-500 flex gap-4">
              <button className="hover:text-slate-900 transition-colors font-medium">비밀번호 찾기</button>
              <span className="text-slate-300">|</span>
              <button onClick={() => setViewMode('snsSignup')} className="hover:text-primary transition-colors font-medium">회원가입</button>
            </div>
          </>
        )}

        {viewMode === 'snsSignup' && (
          // 2. SNS 회원가입 모드
          <div className="w-full flex flex-col gap-3">
            <button onClick={() => handleSnsClick('Kakao')} className="w-full py-4 bg-[#FEE500] text-black rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm border border-[#FEE500]">
              <span>💬</span> 카카오로 시작하기
            </button>
            <button onClick={() => handleSnsClick('Naver')} className="w-full py-4 bg-[#03C75A] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm border border-[#03C75A]">
              <span className="font-extrabold font-serif italic">N</span> 네이버로 시작하기
            </button>
            <button onClick={() => handleSnsClick('Google')} className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm">
              <span className="text-xl">G</span> 구글로 시작하기
            </button>
            <button onClick={() => handleSnsClick('Apple')} className="w-full py-4 bg-black text-white border border-black rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm">
              <span className="text-xl"></span> Apple로 시작하기
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-xs text-slate-400 font-medium">또는</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <button onClick={() => setViewMode('emailSignup')} className="w-full py-4 bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl font-bold transition-transform active:scale-95 hover:bg-slate-200">
              이메일로 가입하기
            </button>

            <div className="mt-8 text-sm text-slate-500 text-center">
              이미 계정이 있으신가요?{' '}
              <button onClick={() => setViewMode('login')} className="text-primary hover:text-primary-hover font-bold ml-1">
                로그인
              </button>
            </div>
          </div>
        )}

        {viewMode === 'snsDetail' && (
          // 2-1. SNS 추가 정보 폼
          <div className="w-full">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2 text-center">{selectedProvider} 계정으로 가입</h2>
            <p className="text-sm text-slate-500 text-center mb-8">마지막으로 가입에 필요한 정보를 입력해주세요.</p>
            
            <form onSubmit={handleSignupAction} className="w-full space-y-4">
              <input type="hidden" name="provider" value={selectedProvider} />
              <div>
                <input name="name" type="text" placeholder="이름 (또는 닉네임)" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div>
                <input name="age" type="number" placeholder="나이" required min="10" max="100" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm" />
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="snsAgree" 
                  checked={isAgreed} 
                  onChange={(e) => setIsAgreed(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-primary bg-white border-slate-300 rounded focus:ring-primary" 
                />
                <label htmlFor="snsAgree" className="text-sm text-slate-600 font-medium">
                  <span className="text-primary font-bold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={!isAgreed || isSubmitting}
                className="w-full mt-4 py-4 bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none text-white rounded-2xl font-bold shadow-[0_8px_30px_rgb(168,85,247,0.2)] transition-transform active:scale-95 disabled:scale-100 flex items-center justify-center"
              >
                {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : '가입 완료하고 성향 테스트하기'}
              </button>
            </form>
            <div className="mt-8 text-sm text-slate-500 text-center">
              <button onClick={() => setViewMode('snsSignup')} className="text-slate-400 hover:text-slate-600 font-medium">
                &larr; 이전으로 돌아가기
              </button>
            </div>
          </div>
        )}

        {viewMode === 'emailSignup' && (
          // 3. 이메일 회원가입 모드
          <div className="w-full">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">이메일 회원가입</h2>
            <form onSubmit={handleSignupAction} className="w-full space-y-4">
              <div>
                <input name="name" type="text" placeholder="이름" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="flex gap-2">
                <input name="age" type="number" placeholder="나이" required min="10" max="100" className="w-[30%] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm" />
                
                {/* 이메일 ID & 도메인 드롭다운 */}
                <div className="flex flex-1 gap-2 items-center">
                  <input 
                    type="text" 
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="이메일" 
                    required 
                    className="w-[45%] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm" 
                  />
                  <span className="text-slate-400 font-medium">@</span>
                  <div className="flex-1 flex flex-col gap-2">
                    <select 
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-4 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none shadow-sm"
                    >
                      <option value="" disabled hidden>도메인</option>
                      <option value="naver.com">naver.com</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="kakao.com">kakao.com</option>
                      <option value="custom">직접 입력</option>
                    </select>
                    {emailDomain === 'custom' && (
                      <input 
                        type="text" 
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="직접 입력" 
                        required 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm" 
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="비밀번호 (8자 이상, 특수문자 포함)" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-slate-50 border ${!isPasswordValid ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-primary focus:ring-primary'} rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:bg-white transition-all shadow-sm`} 
                />
                {!isPasswordValid && (
                  <p className="text-red-500 text-xs mt-2 ml-2 font-medium">비밀번호는 8자 이상이며, 특수문자를 최소 1개 이상 포함해야 합니다.</p>
                )}
              </div>

              <div>
                <input 
                  type="password" 
                  placeholder="비밀번호 확인" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-slate-50 border ${!isPasswordMatch ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-primary focus:ring-primary'} rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:bg-white transition-all shadow-sm`} 
                />
                {!isPasswordMatch && (
                  <p className="text-red-500 text-xs mt-2 ml-2 font-medium">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="emailAgree" 
                  checked={isAgreed} 
                  onChange={(e) => setIsAgreed(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-primary bg-white border-slate-300 rounded focus:ring-primary" 
                />
                <label htmlFor="emailAgree" className="text-sm text-slate-600 font-medium">
                  <span className="text-primary font-bold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={!isAgreed || isSubmitting || !isPasswordValid || !isPasswordMatch || password === ''}
                className="w-full mt-4 py-4 bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none text-white rounded-2xl font-bold shadow-[0_8px_30px_rgb(168,85,247,0.2)] transition-transform active:scale-95 disabled:scale-100 flex items-center justify-center"
              >
                {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : '가입 완료하고 성향 테스트하기'}
              </button>
            </form>
            <div className="mt-8 text-sm text-slate-500 text-center">
              <button onClick={() => setViewMode('snsSignup')} className="text-slate-400 hover:text-slate-600 font-medium">
                &larr; 이전으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
