'use client';

import { useState, useEffect } from 'react';

type JobCategory = 'recommended' | 'popular';

export default function DashboardPage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<JobCategory>('recommended');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedVlogQuery, setSelectedVlogQuery] = useState<string | null>(null);
  const [userPersona, setUserPersona] = useState<any>(null);
  const [vlogs, setVlogs] = useState<any[]>([]);

  useEffect(() => {
    // 저장된 페르소나와 구독 상태 불러오기
    let currentPersona = null;
    const savedPersona = localStorage.getItem('userPersona');
    if (savedPersona) {
      try {
        currentPersona = JSON.parse(savedPersona);
        setUserPersona(currentPersona);
      } catch (e) {
        console.error(e);
      }
    }
    const sub = localStorage.getItem('isSubscribed');
    const currentSub = sub === 'true';
    if (currentSub) {
      setIsSubscribed(true);
    }

    // BFF에서 VLOG 데이터 Fetch
    fetch(`/api/vlogs?isPremium=${currentSub}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // 페르소나 기반 직무 추출 (추천 직업)
          const jobs = currentPersona?.jobs || ['콘텐츠 마케터', '그로스 해커'];
          // 추천 직무와 일치하는 VLOG만 필터링
          const filtered = data.data.filter((v: any) => jobs.includes(v.jobName));
          setVlogs(filtered.length > 0 ? filtered : data.data.slice(0, 5));
        }
      })
      .catch(e => console.error(e));
  }, []);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    localStorage.setItem('isSubscribed', 'true');
    setShowPremiumModal(false);

    // 구독 완료 시 진짜 영상 링크를 얻기 위해 BFF 재호출
    fetch(`/api/vlogs?isPremium=true`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const jobs = userPersona?.jobs || ['콘텐츠 마케터', '그로스 해커'];
          const filtered = data.data.filter((v: any) => jobs.includes(v.jobName));
          setVlogs(filtered.length > 0 ? filtered : data.data.slice(0, 5));
        }
      });
  };

  const JOB_INFO: Record<string, any> = {
    '데이터 분석가': { title: '데이터 분석가', tasks: '데이터 파이프라인 구축, A/B 테스트 검증, 프로덕트 지표 분석', certs: 'SQLD, ADsP', companies: '토스, 당근, 네이버웹툰', satisfaction: '⭐️ 4.5', salary: '초봉 4,000만 원' },
    'AI 프롬프트 엔지니어': { title: 'AI 프롬프트 엔지니어', tasks: 'LLM 프롬프트 최적화, 파인튜닝', certs: 'AI 해커톤 입상 우대', companies: '뤼튼, 업스테이지', satisfaction: '⭐️ 4.3', salary: '초봉 4,500만 원' },
    '그로스 해커': { title: '그로스 해커', tasks: '퍼널 분석, 그로스 실험 설계', certs: 'GA4 인증', companies: '오늘의집, 뱅크샐러드', satisfaction: '⭐️ 4.2', salary: '초봉 3,800만 원' },
    '콘텐츠 마케터': { title: '콘텐츠 마케터', tasks: '브랜드 SNS 운영, 숏폼 기획', certs: '디지털마케팅자격증', companies: '야놀자, 무신사', satisfaction: '⭐️ 4.0', salary: '초봉 3,000만 원' },
    'UX/UI 디자이너': { title: 'UX/UI 디자이너', tasks: '사용자 리서치, 와이어프레임 설계', certs: '시각디자인기사', companies: '토스, 카카오스타일', satisfaction: '⭐️ 4.1', salary: '초봉 3,200만 원' }
  };

  const fallbackJob = { title: '상세 정보', tasks: '다양한 실무 경험', certs: '관련 포트폴리오', companies: '유망 스타트업', satisfaction: '⭐️ 4.0', salary: '회사 내규에 따름' };

  const getJobInfo = (jobName: string) => JOB_INFO[jobName] || { ...fallbackJob, title: jobName };

  const TRENDING_JOBS = ['데이터 분석가', 'AI 프롬프트 엔지니어', '그로스 해커'];
  
  // AI 추천 직업 동적 할당
  const recommendedJobs = userPersona?.jobs || ['콘텐츠 마케터', '그로스 해커'];

  return (
    <main className="min-h-full pb-20 bg-slate-50 flex flex-col relative">
      <header className="p-8 pb-6 bg-white rounded-b-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border-b border-slate-100 z-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
          {userPersona ? `${userPersona.name}님을 위한 탐색 허브 🧭` : '직무 탐색 허브 🧭'}
        </h1>
        <p className="text-sm font-medium text-slate-500 leading-relaxed">
          {userPersona ? '나의 커리어 성향에 꼭 맞는 직무와 로드맵을 확인하세요.' : '요즘 뜨는 직무부터 숨겨진 꿀 직무까지 탐색해보세요.'}
        </p>
      </header>

      <div className="flex-1 bg-slate-50 mt-4 space-y-8">
        {/* 1. 요새 뜨는 직업 (순위 표기) */}
        <section className="px-6">
          <h2 className="text-slate-900 font-extrabold text-xl mb-4 flex items-center gap-2">
            <span>🔥</span> 요새 뜨는 직업
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x px-2 -mx-2">
            {TRENDING_JOBS.map((job, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedJob(getJobInfo(job))}
                className="bg-white hover:bg-slate-50 border border-slate-100 transition-colors rounded-3xl p-6 min-w-[160px] snap-center flex-shrink-0 cursor-pointer relative shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_15px_rgb(168,85,247,0.4)]">
                  {idx + 1}
                </div>
                <div className="text-3xl mb-3 mt-1">📈</div>
                <h3 className="text-slate-900 font-bold text-base tracking-tight">{job}</h3>
                <p className="text-xs font-semibold text-primary mt-2 flex items-center gap-1">상세 보기 <span className="text-[10px]">➔</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 추천 직업 / 인기 직업 카테고리화 */}
        <section className="px-6">
          <div className="flex gap-6 border-b border-slate-200 mb-6">
            <button 
              onClick={() => setActiveCategory('recommended')} 
              className={`pb-3 text-base font-bold transition-all border-b-2 ${activeCategory === 'recommended' ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              AI 추천 직업
            </button>
            <button 
              onClick={() => setActiveCategory('popular')} 
              className={`pb-3 text-base font-bold transition-all border-b-2 ${activeCategory === 'popular' ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              인기 직업
            </button>
          </div>

          <div className="space-y-4">
            {activeCategory === 'recommended' && recommendedJobs.map((job: string) => (
              <div 
                key={job} 
                onClick={() => setSelectedJob(getJobInfo(job))}
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl p-5 flex justify-between items-center cursor-pointer transition-all shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
              >
                <span className="text-slate-900 font-bold flex items-center gap-3 text-lg"><span className="text-primary text-xl">✨</span> {job}</span>
                <span className="text-slate-400 text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-full">상세 보기 ➔</span>
              </div>
            ))}
            {activeCategory === 'popular' && ['데이터 분석가', 'AI 프롬프트 엔지니어', 'UX/UI 디자이너'].map(job => (
              <div 
                key={job} 
                onClick={() => setSelectedJob(getJobInfo(job))}
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl p-5 flex justify-between items-center cursor-pointer transition-all shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
              >
                <span className="text-slate-900 font-bold flex items-center gap-3 text-lg"><span className="text-xl">🔥</span> {job}</span>
                <span className="text-slate-400 text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-full">상세 보기 ➔</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 리얼 직무 VLOG 섹션 */}
        <section className="px-6 space-y-8 pb-8">
          <div>
            <h2 className="text-slate-900 font-extrabold text-xl mb-4 flex items-center gap-2">
              <span>🎬</span> 현직자 리얼 VLOG
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x hide-scrollbar px-2 -mx-2">
              {vlogs.map((vlog: any) => (
                <div 
                  key={vlog.id} 
                  onClick={() => {
                    if (!vlog.videoUrl) {
                      setShowPremiumModal(true);
                    } else {
                      window.open(vlog.videoUrl, '_blank');
                    }
                  }}
                  className="min-w-[260px] h-40 bg-white rounded-3xl relative overflow-hidden flex-shrink-0 snap-center cursor-pointer group border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.05)] flex items-center justify-center"
                >
                  {/* 썸네일 이미지 렌더링 */}
                  {vlog.thumbnailUrl ? (
                    <img src={vlog.thumbnailUrl} alt={vlog.title} className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 z-0"></div>
                  )}

                  {/* 하단 제목 표시영역 */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                    <p className="text-white text-sm font-bold line-clamp-2 drop-shadow-md leading-snug">{vlog.title}</p>
                  </div>

                  {/* 영상이 막힌 프리미엄 유저인지, 열려있는지 분기처리 */}
                  {(!vlog.videoUrl) ? (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] flex flex-col items-center justify-center group-hover:bg-white/50 transition-colors z-10">
                      <div className="w-14 h-14 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex items-center justify-center mb-2">
                        <span className="text-2xl text-slate-800">🔒</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                      <span className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-primary pl-1 shadow-[0_8px_30px_rgb(0,0,0,0.2)] text-xl">▶</span>
                    </div>
                  )}
                  
                  {/* 상단 뱃지 */}
                  <div className="absolute top-3 right-3 z-20">
                    {vlog.isPremium ? (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm">Premium</span>
                    ) : (
                      <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">Free</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 시크릿 자격증 로드맵 */}
          <div>
            <h2 className="text-slate-900 font-extrabold text-xl mb-4 flex items-center gap-2">
              <span>🗺️</span> 시크릿 합격 로드맵
            </h2>
            <div className="relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className={`p-6 ${!isSubscribed ? 'h-56 filter blur-[8px] opacity-40 overflow-hidden' : ''}`}>
                <h3 className="text-slate-900 font-extrabold mb-6 text-lg tracking-tight">
                  <span className="text-primary">{userPersona ? `[${userPersona.jobs[0]}]` : '네카라쿠배'}</span> 비전공자 합격 커리큘럼
                </h3>
                
                {!isSubscribed ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-slate-200 text-xs flex items-center justify-center font-bold">1</div><div className="h-5 bg-slate-100 rounded-lg w-2/3"></div></div>
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-slate-200 text-xs flex items-center justify-center font-bold">2</div><div className="h-5 bg-slate-100 rounded-lg w-3/4"></div></div>
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-slate-200 text-xs flex items-center justify-center font-bold">3</div><div className="h-5 bg-slate-100 rounded-lg w-1/2"></div></div>
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shadow-sm border border-primary/20 shrink-0 z-10 text-xs font-extrabold">1</div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <div className="font-extrabold text-slate-900 text-sm mb-1.5">직무 기초 지식 습득</div>
                        <div className="text-xs font-medium text-slate-500 leading-relaxed">가장 기본적인 용어와 원리를 파악하고 관련 도서 3권 이상 정독하기</div>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shadow-sm border border-primary/20 shrink-0 z-10 text-xs font-extrabold">2</div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <div className="font-extrabold text-slate-900 text-sm mb-1.5">필수 툴 및 기술 스택 마스터</div>
                        <div className="text-xs font-medium text-slate-500 leading-relaxed">현업에서 요구하는 필수 기술을 활용하여 간단한 토이 프로젝트 진행</div>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shadow-sm border border-primary/20 shrink-0 z-10 text-xs font-extrabold">3</div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <div className="font-extrabold text-slate-900 text-sm mb-1.5">실전 포트폴리오 구축</div>
                        <div className="text-xs font-medium text-slate-500 leading-relaxed">문제 해결 과정을 담은 노션/깃허브 포트폴리오 작성 (수치화된 성과 포함)</div>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shadow-sm border border-primary/20 shrink-0 z-10 text-xs font-extrabold">4</div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <div className="font-extrabold text-slate-900 text-sm mb-1.5">면접 및 코딩/과제 테스트</div>
                        <div className="text-xs font-medium text-slate-500 leading-relaxed">STAR 기법을 활용한 예상 질문 리스트 작성 및 모의 면접 반복 훈련</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {!isSubscribed && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px]">
                  <button 
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-extrabold shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 transform transition-transform active:scale-95 flex items-center gap-3"
                  >
                    <span className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-sm">🔓</span> 프리미엄 멤버십으로 열람하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 프리미엄 결제 모달 */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center font-bold">✕</button>
            <div className="text-center mt-2">
              <div className="text-6xl mb-6 drop-shadow-sm">💎</div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">프리미엄 멤버십</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">월 9,900원 구독하고 AI가 맞춤 추천하는 시크릿 합격 로드맵과 현직자 VLOG를 모두 확인하세요!</p>
              <button 
                onClick={handleSubscribe}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-500 text-white font-extrabold text-lg rounded-2xl shadow-[0_8px_30px_rgb(168,85,247,0.3)] active:scale-95 transition-transform"
              >
                지금 바로 구독하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 직무 상세 모달 */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white sm:border border-slate-100 rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-[480px] sm:max-w-sm max-h-[85vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md pb-4 pt-8 px-8 border-b border-slate-100 z-10 flex justify-between items-center">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold">✕</button>
            </div>
            
            <div className="p-8">
              <ul className="space-y-6 text-sm">
                <li>
                  <span className="block text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">상세 실무 내용</span>
                  <span className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl block">{selectedJob.tasks}</span>
                </li>
                <li>
                  <span className="block text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">평균 연봉</span>
                  <span className="text-primary font-bold text-lg bg-primary/5 p-4 rounded-2xl block border border-primary/10">{selectedJob.salary}</span>
                </li>
                <li>
                  <span className="block text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">필요 자격증/스킬</span>
                  <span className="text-slate-700 font-medium leading-relaxed block bg-slate-50 p-4 rounded-2xl">{selectedJob.certs}</span>
                </li>
                <li>
                  <span className="block text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">주요 채용 회사</span>
                  <span className="text-slate-700 font-medium block bg-slate-50 p-4 rounded-2xl">{selectedJob.companies}</span>
                </li>
                <li>
                  <span className="block text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">직무 만족도</span>
                  <span className="text-yellow-500 font-extrabold text-lg block bg-slate-50 p-4 rounded-2xl">{selectedJob.satisfaction}</span>
                </li>
              </ul>
              
              <button onClick={() => setSelectedJob(null)} className="w-full mt-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-colors shadow-sm">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
