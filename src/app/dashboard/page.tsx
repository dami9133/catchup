'use client';

import { useState } from 'react';

type JobCategory = 'recommended' | 'popular';

export default function DashboardPage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<JobCategory>('recommended');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setShowPremiumModal(false);
  };

  const JOB_INFO = {
    '데이터 분석가': {
      title: '데이터 분석가',
      tasks: '데이터 파이프라인 구축, A/B 테스트 검증, 프로덕트 지표(DAU, MAU) 분석 및 인사이트 도출',
      certs: 'SQLD, ADsP, 정보처리기사',
      companies: '토스, 당근, 네이버웹툰, 쏘카',
      satisfaction: '⭐️ 4.5 / 5.0 (비즈니스 임팩트를 낸다는 보람)',
      salary: '초봉 4,000 ~ 5,000만 원'
    },
    'AI 프롬프트 엔지니어': {
      title: 'AI 프롬프트 엔지니어',
      tasks: 'LLM 모델 프롬프트 최적화, 파인튜닝 데이터셋 구축, AI 에이전트 워크플로우 설계',
      certs: '관련 자격증보단 실무 포트폴리오 및 AI 해커톤 입상 우대',
      companies: '뤼튼, 딥브레인AI, 업스테이지',
      satisfaction: '⭐️ 4.3 / 5.0 (최신 기술을 다루는 즐거움)',
      salary: '초봉 4,500 ~ 6,000만 원'
    },
    '그로스 해커': {
      title: '그로스 해커',
      tasks: '퍼널 분석, 그로스 실험 설계, 퍼포먼스 마케팅 최적화, 바이럴 루프 구축',
      certs: 'GA4 인증, 검색광고마케터',
      companies: '오늘의집, 뱅크샐러드, 올웨이즈',
      satisfaction: '⭐️ 4.2 / 5.0 (빠른 호흡의 성장 경험)',
      salary: '초봉 3,800 ~ 4,500만 원'
    },
    '콘텐츠 마케터': {
      title: '콘텐츠 마케터',
      tasks: '브랜드 SNS 채널 운영, 블로그 아티클 작성, 숏폼 콘텐츠 기획 및 제작',
      certs: '디지털마케팅자격증, 포토샵/프리미어 숙련도',
      companies: '야놀자, 무신사, 아이디어스',
      satisfaction: '⭐️ 4.0 / 5.0 (아이디어가 실현되는 즐거움)',
      salary: '초봉 3,000 ~ 3,600만 원'
    },
    'UX/UI 디자이너': {
      title: 'UX/UI 디자이너',
      tasks: '사용자 리서치, 와이어프레임 설계, 프로토타이핑, 디자인 시스템 구축',
      certs: '컬러리스트기사, 시각디자인기사',
      companies: '토스, 카카오스타일, 오늘의집',
      satisfaction: '⭐️ 4.1 / 5.0 (창의적 문제 해결 경험)',
      salary: '초봉 3,200 ~ 3,800만 원'
    }
  };

  const VLOGS = [
    { id: 1, title: '3년차 퍼포먼스 마케터의 현실', tag: '추천 직업', isPremium: true },
    { id: 2, title: '네카라쿠배 프론트엔드 하루', tag: '인기 직업', isPremium: true },
    { id: 3, title: 'UI 디자이너 포트폴리오 피드백', tag: '관련 직업', isPremium: false },
  ];

  const TRENDING_JOBS = ['데이터 분석가', 'AI 프롬프트 엔지니어', '그로스 해커'];

  return (
    <main className="min-h-full pb-20 bg-background flex flex-col relative">
      <header className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">직무 탐색 허브 🧭</h1>
        <p className="text-sm text-slate-400">요즘 뜨는 직무부터 숨겨진 꿀 직무까지 탐색해보세요.</p>
      </header>

      {/* 1. 요새 뜨는 직업 (순위 표기) */}
      <section className="px-6 mb-8">
        <h2 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>🔥</span> 요새 뜨는 직업
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {TRENDING_JOBS.map((job, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedJob(JOB_INFO[job as keyof typeof JOB_INFO])}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-primary/50 transition-colors rounded-xl p-4 min-w-[150px] snap-center flex-shrink-0 cursor-pointer relative"
            >
              <div className="absolute -top-2 -left-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-500/30">
                {idx + 1}
              </div>
              <div className="text-2xl mb-2 mt-1">📈</div>
              <h3 className="text-white font-medium text-sm">{job}</h3>
              <p className="text-xs text-primary mt-1">상세 보기 &gt;</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 추천 직업 / 인기 직업 카테고리화 */}
      <section className="px-6 mb-8">
        {/* 탭 헤더 */}
        <div className="flex gap-6 border-b border-slate-700 mb-4">
          <button 
            onClick={() => setActiveCategory('recommended')} 
            className={`pb-2 text-base font-bold transition-colors border-b-2 ${activeCategory === 'recommended' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-400'}`}
          >
            추천 직업
          </button>
          <button 
            onClick={() => setActiveCategory('popular')} 
            className={`pb-2 text-base font-bold transition-colors border-b-2 ${activeCategory === 'popular' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-400'}`}
          >
            인기 직업
          </button>
        </div>

        {/* 직무 리스트 (클릭 시 모달) */}
        <div className="space-y-3">
          {activeCategory === 'recommended' && ['콘텐츠 마케터', '그로스 해커'].map(job => (
            <div 
              key={job} 
              onClick={() => setSelectedJob(JOB_INFO[job as keyof typeof JOB_INFO])}
              className="w-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center cursor-pointer transition-colors"
            >
              <span className="text-slate-200 font-medium">{job}</span>
              <span className="text-slate-500 text-xs">상세 보기 &gt;</span>
            </div>
          ))}
          {activeCategory === 'popular' && ['데이터 분석가', 'AI 프롬프트 엔지니어', 'UX/UI 디자이너'].map(job => (
            <div 
              key={job} 
              onClick={() => setSelectedJob(JOB_INFO[job as keyof typeof JOB_INFO])}
              className="w-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center cursor-pointer transition-colors"
            >
              <span className="text-slate-200 font-medium">{job}</span>
              <span className="text-slate-500 text-xs">상세 보기 &gt;</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 리얼 직무 VLOG 섹션 (프리미엄 기능 포함) */}
      <section className="px-6 pb-6 space-y-6">
        <div>
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🎬</span> 현직자 리얼 VLOG
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {VLOGS.map((vlog) => (
              <div 
                key={vlog.id} 
                onClick={() => (!isSubscribed && vlog.isPremium) ? setShowPremiumModal(true) : alert('영상이 재생됩니다.')}
                className="min-w-[240px] h-36 bg-slate-800 rounded-xl relative overflow-hidden flex-shrink-0 snap-center cursor-pointer group border border-slate-700"
              >
                {(!isSubscribed && vlog.isPremium) ? (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center group-hover:bg-black/70 transition-colors z-10">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-2">🔒</span>
                      <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg shadow-yellow-500/20">Premium Unlock</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center text-white pl-1 shadow-lg">▶</span>
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-0 ${(!isSubscribed && vlog.isPremium) ? 'blur-sm' : ''}`}></div>
                <div className="absolute top-2 right-2 z-0">
                  <span className="bg-slate-900/80 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-400/30">{vlog.tag}</span>
                </div>
                <div className={`absolute bottom-3 left-3 right-3 z-0 ${(!isSubscribed && vlog.isPremium) ? 'blur-[3px]' : ''}`}>
                  <p className="text-white text-sm font-medium line-clamp-2 leading-snug">{vlog.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 시크릿 자격증 로드맵 */}
        <div>
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🗺️</span> 시크릿 합격 로드맵
          </h2>
          <div className="relative h-48 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className={`absolute inset-0 p-5 ${!isSubscribed ? 'filter blur-[6px] opacity-40' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
              <h3 className="text-white font-bold mb-4">비전공자 네카라쿠배 합격 커리큘럼</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-500 text-xs flex items-center justify-center font-bold">1</div><div className="h-4 bg-slate-600 rounded w-2/3"></div></div>
                <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-500 text-xs flex items-center justify-center font-bold">2</div><div className="h-4 bg-slate-600 rounded w-3/4"></div></div>
                <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-emerald-500 text-xs flex items-center justify-center font-bold">3</div><div className="h-4 bg-slate-600 rounded w-1/2"></div></div>
              </div>
            </div>
            
            {!isSubscribed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                <button 
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-xl font-bold shadow-2xl transform transition-transform active:scale-95 flex items-center gap-2"
                >
                  <span>🔓</span> 프리미엄 멤버십으로 열람하기
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 프리미엄 결제 모달 */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <div className="text-center mt-4">
              <div className="text-5xl mb-4 drop-shadow-lg shadow-yellow-500">💎</div>
              <h2 className="text-2xl font-bold text-white mb-2">프리미엄 멤버십</h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">월 9,900원 구독하고 현직자의 리얼한 고충과 시크릿 합격 로드맵을 모두 확인하세요!</p>
              <button 
                onClick={handleSubscribe}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-extrabold text-lg rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform"
              >
                지금 바로 구독하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 직무 상세 모달 */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-t border-slate-700 sm:border rounded-t-3xl sm:rounded-2xl w-full max-w-[480px] sm:max-w-sm max-h-[85vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur pb-4 pt-6 px-6 border-b border-slate-800 z-10 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-emerald-400">{selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="p-6">
              <ul className="space-y-6 text-sm">
                <li>
                  <span className="block text-slate-500 mb-2 text-xs font-bold uppercase">상세 실무 내용</span>
                  <span className="text-slate-200 leading-relaxed bg-slate-800/50 p-3 rounded-lg block">{selectedJob.tasks}</span>
                </li>
                <li>
                  <span className="block text-slate-500 mb-2 text-xs font-bold uppercase">평균 연봉</span>
                  <span className="text-primary font-bold text-lg bg-emerald-500/10 p-3 rounded-lg block border border-emerald-500/20">{selectedJob.salary}</span>
                </li>
                <li>
                  <span className="block text-slate-500 mb-2 text-xs font-bold uppercase">필요 자격증/스킬</span>
                  <span className="text-slate-300 leading-relaxed block">{selectedJob.certs}</span>
                </li>
                <li>
                  <span className="block text-slate-500 mb-2 text-xs font-bold uppercase">주요 채용 회사</span>
                  <span className="text-slate-300 block">{selectedJob.companies}</span>
                </li>
                <li>
                  <span className="block text-slate-500 mb-2 text-xs font-bold uppercase">직무 만족도</span>
                  <span className="text-yellow-400 font-medium text-lg block">{selectedJob.satisfaction}</span>
                </li>
              </ul>
              
              <button onClick={() => setSelectedJob(null)} className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
