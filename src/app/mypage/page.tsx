'use client';

import { useState } from 'react';
import { PersonaCard } from '@/components/PersonaCard';

type QuestState = 'idle' | 'in_progress' | 'completed';

export default function MyPage() {
  const [questExp, setQuestExp] = useState(0);
  const [questState, setQuestState] = useState<QuestState>('idle');
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleStartQuest = () => {
    setQuestState('in_progress');
  };

  const handleVerifyClick = () => {
    setShowVerifyModal(true);
  };

  const handleVerifySubmit = () => {
    setShowVerifyModal(false);
    setQuestState('completed');
    setQuestExp(prev => prev + 50);
  };

  return (
    <main className="min-h-full pb-20 bg-background flex flex-col p-6 overflow-y-auto">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">마이페이지</h1>
        <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-700">Free 플랜</span>
      </header>

      {/* 나의 페르소나 */}
      <section className="mb-8">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <span>👑</span> 나의 커리어 페르소나
        </h2>
        <PersonaCard 
          name="실행력 100% 불도저"
          description="어떤 과제든 망설임 없이 시작하며, 문제를 겪으면서 빠르게 해결책을 찾아내는 탁월한 실행력을 갖췄습니다."
          jobs={['스타트업 창업가', '그로스 해커', '세일즈 매니저']}
        />
      </section>

      {/* 나의 퀘스트 및 EXP */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-white font-bold flex items-center gap-2">
            <span>🎯</span> 주간 퀘스트
          </h2>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">현재 EXP</p>
            <p className="text-xl font-extrabold text-primary">{questExp} <span className="text-sm font-normal text-slate-500">/ 500</span></p>
          </div>
        </div>
        
        {/* EXP 바 */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(questExp / 500) * 100}%` }}
          ></div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex justify-between items-center shadow-inner">
          <div>
            <p className="text-white font-medium">마케팅 관련 아티클 읽고 요약하기</p>
            <p className="text-xs text-slate-400 mt-1">보상: 50 EXP</p>
          </div>
          
          {questState === 'idle' && (
            <button 
              onClick={handleStartQuest}
              className="bg-primary hover:bg-primary-hover text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              시작하기
            </button>
          )}

          {questState === 'in_progress' && (
            <button 
              onClick={handleVerifyClick}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20 animate-pulse whitespace-nowrap"
            >
              인증하기
            </button>
          )}

          {questState === 'completed' && (
            <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20 whitespace-nowrap">
              완료! (+50)
            </span>
          )}
        </div>
      </section>

      {/* 멤버십 관리 영역 */}
      <section>
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <span>💳</span> 멤버십 관리
        </h2>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white font-medium">베이직 플랜 (무료)</p>
            <button className="text-xs text-primary font-bold hover:underline">업그레이드</button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            프리미엄 멤버십으로 업그레이드하고<br/>
            현직자 시크릿 로드맵과 리얼 VLOG를 제한 없이 확인하세요.
          </p>
        </div>
      </section>

      {/* 퀘스트 인증 모달 */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowVerifyModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-xl font-bold text-white mb-2">퀘스트 인증하기</h2>
            <p className="text-sm text-slate-400 mb-6">마케팅 아티클을 읽고 요약한 노션 링크나 이미지를 업로드해주세요.</p>
            
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800 hover:border-slate-500 transition-colors cursor-pointer">
              <span className="text-3xl mb-2">📸</span>
              <span className="text-sm font-medium">사진 첨부하기</span>
            </div>

            <button 
              onClick={handleVerifySubmit}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-transform active:scale-95"
            >
              업로드 완료 및 보상받기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
