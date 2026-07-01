'use client';

import { useState, useEffect, useRef } from 'react';
import { Flame, TrendingUp, Sparkles, Video, Lock, Unlock, Map as MapIcon, Gem, ChevronRight, ChevronLeft, ChevronDown, PlayCircle, Building2, Clock, Link as LinkIcon, X, ArrowRight, Briefcase, BookOpen, Users, Rocket, Target, CheckCircle, Camera } from 'lucide-react';
import Link from 'next/link';

type JobCategory = 'recommended' | 'popular';

import { ROADMAP_DATA, getDefaultRoadmap } from '@/data/roadmaps';

export default function DashboardPage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<JobCategory>('recommended');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [userPersona, setUserPersona] = useState<any>(null);
  const [vlogs, setVlogs] = useState<any[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [questExp, setQuestExp] = useState(640);
  const [badgeProgress, setBadgeProgress] = useState([
    { id: 'portfolio', name: '포트폴리오', count: 2, total: 5, icon: Briefcase, color: '#A855F7', bg: 'bg-purple-50' },
    { id: 'learning', name: '직무 학습', count: 5, total: 5, icon: BookOpen, color: '#10B981', bg: 'bg-emerald-50' },
    { id: 'networking', name: '네트워킹', count: 1, total: 5, icon: Users, color: '#3B82F6', bg: 'bg-blue-50' },
    { id: 'experience', name: '실전 경험', count: 0, total: 5, icon: Rocket, color: '#EF4444', bg: 'bg-red-50' }
  ]);

  const scrollRefJobs = useRef<HTMLDivElement>(null);
  const scrollRefVlogs = useRef<HTMLDivElement>(null);
  const scrollRefQuests = useRef<HTMLDivElement>(null);

  const [canScrollLeftJobs, setCanScrollLeftJobs] = useState(false);
  const [canScrollRightJobs, setCanScrollRightJobs] = useState(true);
  const [canScrollLeftVlogs, setCanScrollLeftVlogs] = useState(false);
  const [canScrollRightVlogs, setCanScrollRightVlogs] = useState(true);
  const [canScrollLeftQuests, setCanScrollLeftQuests] = useState(false);
  const [canScrollRightQuests, setCanScrollRightQuests] = useState(true);

  const handleVerifySubmit = () => {
    if (!uploadedFileName || !selectedQuest) {
      alert('사진이나 관련 자료를 먼저 첨부해주세요!');
      return;
    }
    
    setQuestExp(prev => Math.min(prev + selectedQuest.exp, 1000));
    
    setBadgeProgress(prev => prev.map(badge => {
      if (badge.id === selectedQuest.badgeId) {
        return { ...badge, count: Math.min(badge.count + 1, badge.total) };
      }
      return badge;
    }));
    
    setShowQuestModal(false);
    setUploadedFileName(null);
    setSelectedQuest(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, setLeft: Function, setRight: Function) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    setLeft(scrollLeft > 0);
    setRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current) {
      ref.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current) {
      ref.current.scrollBy({ left: -240, behavior: 'smooth' });
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
  const TRENDING_JOBS = ['데이터 분석가', 'AI 프롬프트 엔지니어', '그로스 해커', '콘텐츠 마케터', 'UX/UI 디자이너'];

  const TODAY_QUESTS = [
    { 
      id: 1, title: '관심 직무 1개 케이스 스터디 작성', badgeId: 'portfolio', category: '포트폴리오', exp: 120, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50',
      guide: '노션이나 블로그를 활용해 특정 프로덕트의 문제점과 개선 방안(문제 인식-해결 과정-결과)을 1장 분량으로 정리해 보세요.',
      verifyMethod: '작성 완료된 노션 페이지 또는 블로그 캡쳐 이미지 첨부'
    },
    { 
      id: 2, title: '현직자 멘토에게 질문 남기기', badgeId: 'networking', category: '네트워킹', exp: 80, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50',
      guide: '커뮤니티 탭 또는 링크드인을 통해 관심 직무의 현직자에게 정중하게 1가지 이상의 실무 관련 질문을 남겨보세요.',
      verifyMethod: '메시지를 보낸 화면 캡쳐 첨부'
    },
    { 
      id: 3, title: '직무 관련 아티클 3개 읽기', badgeId: 'learning', category: '직무 학습', exp: 50, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50',
      guide: '요즘IT, 브런치 등에서 본인 직무와 관련된 아티클 3개를 골라 읽고 가장 인상 깊은 한 줄을 기록해 보세요.',
      verifyMethod: '읽은 아티클의 제목 리스트 또는 캡쳐 이미지 첨부'
    },
    { 
      id: 4, title: '미니 인턴십 지원하기', badgeId: 'experience', category: '실전 경험', exp: 200, icon: Rocket, color: 'text-red-500', bg: 'bg-red-50',
      guide: '기업 연계 미니 인턴십 공고를 하나 찾아서, 해당 직무에 맞는 이력서를 제출하고 실무 과제에 도전해 보세요.',
      verifyMethod: '지원 완료 메일 또는 지원 내역 화면 캡쳐 첨부'
    },
  ];
  
  const recommendedJobs = userPersona?.jobs || ['콘텐츠 마케터', '그로스 해커'];
  
  // 추천 직무 2개 추출 (부족하면 기본값 매핑)
  const top2Jobs = recommendedJobs.slice(0, 2);

  return (
    <main className="min-h-full flex flex-col relative break-keep whitespace-pre-wrap bg-transparent">
      {/* 상단 네이비 헤더 영역 */}
      <header className="px-6 pt-12 pb-10 z-10 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full filter blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
        
        {/* CAREER PASS (글래스모피즘 카드) */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[28px] p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full filter blur-2xl translate-x-1/4 -translate-y-1/4 z-0"></div>
          
          <div className="relative z-10 flex items-start justify-between mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-white/10 rounded-[20px] flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white/60 text-[11px] font-extrabold tracking-widest mb-1">CAREER PASS</p>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {userPersona ? userPersona.name : '당신을 위한'}
                </h1>
                <p className="text-blue-200 text-sm font-medium mt-0.5">
                  {userPersona ? '나만의 커리어 트랙' : '직무 탐색 허브'}
                </p>
              </div>
            </div>
            
            <div className="w-14 h-14 rounded-full bg-blue-600/40 border border-blue-400/30 flex items-center justify-center flex-col shadow-inner backdrop-blur-sm">
              <span className="text-blue-200 text-[10px] font-bold leading-none mb-0.5">LV</span>
              <span className="text-white text-xl font-black leading-none">12</span>
            </div>
          </div>

          <div className="relative z-10 mb-5">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                <span className="text-blue-100 font-extrabold text-xs">EXP</span>
              </div>
              <span className="text-white/70 text-xs font-bold tracking-wide">{questExp} <span className="text-white/40">/ 1000</span></span>
            </div>
            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500" style={{ width: `${(questExp / 1000) * 100}%` }}></div>
            </div>
          </div>

          {/* 획득 뱃지 */}
          <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between">
            <span className="text-white/60 text-[10px] font-extrabold tracking-wide">획득 뱃지</span>
            <div className="flex gap-2.5">
              {badgeProgress.map((badge) => {
                const isCompleted = badge.count === badge.total;
                const isStarted = badge.count > 0;
                const radius = 14;
                const circumference = 2 * Math.PI * radius;
                const fillPercentage = (badge.count / badge.total) * 100;
                const offset = circumference - (fillPercentage / 100) * circumference;
                const BadgeIcon = badge.icon;
                
                return (
                  <div key={badge.id} className="relative w-8 h-8 rounded-full flex items-center justify-center bg-white/5">
                    {/* SVG Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                      {/* Background circle */}
                      <circle cx="50%" cy="50%" r={radius} className="stroke-white/10" strokeWidth="1.5" fill="none" />
                      {/* Progress circle */}
                      {isStarted && (
                        <circle 
                          cx="50%" 
                          cy="50%" 
                          r={radius} 
                          className={isCompleted ? "stroke-white" : "stroke-white/60"} 
                          strokeWidth="1.5" 
                          fill="none" 
                          strokeDasharray={circumference} 
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                        />
                      )}
                    </svg>
                    {/* Icon */}
                    <div className={`relative z-10 flex items-center justify-center w-full h-full rounded-full ${isCompleted ? 'bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`}>
                      <BadgeIcon className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : (isStarted ? 'text-white/70' : 'text-white/30')}`} strokeWidth={isCompleted ? 2.5 : 2} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* 하단 화이트 바디 영역 */}
      <div className="flex-1 bg-white rounded-t-[32px] pt-10 pb-24 shadow-[0_-10px_40px_rgb(0,0,0,0.12)] space-y-10 relative z-20">
        {/* 1. 요새 뜨는 직업 (가로 스크롤) */}
        <section className="px-5">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-slate-900 font-extrabold text-lg flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Flame className="w-5 h-5" strokeWidth={2} />
              </div>
              요새 뜨는 직업
            </h2>
            <Link href="/explore" className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-blue-600 transition-colors">
              직업 전체보기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="relative group">
            <div 
              className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x px-6" 
              ref={scrollRefJobs}
              onScroll={(e) => handleScroll(e, setCanScrollLeftJobs, setCanScrollRightJobs)}
            >
              {TRENDING_JOBS.map((job, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedJob(getJobInfo(job))}
                  className="bg-white hover:bg-slate-50 border border-slate-100 transition-colors rounded-3xl p-6 w-[75%] max-w-[240px] snap-center flex-shrink-0 cursor-pointer relative shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <div className="absolute top-0 left-0 w-7 h-7 bg-blue-600 rounded-tl-3xl rounded-br-2xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {idx + 1}
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-3 mt-1" strokeWidth={1.5} />
                  <h3 className="text-slate-900 font-extrabold text-[15px] tracking-tight mb-1">{job}</h3>
                </div>
              ))}
            </div>
            
            {/* 좌측 화살표 */}
            {canScrollLeftJobs && (
              <div className="absolute left-4 top-0 bottom-4 w-12 flex items-center justify-start pointer-events-none z-10">
                <button 
                  onClick={(e) => scrollLeft(scrollRefJobs, e)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* 우측 그라데이션 및 화살표 */}
            <div className={`absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent flex items-center justify-end pointer-events-none z-10 transition-opacity ${canScrollRightJobs ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={(e) => scrollRight(scrollRefJobs, e)}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto mr-4 hover:text-blue-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 1.5. 오늘의 직무 퀘스트 (가로 스크롤) */}
        <section className="px-5">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-slate-900 font-extrabold text-lg flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Target className="w-5 h-5" strokeWidth={2} />
              </div>
              오늘의 직무 퀘스트
            </h2>
            <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-blue-600 transition-colors">
              전체보기 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="relative group">
            <div 
              className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x px-6" 
              ref={scrollRefQuests}
              onScroll={(e) => handleScroll(e, setCanScrollLeftQuests, setCanScrollRightQuests)}
            >
              {TODAY_QUESTS.map((quest) => {
                const QuestIcon = quest.icon;
                return (
                  <div 
                    key={quest.id} 
                    onClick={() => { setSelectedQuest(quest); setShowQuestModal(true); }}
                    className="bg-white hover:border-slate-300 border border-slate-100 transition-colors rounded-[24px] p-5 w-[75%] max-w-[260px] snap-center flex-shrink-0 cursor-pointer relative shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between active:scale-[0.98]"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2.5 py-1 ${quest.bg} ${quest.color} text-[10px] font-extrabold rounded-md border border-white/20 flex items-center gap-1`}>
                          <QuestIcon className="w-3 h-3" strokeWidth={2.5} />
                          {quest.category}
                        </span>
                        <span className="text-blue-600 font-black text-sm">+{quest.exp} EXP</span>
                      </div>
                      <h3 className="text-slate-900 font-extrabold text-[15px] leading-snug break-keep">{quest.title}</h3>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* 좌측 화살표 */}
            {canScrollLeftQuests && (
              <div className="absolute left-4 top-0 bottom-4 w-12 flex items-center justify-start pointer-events-none z-10">
                <button 
                  onClick={(e) => scrollLeft(scrollRefQuests, e)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* 우측 그라데이션 및 화살표 */}
            <div className={`absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent flex items-center justify-end pointer-events-none z-10 transition-opacity ${canScrollRightQuests ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={(e) => scrollRight(scrollRefQuests, e)}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto mr-4 hover:text-blue-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. 직업 카테고리 (꽉 찬 박스 리스트) */}
        <section className="px-5">
          <div className="flex gap-5 border-b border-slate-200 mb-4">
            <button 
              onClick={() => setActiveCategory('recommended')} 
              className={`pb-2.5 text-sm font-bold transition-all border-b-2 ${activeCategory === 'recommended' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              AI 추천 직업
            </button>
            <button 
              onClick={() => setActiveCategory('popular')} 
              className={`pb-2.5 text-sm font-bold transition-all border-b-2 ${activeCategory === 'popular' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              인기 직업
            </button>
          </div>

          <div className="space-y-4">
            {activeCategory === 'recommended' && recommendedJobs.map((job: string) => (
              <button 
                key={job} 
                onClick={() => setSelectedJob(getJobInfo(job))}
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl p-6 flex justify-between items-center transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Sparkles className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-slate-900 font-extrabold text-[15px]">{job}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            ))}
            {activeCategory === 'popular' && ['데이터 분석가', 'AI 프롬프트 엔지니어', 'UX/UI 디자이너'].map(job => (
              <button 
                key={job} 
                onClick={() => setSelectedJob(getJobInfo(job))}
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl p-6 flex justify-between items-center transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Flame className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="text-slate-900 font-extrabold text-[15px]">{job}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            ))}
          </div>
        </section>

        {/* 3. 현직자 리얼 VLOG (가로 스크롤) */}
        <section className="px-5">
          <h2 className="text-slate-900 font-extrabold text-lg mb-4 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video className="w-5 h-5" strokeWidth={2} />
            </div>
            현직자 리얼 VLOG
          </h2>
          <div className="relative group">
            <div 
              className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-6" 
              ref={scrollRefVlogs}
              onScroll={(e) => handleScroll(e, setCanScrollLeftVlogs, setCanScrollRightVlogs)}
            >
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
                  className="w-[80%] max-w-[260px] h-40 bg-white rounded-3xl relative overflow-hidden flex-shrink-0 snap-center cursor-pointer border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center group/card"
                >
                  {vlog.thumbnailUrl ? (
                    <img src={vlog.thumbnailUrl} alt={vlog.title} className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover/card:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 z-0"></div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-20">
                    <p className="text-white text-sm font-bold line-clamp-2 drop-shadow-md leading-snug">{vlog.title}</p>
                  </div>

                  {(!vlog.videoUrl) ? (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center group-hover/card:bg-white/50 transition-colors z-10">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-800">
                        <Lock className="w-5 h-5" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                      <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                        <PlayCircle className="w-8 h-8" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3 z-20">
                    {vlog.isPremium ? (
                      <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-amber-100/50">Premium</span>
                    ) : (
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-blue-100/50">Free</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 좌측 화살표 */}
            {canScrollLeftVlogs && (
              <div className="absolute left-4 top-0 bottom-4 w-12 flex items-center justify-start pointer-events-none z-10">
                <button 
                  onClick={(e) => scrollLeft(scrollRefVlogs, e)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* 우측 화살표 */}
            <div className={`absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent flex items-center justify-end pointer-events-none z-10 transition-opacity ${canScrollRightVlogs ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={(e) => scrollRight(scrollRefVlogs, e)}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto mr-4 hover:text-blue-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. 시크릿 자격증 로드맵 (Accordion UI) - 동적 2개 렌더링 */}
        <section className="px-5 pb-8 space-y-6">
          <h2 className="text-slate-900 font-extrabold text-lg mb-4 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapIcon className="w-5 h-5" strokeWidth={2} />
            </div>
            시크릿 합격 로드맵
          </h2>
          
          {top2Jobs.map((jobName: string, jobIdx: number) => {
            const steps = ROADMAP_DATA[jobName] || getDefaultRoadmap(jobName);
            return (
              <div key={jobName} className="relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className={`p-6 ${!isSubscribed ? 'h-48 filter blur-[6px] opacity-40 overflow-hidden pointer-events-none' : ''}`}>
                  <h3 className="text-slate-900 font-extrabold mb-5 text-[15px] tracking-tight">
                    <span className="text-blue-600">[{jobName}]</span> 합격 커리큘럼
                  </h3>
                  
                  <div className="space-y-2.5">
                    {steps.map(step => {
                      const stepId = `${jobIdx}-${step.step}`;
                      const isExpanded = expandedStep === stepId;
                      
                      return (
                        <div key={stepId} className="border border-slate-100 rounded-2xl bg-slate-50 overflow-hidden transition-all">
                          <button 
                            onClick={() => setExpandedStep(isExpanded ? null : stepId)} 
                            className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 text-left">
                              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xs shadow-sm border border-blue-100 shrink-0">
                                {step.step}
                              </div>
                              <span className="font-extrabold text-slate-900 text-sm">{step.title}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {isExpanded && (
                            <div className="p-4 pt-2 bg-white text-slate-500 text-xs leading-relaxed text-justify break-keep whitespace-pre-wrap animate-in fade-in slide-in-from-top-2 duration-200 border-t border-slate-50">
                              {step.desc}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {!isSubscribed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px] z-10">
                    <button 
                      onClick={() => setShowPremiumModal(true)}
                      className="bg-white text-slate-900 px-5 py-3.5 rounded-2xl font-extrabold text-sm shadow-sm border border-slate-100 transform transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <span className="bg-slate-100 w-7 h-7 rounded-full flex items-center justify-center text-slate-800"><Unlock className="w-3.5 h-3.5" /></span> 
                      프리미엄 멤버십 열람
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>

      {/* 프리미엄 결제 모달 */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center font-bold">
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mt-2">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Gem className="w-7 h-7" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">프리미엄 멤버십</h2>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed font-medium break-keep whitespace-pre-wrap">월 9,900원 구독하고 AI가 맞춤 추천하는 시크릿 합격 로드맵과 현직자 VLOG를 모두 확인하세요!</p>
              <button 
                onClick={handleSubscribe}
                className="w-full py-3.5 bg-blue-600 text-white font-extrabold text-[15px] rounded-2xl shadow-sm active:scale-95 transition-transform"
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
            <div className="sticky top-0 bg-white/90 backdrop-blur-md pb-4 pt-6 px-6 border-b border-slate-100 z-10 flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6">
              <ul className="space-y-5 text-sm">
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider"><Building2 className="w-3.5 h-3.5" /> 주요 채용 회사</span>
                  <span className="text-slate-700 font-bold block bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">{selectedJob.companies}</span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider"><Clock className="w-3.5 h-3.5" /> 상세 실무 내용</span>
                  <span className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl block border border-slate-100 text-sm break-keep whitespace-pre-wrap">{selectedJob.tasks}</span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider"><Gem className="w-3.5 h-3.5" /> 평균 연봉</span>
                  <span className="text-blue-600 font-extrabold text-[15px] bg-blue-50 p-4 rounded-2xl block border border-blue-100">{selectedJob.salary}</span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider"><LinkIcon className="w-3.5 h-3.5" /> 필요 자격증/스킬</span>
                  <span className="text-slate-600 font-medium leading-relaxed block bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm break-keep whitespace-pre-wrap">{selectedJob.certs}</span>
                </li>
              </ul>
              
              <button onClick={() => setSelectedJob(null)} className="w-full mt-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-colors shadow-sm text-sm">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 퀘스트 인증 모달 */}
      {showQuestModal && selectedQuest && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end p-0 bg-slate-900/60 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <div className="bg-white rounded-t-[32px] sm:rounded-[2rem] w-full max-w-md p-6 sm:p-8 relative shadow-2xl animate-in slide-in-from-bottom-full duration-300 sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setShowQuestModal(false); setUploadedFileName(null); setSelectedQuest(null); }} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-50 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            >
              <X className="w-4 h-4"/>
            </button>
            
            <div className="mb-6 pr-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 ${selectedQuest.bg} ${selectedQuest.color} text-[11px] font-extrabold rounded-md border border-white/20 flex items-center gap-1`}>
                  <selectedQuest.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {selectedQuest.category}
                </span>
                <span className="text-blue-600 font-black text-sm">+{selectedQuest.exp} EXP</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">{selectedQuest.title}</h2>
            </div>

            <div className="space-y-6 mb-8">
              {/* 수행 가이드 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-slate-900 font-extrabold text-sm mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-600" /> 이렇게 수행해보세요!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {selectedQuest.guide}
                </p>
              </div>

              {/* 인증 방법 */}
              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                <h3 className="text-blue-900 font-extrabold text-sm mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" /> 인증 방법
                </h3>
                <p className="text-sm text-blue-700/80 leading-relaxed font-medium">
                  {selectedQuest.verifyMethod}
                </p>
              </div>
            </div>
            
            {/* 파일 업로드 영역 */}
            <label className="border-2 border-dashed border-slate-200 rounded-3xl p-8 mb-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden group bg-white">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={handleFileChange} />
              
              {uploadedFileName ? (
                <>
                  <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" strokeWidth={2} />
                  <span className="text-slate-900 font-bold text-center break-all text-[13px] px-2">{uploadedFileName}</span>
                  <span className="text-[11px] font-bold text-slate-400 mt-2">클릭하여 다른 파일 선택</span>
                </>
              ) : (
                <>
                  <Camera className="w-10 h-10 text-slate-300 mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="text-[14px] font-bold text-slate-600">인증 사진 첨부하기</span>
                  <span className="text-[11px] font-medium text-slate-400 mt-1">탭하여 사진 선택</span>
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

    </main>
  );
}
