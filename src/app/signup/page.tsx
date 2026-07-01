'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { signupUser, sendVerificationEmail, verifyEmailCode } from '@/app/actions/auth';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type ViewMode = 'snsSignup' | 'emailSignup' | 'snsDetail';

export default function SignupPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('snsSignup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // SNS 가입 시 사용할 임시 상태
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isAgreed, setIsAgreed] = useState(false);

  // 이메일 인증 상태
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  
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

  const handleSnsClick = (provider: string) => {
    setSelectedProvider(provider);
    setViewMode('snsDetail');
  };

  const handleSendCode = async () => {
    if (!emailId || (!customDomain && emailDomain === 'custom')) {
      alert('이메일 주소를 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    setVerifyError('');
    
    const email = getFullEmail();
    const result = await sendVerificationEmail(email);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setIsCodeSent(true);
      alert('인증번호가 발송되었습니다. 5분 이내에 입력해주세요.');
    } else {
      alert(result.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) return;
    
    setIsSubmitting(true);
    setVerifyError('');
    
    const email = getFullEmail();
    const result = await verifyEmailCode(email, verificationCode);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setIsVerified(true);
    } else {
      setVerifyError(result.message || '인증번호가 일치하지 않습니다.');
    }
  };

  const handleSignupAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAgreed) {
      alert('개인정보 수집 및 이용에 동의해야 합니다.');
      return;
    }

    if (viewMode === 'emailSignup') {
      if (!isVerified) {
        alert('이메일 인증을 먼저 완료해주세요.');
        return;
      }
      if (!isPasswordValid || password === '') {
        alert('비밀번호 유효성 조건을 만족해주세요.');
        return;
      }
      if (!isPasswordMatch) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    setIsSubmitting(true);
    
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    if (viewMode === 'emailSignup') {
      formData.set('email', getFullEmail());
      formData.set('provider', 'Email');
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
    <main className="flex flex-col min-h-full relative overflow-hidden bg-transparent">
      {/* Header part */}
      <div className="pt-24 pb-12 px-8 text-center relative z-10">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          CATCHUP
        </h1>
        <p className="text-blue-200 mb-4 font-bold tracking-wide text-sm">
          회원가입
        </p>
      </div>

      {/* Body part */}
      <div className="flex-1 bg-white w-full rounded-t-[32px] px-8 pt-10 pb-16 shadow-[0_-10px_40px_rgb(0,0,0,0.12)] flex flex-col relative z-20 overflow-y-auto">
        
        {viewMode === 'snsSignup' && (
          // SNS 회원가입 모드
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

            <div className="mt-8 text-[13px] text-slate-500 text-center font-medium">
              이미 계정이 있으신가요?{' '}
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-extrabold ml-1">
                로그인
              </Link>
            </div>
          </div>
        )}

        {viewMode === 'snsDetail' && (
          // SNS 추가 정보 폼
          <div className="w-full">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2 text-center">{selectedProvider} 계정으로 가입</h2>
            <p className="text-sm text-slate-500 text-center mb-8">마지막으로 가입에 필요한 정보를 입력해주세요.</p>
            
            <form onSubmit={handleSignupAction} className="w-full space-y-4">
              <input type="hidden" name="provider" value={selectedProvider} />
              <div>
                <input name="name" type="text" placeholder="이름 (또는 닉네임)" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
              </div>
              <div>
                <input name="age" type="number" placeholder="나이" required min="10" max="100" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="snsAgree" 
                  checked={isAgreed} 
                  onChange={(e) => setIsAgreed(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-600" 
                />
                <label htmlFor="snsAgree" className="text-sm text-slate-600 font-medium leading-snug">
                  <span className="text-blue-600 font-bold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={!isAgreed || isSubmitting}
                className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-2xl font-bold shadow-md transition-transform active:scale-95 disabled:scale-100 flex items-center justify-center"
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
          // 이메일 회원가입 모드
          <div className="w-full">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">이메일 회원가입</h2>
            <form onSubmit={handleSignupAction} className="w-full space-y-4">
              <div>
                <input name="name" type="text" placeholder="이름" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="flex gap-2">
                <input name="age" type="number" placeholder="나이" required min="10" max="100" className="w-[30%] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
                
                {/* 이메일 입력 */}
                <div className="flex flex-1 gap-2 items-center">
                  <input 
                    type="text" 
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="이메일" 
                    required 
                    disabled={isCodeSent || isVerified}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all text-sm shadow-sm disabled:opacity-50" 
                  />
                  <span className="text-slate-400 font-bold">@</span>
                  <select 
                    value={emailDomain} 
                    onChange={(e) => setEmailDomain(e.target.value)} 
                    disabled={isCodeSent || isVerified}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-2 py-4 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm shadow-sm disabled:opacity-50"
                  >
                    <option value="gmail.com">gmail.com</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="custom">직접입력</option>
                  </select>
                </div>
              </div>
              
              {emailDomain === 'custom' && (
                <div>
                  <input 
                    type="text" 
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="도메인 주소 (예: example.com)" 
                    disabled={isCodeSent || isVerified}
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-sm text-sm disabled:opacity-50" 
                  />
                </div>
              )}

              {/* 이메일 인증 발송 버튼 */}
              <div className="flex justify-end mt-1">
                <button 
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSubmitting || isVerified}
                  className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" /> 
                  {isCodeSent ? '인증번호 재전송' : '인증번호 받기'}
                </button>
              </div>

              {/* 인증번호 입력 필드 */}
              {isCodeSent && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative animate-in fade-in zoom-in duration-300">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="6자리 인증번호" 
                      maxLength={6}
                      disabled={isVerified}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 tracking-widest font-mono shadow-inner disabled:bg-slate-100" 
                    />
                    <button 
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={isVerified || isSubmitting || verificationCode.length < 6}
                      className="bg-slate-800 text-white px-5 rounded-xl font-bold whitespace-nowrap hover:bg-slate-900 disabled:bg-slate-300 transition-colors"
                    >
                      확인
                    </button>
                  </div>
                  
                  {verifyError && (
                    <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {verifyError}
                    </p>
                  )}
                  {isVerified && (
                    <p className="text-emerald-500 text-sm font-bold mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> 인증이 완료되었습니다.
                    </p>
                  )}
                </div>
              )}

              {/* 비밀번호 입력 */}
              <div>
                <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 (특수문자 포함 8자 이상)" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
                {!isPasswordValid && (
                  <p className="text-red-500 text-xs mt-1 ml-2 font-medium">비밀번호는 특수문자 포함 8자 이상이어야 합니다.</p>
                )}
              </div>
              <div>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호 확인" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-sm" />
                {!isPasswordMatch && (
                  <p className="text-red-500 text-xs mt-1 ml-2 font-medium">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>

              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="emailAgree" 
                  checked={isAgreed} 
                  onChange={(e) => setIsAgreed(e.target.checked)} 
                  className="mt-1 w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-600" 
                />
                <label htmlFor="emailAgree" className="text-sm text-slate-600 font-medium leading-snug">
                  <span className="text-blue-600 font-bold">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={!isAgreed || !isVerified || isSubmitting || !isPasswordValid || !isPasswordMatch}
                className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-2xl font-bold shadow-md transition-transform active:scale-95 disabled:scale-100 flex items-center justify-center"
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
