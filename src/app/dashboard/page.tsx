'use client';

import { useState, useEffect, useRef } from 'react';
import { Flame, TrendingUp, Sparkles, Video, Lock, Unlock, Map as MapIcon, Gem, ChevronRight, ChevronDown, PlayCircle, Building2, Clock, Link as LinkIcon, X } from 'lucide-react';

type JobCategory = 'recommended' | 'popular';

export default function DashboardPage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<JobCategory>('recommended');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [userPersona, setUserPersona] = useState<any>(null);
  const [vlogs, setVlogs] = useState<any[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const scrollRefJobs = useRef<HTMLDivElement>(null);
  const scrollRefVlogs = useRef<HTMLDivElement>(null);

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
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

    fetch(`/api/vlogs?isPremium=${currentSub}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const jobs = currentPersona?.jobs || ['콘텐츠 마케터', '그로스 해커'];
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
    '데이터 분석가': { title: '데이터 분석가', tasks: '데이터 파이프라인 구축, A/B 테스트 검증, 프로덕트 지표 분석', certs: 'SQLD, ADsP', companies: '토스, 당근, 네이버웹툰', satisfaction: '4.5', salary: '초봉 4,000만 원' },
    'AI 프롬프트 엔지니어': { title: 'AI 프롬프트 엔지니어', tasks: 'LLM 프롬프트 최적화, 파인튜닝', certs: 'AI 해커톤 입상 우대', companies: '뤼튼, 업스테이지', satisfaction: '4.3', salary: '초봉 4,500만 원' },
    '그로스 해커': { title: '그로스 해커', tasks: '퍼널 분석, 그로스 실험 설계', certs: 'GA4 인증', companies: '오늘의집, 뱅크샐러드', satisfaction: '4.2', salary: '초봉 3,800만 원' },
    '콘텐츠 마케터': { title: '콘텐츠 마케터', tasks: '브랜드 SNS 운영, 숏폼 기획', certs: '디지털마케팅자격증', companies: '야놀자, 무신사', satisfaction: '4.0', salary: '초봉 3,000만 원' },
    'UX/UI 디자이너': { title: 'UX/UI 디자이너', tasks: '사용자 리서치, 와이어프레임 설계', certs: '시각디자인기사', companies: '토스, 카카오스타일', satisfaction: '4.1', salary: '초봉 3,200만 원' }
  };

  const fallbackJob = { title: '상세 정보', tasks: '다양한 실무 경험', certs: '관련 포트폴리오', companies: '유망 스타트업', satisfaction: '4.0', salary: '회사 내규에 따름' };
  const getJobInfo = (jobName: string) => JOB_INFO[jobName] || { ...fallbackJob, title: jobName };
  const TRENDING_JOBS = ['데이터 분석가', 'AI 프롬프트 엔지니어', '그로스 해커'];
  const recommendedJobs = userPersona?.jobs || ['콘텐츠 마케터', '그로스 해커'];

  const roadmapSteps = [
    { step: 1, title: '직무 기초 지식 습득', desc: '가장 기본적인 용어와 원리를 파악하고 관련 도서 3권 이상 정독하기. 모르는 용어는 노션에 정리하며 나만의 단어장을 만드세요.' },
    { step: 2, title: '필수 툴 및 기술 스택 마스터', desc: '현업에서 요구하는 필수 기술을 활용하여 간단한 토이 프로젝트 진행. 완벽하지 않아도 일단 부딪혀보는 것이 중요합니다.' },
    { step: 3, title: '실전 포트폴리오 구축', desc: '문제 해결 과정을 담은 노션/깃허브 포트폴리오 작성. 결과보다는 과정과 숫자로 표현된 성과(수치화)를 반드시 포함하세요.' },
    { step: 4, title: '면접 및 코딩/과제 테스트', desc: 'STAR 기법(Situation, Task, Action, Result)을 활용한 예상 질문 리스트 작성 및 모의 면접 반복 훈련.' },
  ];

  return (
    <main className="min-h-full pb-24 bg-slate-50 flex flex-col relative break-keep whitespace-pre-wrap">
      <header className="px-6 pt-10 pb-8 bg-white rounded-b-[2rem] shadow-sm border-b border-slate-100 z-10 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full filter blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight flex flex-col">
          <span>{userPersona ? `${userPersona.name}님을 위한` : '당신을 위한'}</span>
          <span>직무 탐색 허브</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 leading-relaxed">
          {userPersona ? '나의 커리어 성향에 꼭 맞는 직무와 로드맵을 확인하세요.' : '요즘 뜨는 직무부터 숨겨진 꿀 직무까지 탐색해보세요.'}
        </p>
      </header>

      <div className="flex-1 space-y-10">
        {/* 1. 요새 뜨는 직업 (가로 스크롤) */}
        <section className="px-6">
          <h2 className="text-slate-900 font-extrabold text-xl mb-5 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            요새 뜨는 직업
          </h2>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x pr-12" ref={scrollRefJobs}>
              {TRENDING_JOBS.map((job, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedJob(getJobInfo(job))}
                  className="bg-white hover:bg-slate-50 border border-slate-100 transition-colors rounded-3xl p-6 w-[75%] max-w-[240px] snap-center flex-shrink-0 cursor-pointer relative shadow-sm"
                >
                  <div className="absolute top-0 left-0 w-8 h-8 bg-blue-600 rounded-tl-3xl rounded-br-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {idx + 1}
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-3 mt-2" />
                  <h3 className="text-slate-900 font-extrabold text-lg tracking-tight mb-2">{job}</h3>
                </div>
              ))}
            </div>
            {/* 우측 그라데이션 및 화살표 오버레이 */}
            <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent flex items-center justify-end pointer-events-none z-10">
              <button 
                onClick={(e) => scrollRight(scrollRefJobs, e)}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto mr-1 hover:text-blue-600 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. 직업 카테고리 (꽉 찬 박스 리스트) */}
        <section className="px-6">
          <div className="flex gap-6 border-b border-slate-200 mb-6">
            <button 
              onClick={() => setActiveCategory('recommended')} 
              className={`pb-3 text-base font-bold transition-all border-b-2 ${activeCategory === 'recommended' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              AI 추천 직업
            </button>
            <button 
              onClick={() => setActiveCategory('popular')} 
              className={`pb-3 text-base font-bold transition-all border-b-2 ${activeCategory === 'popular' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              인기 직업
            </button>
          </div>

          <div className="space-y-3">
            {activeCategory === 'recommended' && recommendedJobs.map((job: string) => (
              <button 
                key={job} 
                onClick={() => setSelectedJob(getJobInfo(job))}
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-5 flex justify-between items-center transition-all shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-slate-900 font-extrabold text-[17px]">{job}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300" />
              </button>
            ))}
            {activeCategory === 'popular' && ['데이터 분석가', 'AI 프롬프트 엔지니어', 'UX/UI 디자이너'].map(job => (
              <button 
                key={job} 
                onClick={() => setSelectedJob(getJobInfo(job))}
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-5 flex justify-between items-center transition-all shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-slate-900 font-extrabold text-[17px]">{job}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300" />
              </button>
            ))}
          </div>
        </section>

        {/* 3. 현직자 리얼 VLOG (가로 스크롤) */}
        <section className="px-6">
          <h2 className="text-slate-900 font-extrabold text-xl mb-5 flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-500" />
            현직자 리얼 VLOG
          </h2>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x hide-scrollbar pr-12" ref={scrollRefVlogs}>
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
                  className="w-[80%] max-w-[280px] h-44 bg-white rounded-3xl relative overflow-hidden flex-shrink-0 snap-center cursor-pointer group border border-slate-100 shadow-sm flex items-center justify-center"
                >
                  {vlog.thumbnailUrl ? (
                    <img src={vlog.thumbnailUrl} alt={vlog.title} className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 z-0"></div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-20">
                    <p className="text-white text-[15px] font-bold line-clamp-2 drop-shadow-md leading-snug">{vlog.title}</p>
                  </div>

                  {(!vlog.videoUrl) ? (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center group-hover:bg-white/50 transition-colors z-10">
                      <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-800">
                        <Lock className="w-6 h-6" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                        <PlayCircle className="w-10 h-10" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 z-20">
                    {vlog.isPremium ? (
                      <span className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">Premium</span>
                    ) : (
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">Free</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* 우측 그라데이션 및 화살표 오버레이 */}
            <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent flex items-center justify-end pointer-events-none z-10">
              <button 
                onClick={(e) => scrollRight(scrollRefVlogs, e)}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto mr-1 hover:text-blue-600 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. 시크릿 자격증 로드맵 (Accordion UI) */}
        <section className="px-6 pb-10">
          <h2 className="text-slate-900 font-extrabold text-xl mb-5 flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-emerald-500" />
            시크릿 합격 로드맵
          </h2>
          <div className="relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <div className={`p-6 ${!isSubscribed ? 'h-56 filter blur-[8px] opacity-40 overflow-hidden pointer-events-none' : ''}`}>
              <h3 className="text-slate-900 font-extrabold mb-6 text-lg tracking-tight">
                <span className="text-blue-600">{userPersona ? `[${userPersona.jobs[0]}]` : '네카라쿠배'}</span> 합격 커리큘럼
              </h3>
              
              <div className="space-y-3">
                {roadmapSteps.map(step => (
                  <div key={step.step} className="border border-slate-100 rounded-2xl bg-slate-50 overflow-hidden transition-all">
                    <button 
                      onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)} 
                      className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xs shadow-sm border border-blue-100 shrink-0">
                          {step.step}
                        </div>
                        <span className="font-extrabold text-slate-900 text-[15px]">{step.title}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${expandedStep === step.step ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedStep === step.step && (
                      <div className="p-5 pt-3 bg-white text-slate-500 text-sm leading-relaxed text-justify break-keep whitespace-pre-wrap animate-in fade-in slide-in-from-top-2 duration-200 border-t border-slate-50">
                        {step.desc}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {!isSubscribed && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px] z-10">
                <button 
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-extrabold shadow-sm border border-slate-100 transform transition-transform active:scale-95 flex items-center gap-3"
                >
                  <span className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-slate-800"><Unlock className="w-4 h-4" /></span> 
                  프리미엄 멤버십 열람
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 프리미엄 결제 모달 */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center font-bold">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mt-2">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Gem className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">프리미엄 멤버십</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium break-keep whitespace-pre-wrap">월 9,900원 구독하고 AI가 맞춤 추천하는 시크릿 합격 로드맵과 현직자 VLOG를 모두 확인하세요!</p>
              <button 
                onClick={handleSubscribe}
                className="w-full py-4 bg-blue-600 text-white font-extrabold text-lg rounded-2xl shadow-sm active:scale-95 transition-transform"
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
          <div className="bg-white sm:border border-slate-100 rounded-t-[2rem] sm:rounded-3xl w-full max-w-[480px] sm:max-w-sm max-h-[85vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md pb-4 pt-8 px-8 border-b border-slate-100 z-10 flex justify-between items-center">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8">
              <ul className="space-y-6 text-sm">
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-3 text-xs font-bold uppercase tracking-wider"><Building2 className="w-4 h-4" /> 주요 채용 회사</span>
                  <span className="text-slate-700 font-bold block bg-slate-50 p-4 rounded-2xl border border-slate-100">{selectedJob.companies}</span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-3 text-xs font-bold uppercase tracking-wider"><Clock className="w-4 h-4" /> 상세 실무 내용</span>
                  <span className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl block border border-slate-100 break-keep whitespace-pre-wrap">{selectedJob.tasks}</span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-3 text-xs font-bold uppercase tracking-wider"><Gem className="w-4 h-4" /> 평균 연봉</span>
                  <span className="text-blue-600 font-extrabold text-lg bg-blue-50 p-4 rounded-2xl block border border-blue-100">{selectedJob.salary}</span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-3 text-xs font-bold uppercase tracking-wider"><LinkIcon className="w-4 h-4" /> 필요 자격증/스킬</span>
                  <span className="text-slate-600 font-medium leading-relaxed block bg-slate-50 p-4 rounded-2xl border border-slate-100 break-keep whitespace-pre-wrap">{selectedJob.certs}</span>
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
