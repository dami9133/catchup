'use client';

import { useState, useEffect, useRef } from 'react';
import { Flame, TrendingUp, Sparkles, Video, Lock, Unlock, Map as MapIcon, Gem, ChevronRight, ChevronLeft, ChevronDown, PlayCircle, Building2, Clock, Link as LinkIcon, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type JobCategory = 'recommended' | 'popular';

const ROADMAP_DATA: Record<string, any[]> = {
  '백엔드 개발자': [
    { step: 1, title: '언어 기초 및 자료구조', desc: 'Java/Python 기초 문법과 객체지향 프로그래밍(OOP), 기본 자료구조를 완벽히 숙지하세요.' },
    { step: 2, title: '프레임워크 및 DB', desc: 'Spring Boot 또는 Node.js 프레임워크를 익히고, MySQL 등 관계형 데이터베이스 연동과 SQL 쿼리 최적화를 배웁니다.' },
    { step: 3, title: '실전 API 서버 구축', desc: 'RESTful API를 설계하고, JWT 인증/인가 로직이 포함된 실제 게시판이나 커머스 백엔드를 구축해 보세요.' },
    { step: 4, title: '클라우드 배포 및 최적화', desc: 'AWS EC2 또는 Docker를 활용해 서버를 배포하고, 대규모 트래픽을 가정한 성능 테스트 결과를 깃허브 포트폴리오로 정리하세요.' }
  ],
  '테크니컬 라이터': [
    { step: 1, title: '기술 문서 구조 이해', desc: 'API 명세서, 사용자 매뉴얼, 사내 가이드라인 등 다양한 기술 문서의 구조와 목적을 파악하세요.' },
    { step: 2, title: '마크다운 및 작성 툴 마스터', desc: 'Markdown 문법을 완벽히 익히고, Notion, Confluence, Docusaurus 등 문서화 툴 활용법을 숙지하세요.' },
    { step: 3, title: '오픈소스 기여 및 번역', desc: '해외 유명 기술 블로그 아티클을 번역 및 요약하거나, 오픈소스 프로젝트의 공식 문서 오류를 수정(PR)해 보세요.' },
    { step: 4, title: '기술 블로그 포트폴리오 구축', desc: '개발자들이 이해하기 쉽게 복잡한 아키텍처나 코드를 설명하는 나만의 기술 블로그 시리즈를 작성하세요.' }
  ],
  '프리세일즈': [
    { step: 1, title: 'IT 인프라/솔루션 기초 지식', desc: '자사 및 경쟁사의 IT 솔루션, 클라우드 아키텍처, 서버 네트워크 기초 지식을 영업 관점에서 이해하세요.' },
    { step: 2, title: '제안서(RFP) 분석 및 작성법', desc: '고객사의 요구사항(RFP)을 분석하고, 자사 솔루션의 강점을 논리적으로 풀어낸 B2B 제안서를 기획해 보세요.' },
    { step: 3, title: '프레젠테이션 스킬 업', desc: '작성한 제안서를 바탕으로 고객사 임원진을 설득하기 위한 모의 피칭 스크립트를 작성하고 발표를 훈련하세요.' },
    { step: 4, title: '실전 B2B 영업 시뮬레이션', desc: '특정 산업군을 타겟으로 가상의 솔루션 도입 시나리오를 세우고, 이의제기(Objection) 극복 전략을 정리하세요.' }
  ],
  '데이터 분석가': [
    { step: 1, title: '데이터 분석 기초 수강', desc: 'SQL 기초 문법과 파이썬 데이터 전처리 라이브러리(Pandas, NumPy)를 익히세요.' },
    { step: 2, title: '미니 프로젝트 진행', desc: 'Kaggle이나 공공 데이터를 활용하여 EDA(탐색적 데이터 분석)를 수행하고 인사이트를 도출해보세요.' },
    { step: 3, title: '대시보드 툴 마스터', desc: '실무에서 자주 쓰이는 Tableau, PowerBI 등의 시각화 툴을 익혀 대시보드를 구축해 보세요.' },
    { step: 4, title: '실무 포트폴리오 완성', desc: 'A/B 테스트 기획부터 결과 분석, 리포팅까지의 과정을 담은 실무형 포트폴리오를 작성하세요.' }
  ],
  'AI 프롬프트 엔지니어': [
    { step: 1, title: 'LLM 기본 원리 이해', desc: '트랜스포머 아키텍처와 LLM의 작동 방식, 그리고 토큰화의 개념을 학습하세요.' },
    { step: 2, title: '프롬프트 테크닉 숙달', desc: 'Zero-shot, Few-shot, Chain-of-Thought 등 다양한 프롬프트 엔지니어링 기법을 실습하세요.' },
    { step: 3, title: 'API 활용 및 파인튜닝', desc: 'OpenAI API를 활용하여 실제 어플리케이션에 LLM을 연동해보고, 파인튜닝의 기초를 익히세요.' },
    { step: 4, title: 'AI 서비스 기획 프로젝트', desc: '특정 문제를 해결하는 챗봇이나 텍스트 생성 도구를 기획하고, 그 과정을 노션에 정리하세요.' }
  ],
  '그로스 해커': [
    { step: 1, title: '퍼널 및 지표의 이해', desc: 'AARRR 퍼널 모델과 리텐션, LTV 등 비즈니스 핵심 지표의 개념을 완벽하게 숙지하세요.' },
    { step: 2, title: '구글 애널리틱스 마스터', desc: 'GA4와 GTM을 활용하여 사용자 행동 데이터를 추적하고 분석하는 방법을 익히세요.' },
    { step: 3, title: 'A/B 테스트 실험 설계', desc: '버튼 색상, 카피 변경 등 작은 실험을 설계하고 데이터를 통해 가설을 검증해보세요.' },
    { step: 4, title: '그로스 실험 리포트 작성', desc: '문제 정의 - 가설 수립 - 실험 - 결과 분석의 사이클을 담은 그로스 해킹 리포트를 완성하세요.' }
  ],
  '콘텐츠 마케터': [
    { step: 1, title: 'SNS 플랫폼별 이해', desc: '인스타그램, 유튜브, 틱톡 등 플랫폼별 사용자 특성과 알고리즘을 분석하세요.' },
    { step: 2, title: '카피라이팅 및 디자인', desc: '클릭을 유도하는 후킹 카피 작성법과 피그마, 캔바 등을 활용한 썸네일/카드뉴스 제작을 익히세요.' },
    { step: 3, title: '숏폼 콘텐츠 기획', desc: '직접 릴스나 쇼츠 영상을 기획하고 제작하여 채널을 운영해보며 반응을 테스트하세요.' },
    { step: 4, title: '마케팅 성과 포트폴리오', desc: '자신이 만든 콘텐츠의 조회수, 전환율 등 수치화된 성과를 노션 포트폴리오로 정리하세요.' }
  ],
  'UX/UI 디자이너': [
    { step: 1, title: '디자인 기초 및 툴 학습', desc: '피그마(Figma)를 마스터하고 타이포그래피, 컬러, 그리드 시스템 등 디자인 기초를 익히세요.' },
    { step: 2, title: 'UX 리서치 방법론', desc: '유저 인터뷰, 페르소나 설정, 유저 저니 맵 등 사용자 중심 설계 방법론을 공부하세요.' },
    { step: 3, title: '클론 디자인 및 개선', desc: '기존 유명 앱들의 화면을 똑같이 따라 만들어보고, UX 측면에서 불편한 점을 찾아 개선해 보세요.' },
    { step: 4, title: '문제 해결 중심 포트폴리오', desc: '단순히 예쁜 화면이 아닌, 왜 이 버튼을 여기에 배치했는지 논리적 근거가 담긴 포트폴리오를 제작하세요.' }
  ],
};

const DEFAULT_ROADMAP = [
  { step: 1, title: '직무 기초 지식 습득', desc: '가장 기본적인 용어와 원리를 파악하고 관련 도서 3권 이상 정독하기. 모르는 용어는 노션에 정리하며 나만의 단어장을 만드세요.' },
  { step: 2, title: '필수 툴 및 기술 스택 마스터', desc: '현업에서 요구하는 필수 기술을 활용하여 간단한 토이 프로젝트 진행. 완벽하지 않아도 일단 부딪혀보는 것이 중요합니다.' },
  { step: 3, title: '실전 포트폴리오 구축', desc: '문제 해결 과정을 담은 노션/깃허브 포트폴리오 작성. 결과보다는 과정과 숫자로 표현된 성과(수치화)를 반드시 포함하세요.' },
  { step: 4, title: '면접 및 코딩/과제 테스트', desc: 'STAR 기법(Situation, Task, Action, Result)을 활용한 예상 질문 리스트 작성 및 모의 면접 반복 훈련.' },
];

export default function DashboardPage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<JobCategory>('recommended');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [userPersona, setUserPersona] = useState<any>(null);
  const [vlogs, setVlogs] = useState<any[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const scrollRefJobs = useRef<HTMLDivElement>(null);
  const scrollRefVlogs = useRef<HTMLDivElement>(null);

  const [canScrollLeftJobs, setCanScrollLeftJobs] = useState(false);
  const [canScrollRightJobs, setCanScrollRightJobs] = useState(true);
  const [canScrollLeftVlogs, setCanScrollLeftVlogs] = useState(false);
  const [canScrollRightVlogs, setCanScrollRightVlogs] = useState(true);

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
  const TRENDING_JOBS = ['데이터 분석가', 'AI 프롬프트 엔지니어', '그로스 해커'];
  const recommendedJobs = userPersona?.jobs || ['콘텐츠 마케터', '그로스 해커'];
  
  // 추천 직무 2개 추출 (부족하면 기본값 매핑)
  const top2Jobs = recommendedJobs.slice(0, 2);

  return (
    <main className="min-h-full pb-20 bg-slate-50 flex flex-col relative break-keep whitespace-pre-wrap">
      <header className="px-5 pt-8 pb-6 bg-white rounded-b-[2rem] shadow-sm border-b border-slate-100 z-10 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full filter blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight leading-tight flex flex-col">
          <span>{userPersona ? `${userPersona.name}님을 위한` : '당신을 위한'}</span>
          <span>직무 탐색 허브</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 leading-relaxed">
          {userPersona ? '나의 커리어 성향에 꼭 맞는 직무와 로드맵을 확인하세요.' : '요즘 뜨는 직무부터 숨겨진 꿀 직무까지 탐색해보세요.'}
        </p>
      </header>

      <div className="flex-1 space-y-8">
        {/* 1. 요새 뜨는 직업 (가로 스크롤) */}
        <section className="px-5">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-slate-900 font-extrabold text-lg flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-orange-500" />
              요새 뜨는 직업
            </h2>
            <Link href="/explore" className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-blue-600 transition-colors">
              직업 전체보기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="relative group">
            <div 
              className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x pr-12" 
              ref={scrollRefJobs}
              onScroll={(e) => handleScroll(e, setCanScrollLeftJobs, setCanScrollRightJobs)}
            >
              {TRENDING_JOBS.map((job, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedJob(getJobInfo(job))}
                  className="bg-white hover:bg-slate-50 border border-slate-100 transition-colors rounded-3xl p-5 w-[75%] max-w-[220px] snap-center flex-shrink-0 cursor-pointer relative shadow-sm"
                >
                  <div className="absolute top-0 left-0 w-7 h-7 bg-blue-600 rounded-tl-3xl rounded-br-2xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {idx + 1}
                  </div>
                  <TrendingUp className="w-7 h-7 text-blue-600 mb-2 mt-1" />
                  <h3 className="text-slate-900 font-extrabold text-[15px] tracking-tight mb-1">{job}</h3>
                </div>
              ))}
            </div>
            
            {/* 좌측 화살표 */}
            {canScrollLeftJobs && (
              <div className="absolute left-0 top-0 bottom-4 w-12 flex items-center justify-start pointer-events-none z-10">
                <button 
                  onClick={(e) => scrollLeft(scrollRefJobs, e)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto ml-1 hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* 우측 그라데이션 및 화살표 */}
            <div className={`absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent flex items-center justify-end pointer-events-none z-10 transition-opacity ${canScrollRightJobs ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={(e) => scrollRight(scrollRefJobs, e)}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto mr-1 hover:text-blue-600 transition-colors"
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

          <div className="space-y-2.5">
            {activeCategory === 'recommended' && recommendedJobs.map((job: string) => (
              <button 
                key={job} 
                onClick={() => setSelectedJob(getJobInfo(job))}
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center transition-all shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Sparkles className="w-4 h-4" />
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
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center transition-all shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                    <Flame className="w-4 h-4" />
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
          <h2 className="text-slate-900 font-extrabold text-lg mb-4 flex items-center gap-1.5">
            <Video className="w-5 h-5 text-indigo-500" />
            현직자 리얼 VLOG
          </h2>
          <div className="relative group">
            <div 
              className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar pr-12" 
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
                  className="w-[80%] max-w-[260px] h-40 bg-white rounded-3xl relative overflow-hidden flex-shrink-0 snap-center cursor-pointer border border-slate-100 shadow-sm flex items-center justify-center group/card"
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
              <div className="absolute left-0 top-0 bottom-4 w-12 flex items-center justify-start pointer-events-none z-10">
                <button 
                  onClick={(e) => scrollLeft(scrollRefVlogs, e)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto ml-1 hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* 우측 화살표 */}
            <div className={`absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent flex items-center justify-end pointer-events-none z-10 transition-opacity ${canScrollRightVlogs ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={(e) => scrollRight(scrollRefVlogs, e)}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-slate-600 pointer-events-auto mr-1 hover:text-blue-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. 시크릿 자격증 로드맵 (Accordion UI) - 동적 2개 렌더링 */}
        <section className="px-5 pb-8 space-y-6">
          <h2 className="text-slate-900 font-extrabold text-lg mb-4 flex items-center gap-1.5">
            <MapIcon className="w-5 h-5 text-emerald-500" />
            시크릿 합격 로드맵
          </h2>
          
          {top2Jobs.map((jobName: string, jobIdx: number) => {
            const steps = ROADMAP_DATA[jobName] || DEFAULT_ROADMAP;
            return (
              <div key={jobName} className="relative bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className={`p-5 ${!isSubscribed ? 'h-48 filter blur-[6px] opacity-40 overflow-hidden pointer-events-none' : ''}`}>
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
    </main>
  );
}
