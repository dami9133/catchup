'use client';

import { useState, useEffect } from 'react';
import { PersonaCard } from '@/components/PersonaCard';
import { Crown, Target, Sparkles, Trophy, CreditCard, CheckCircle, Camera, X } from 'lucide-react';

export default function MyPage() {
  const [userPersona, setUserPersona] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // 저장된 페르소나와 구독 상태 불러오기
    const savedPersona = localStorage.getItem('userPersona');
    if (savedPersona) {
      try {
        setUserPersona(JSON.parse(savedPersona));
      } catch (e) {
        console.error(e);
      }
    }
    const sub = localStorage.getItem('isSubscribed');
    if (sub === 'true') {
      setIsSubscribed(true);
    }
  }, []);



  return (
    <main className="min-h-full flex flex-col relative break-keep whitespace-pre-wrap bg-transparent">
      {/* Header */}
      <header className="pt-10 px-6 pb-12 bg-[#111827] flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-white tracking-tight">마이페이지</h1>
        <span className="bg-white/10 text-white/90 text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
          {isSubscribed ? 'Premium 💎' : 'Free 플랜'}
        </span>
      </header>

      {/* Body */}
      <div className="flex-1 bg-white rounded-t-[32px] p-6 pt-8 shadow-[0_-10px_40px_rgb(0,0,0,0.12)] -mt-6 z-20 flex flex-col pb-24 overflow-y-auto">
      {/* 나의 페르소나 */}
      <section className="mb-10">
        <h2 className="text-slate-900 font-extrabold mb-5 flex items-center gap-2">
          <Crown className="w-5 h-5 text-blue-600" strokeWidth={2.5} /> 나의 커리어 페르소나
        </h2>
        <PersonaCard 
          name={userPersona ? userPersona.name : "미검사 상태입니다"}
          description={userPersona ? userPersona.desc : "테스트 메뉴에서 나만의 커리어 페르소나를 찾고 맞춤형 추천을 받아보세요."}
          jobs={userPersona ? userPersona.jobs : ['-']}
        />
      </section>



      {/* 멤버십 관리 영역 */}
      <section>
        <h2 className="text-slate-900 font-extrabold mb-5 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" strokeWidth={2.5} /> 멤버십 관리
        </h2>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-3">
            <p className="text-slate-900 font-extrabold text-[15px]">{isSubscribed ? '프리미엄 플랜 💎' : '베이직 플랜 (무료)'}</p>
            {!isSubscribed && <button className="text-xs text-blue-600 font-extrabold hover:underline">업그레이드</button>}
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            {isSubscribed 
              ? '프리미엄 멤버십 구독 중입니다. 현직자 시크릿 로드맵과 리얼 VLOG를 자유롭게 이용하세요.'
              : '프리미엄 멤버십으로 업그레이드하고\n현직자 시크릿 로드맵과 리얼 VLOG를 제한 없이 확인하세요.'}
          </p>
        </div>
      </section>


      </div>
    </main>
  );
}
