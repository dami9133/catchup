'use client';

import { useState, useEffect } from 'react';
import { PersonaCard } from '@/components/PersonaCard';
import { Crown, Target, Sparkles, Trophy, CreditCard, CheckCircle, Camera, X } from 'lucide-react';

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

      {/* 나의 퀘스트 및 EXP */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-5">
          <h2 className="text-slate-900 font-extrabold flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" strokeWidth={2.5} /> 커리어 성장 퀘스트
          </h2>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold mb-1">현재 EXP</p>
            <p className="text-xl font-extrabold text-blue-600 tracking-tight">{questExp} <span className="text-xs font-medium text-slate-400">/ 500</span></p>
          </div>
        </div>
        
        {/* EXP 바 */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 border border-slate-200">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${(questExp / 500) * 100}%` }}
          ></div>
        </div>

        {currentQuest ? (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 flex justify-between items-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden">
            {questState === 'completed' && (
              <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px] flex items-center justify-center z-10 animate-in fade-in duration-300">
                <span className="text-blue-600 font-extrabold flex items-center gap-2 text-[15px]">
                  <Sparkles className="w-5 h-5" /> 퀘스트 완료! 다음 퀘스트 준비 중...
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">STEP {activeQuestIndex + 1}</span>
              </div>
              <p className="text-slate-900 font-bold text-sm pr-2 leading-snug">{currentQuest.title}</p>
              <p className="text-xs text-blue-600 mt-1.5 font-bold flex items-center gap-1"><Sparkles className="w-3 h-3" />보상: {currentQuest.reward} EXP</p>
            </div>
            
            <div className="flex-shrink-0 relative z-20">
              {questState === 'idle' && (
                <button 
                  onClick={handleStartQuest}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] px-4 py-2 rounded-xl font-extrabold transition-colors whitespace-nowrap active:scale-95"
                >
                  시작하기
                </button>
              )}

              {questState === 'in_progress' && (
                <button 
                  onClick={handleVerifyClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] px-4 py-2 rounded-xl font-extrabold transition-colors shadow-lg shadow-blue-500/20 animate-pulse whitespace-nowrap active:scale-95"
                >
                  인증하기
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center">
            <Trophy className="w-10 h-10 text-yellow-500 mb-3" strokeWidth={2} />
            <p className="text-slate-900 font-extrabold text-lg">모든 퀘스트를 완료했습니다!</p>
            <p className="text-slate-500 text-xs mt-1.5 font-medium">곧 새로운 퀘스트가 추가될 예정입니다.</p>
          </div>
        )}
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

      {/* 퀘스트 인증 모달 */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-[2rem] w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowVerifyModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 bg-slate-50 w-8 h-8 flex items-center justify-center rounded-full"><X className="w-4 h-4"/></button>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">퀘스트 인증하기</h2>
            <p className="text-[13px] text-slate-500 mb-6 font-medium leading-relaxed">{currentQuest?.title} 미션을 완료한 증빙 사진이나 캡쳐를 업로드해주세요.</p>
            
            <label className="border-2 border-dashed border-slate-200 rounded-3xl p-8 mb-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden group">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={handleFileChange} />
              
              {uploadedFileName ? (
                <>
                  <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" strokeWidth={2} />
                  <span className="text-slate-900 font-bold text-center break-all text-[13px] px-2">{uploadedFileName}</span>
                  <span className="text-[11px] font-bold text-slate-400 mt-2">클릭하여 다른 파일 선택</span>
                </>
              ) : (
                <>
                  <Camera className="w-10 h-10 text-slate-300 mb-3" strokeWidth={1.5} />
                  <span className="text-[13px] font-bold text-slate-600">사진 첨부하기</span>
                </>
              )}
            </label>

            <button 
              onClick={handleVerifySubmit}
              className={`w-full py-4 font-extrabold rounded-2xl transition-all shadow-sm active:scale-95 text-[15px] ${uploadedFileName ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              disabled={!uploadedFileName}
            >
              업로드 완료 및 보상받기
            </button>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
