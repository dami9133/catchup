'use client';

import { useState, useEffect } from 'react';
import { PersonaCard } from '@/components/PersonaCard';

type QuestState = 'idle' | 'in_progress' | 'completed';

export default function MyPage() {
  const [questExp, setQuestExp] = useState(0);
  const [questState, setQuestState] = useState<QuestState>('idle');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [activeQuestIndex, setActiveQuestIndex] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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

  const QUESTS = [
    { id: 1, title: '내 직무와 관련된 최신 아티클 1개 읽고 요약하기', reward: 50 },
    { id: 2, title: '관심 기업 채용 공고 스크랩 3개 하기', reward: 100 },
    { id: 3, title: '이력서 초안 1장 분량 작성하기', reward: 150 },
    { id: 4, title: '모의 면접 1회 진행 및 녹화하기', reward: 200 },
  ];

  const currentQuest = QUESTS[activeQuestIndex] || null;

  const handleStartQuest = () => {
    setQuestState('in_progress');
  };

  const handleVerifyClick = () => {
    setShowVerifyModal(true);
    setUploadedFileName(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleVerifySubmit = () => {
    if (!uploadedFileName) {
      alert('사진이나 관련 자료를 먼저 첨부해주세요!');
      return;
    }
    
    setShowVerifyModal(false);
    setQuestState('completed');
    
    if (currentQuest) {
      setQuestExp(prev => Math.min(prev + currentQuest.reward, 500));
    }

    // 2초 뒤에 다음 퀘스트로 넘어감
    setTimeout(() => {
      if (activeQuestIndex < QUESTS.length - 1) {
        setActiveQuestIndex(prev => prev + 1);
        setQuestState('idle');
      }
    }, 2000);
  };

  return (
    <main className="min-h-full pb-20 bg-slate-50 flex flex-col p-6 overflow-y-auto relative">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>
        <span className="bg-white text-slate-600 text-xs px-3 py-1 rounded-full border border-slate-100">
          {isSubscribed ? 'Premium 💎' : 'Free 플랜'}
        </span>
      </header>

      {/* 나의 페르소나 */}
      <section className="mb-8">
        <h2 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
          <span>👑</span> 나의 커리어 페르소나
        </h2>
        <PersonaCard 
          name={userPersona ? userPersona.name : "미검사 상태입니다"}
          description={userPersona ? userPersona.desc : "테스트 메뉴에서 나만의 커리어 페르소나를 찾고 맞춤형 추천을 받아보세요."}
          jobs={userPersona ? userPersona.jobs : ['-']}
        />
      </section>

      {/* 나의 퀘스트 및 EXP */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-slate-900 font-bold flex items-center gap-2">
            <span>🎯</span> 커리어 성장 퀘스트
          </h2>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">현재 EXP</p>
            <p className="text-xl font-extrabold text-primary">{questExp} <span className="text-sm font-normal text-slate-500">/ 500</span></p>
          </div>
        </div>
        
        {/* EXP 바 */}
        <div className="w-full bg-white rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(questExp / 500) * 100}%` }}
          ></div>
        </div>

        {currentQuest ? (
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex justify-between items-center shadow-inner relative overflow-hidden">
            {questState === 'completed' && (
              <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-center z-10 animate-in fade-in duration-300">
                <span className="text-emerald-400 font-bold flex items-center gap-2 text-lg">
                  <span className="text-2xl">✨</span> 퀘스트 완료! 다음 퀘스트 준비 중...
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded">STEP {activeQuestIndex + 1}</span>
              </div>
              <p className="text-slate-900 font-medium pr-2">{currentQuest.title}</p>
              <p className="text-xs text-primary mt-1 font-bold">보상: {currentQuest.reward} EXP</p>
            </div>
            
            <div className="flex-shrink-0 relative z-20">
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
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border border-slate-100 text-center">
            <span className="text-4xl block mb-2">🏆</span>
            <p className="text-slate-900 font-bold text-lg">모든 퀘스트를 완료했습니다!</p>
            <p className="text-slate-500 text-sm mt-1">곧 새로운 퀘스트가 추가될 예정입니다.</p>
          </div>
        )}
      </section>

      {/* 멤버십 관리 영역 */}
      <section>
        <h2 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
          <span>💳</span> 멤버십 관리
        </h2>
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-900 font-medium">{isSubscribed ? '프리미엄 플랜 💎' : '베이직 플랜 (무료)'}</p>
            {!isSubscribed && <button className="text-xs text-primary font-bold hover:underline">업그레이드</button>}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isSubscribed 
              ? '프리미엄 멤버십 구독 중입니다. 현직자 시크릿 로드맵과 리얼 VLOG를 자유롭게 이용하세요.'
              : '프리미엄 멤버십으로 업그레이드하고\n현직자 시크릿 로드맵과 리얼 VLOG를 제한 없이 확인하세요.'}
          </p>
        </div>
      </section>

      {/* 퀘스트 인증 모달 */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowVerifyModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900">✕</button>
            <h2 className="text-xl font-bold text-slate-900 mb-2">퀘스트 인증하기</h2>
            <p className="text-sm text-slate-500 mb-6">{currentQuest?.title} 미션을 완료한 증빙 사진이나 캡쳐를 업로드해주세요.</p>
            
            <label className="border-2 border-dashed border-slate-600 rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-slate-500 hover:bg-white hover:border-slate-500 transition-colors cursor-pointer relative overflow-hidden group">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={handleFileChange} />
              
              {uploadedFileName ? (
                <>
                  <span className="text-4xl mb-2">✅</span>
                  <span className="text-emerald-400 font-bold text-center break-all text-sm px-2">{uploadedFileName}</span>
                  <span className="text-xs text-slate-500 mt-2 group-hover:text-slate-500 transition-colors">클릭하여 다른 파일 선택</span>
                </>
              ) : (
                <>
                  <span className="text-3xl mb-2">📸</span>
                  <span className="text-sm font-medium">사진 첨부하기</span>
                </>
              )}
            </label>

            <button 
              onClick={handleVerifySubmit}
              className={`w-full py-4 font-bold rounded-xl transition-all ${uploadedFileName ? 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 active:scale-95' : 'bg-white text-slate-500 cursor-not-allowed'}`}
              disabled={!uploadedFileName}
            >
              업로드 완료 및 보상받기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
