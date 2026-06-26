'use client';

import { useState } from 'react';
import { ArrowLeft, Terminal, Megaphone, Palette, Briefcase, Calculator, PenTool, Database, Search, X, Building2, Gem, Target, MousePointer2 } from 'lucide-react';
import Link from 'next/link';

type Category = '전체' | 'IT/개발' | '기획/마케팅' | '디자인/창작' | '경영/지원';

const CATEGORIES: Category[] = ['전체', 'IT/개발', '기획/마케팅', '디자인/창작', '경영/지원'];

const EXPLORE_JOBS = [
  { id: 1, title: '백엔드 개발자', category: 'IT/개발', keyword: '서버/DB', icon: Database, color: 'text-blue-500', bgColor: 'bg-blue-50', tasks: 'API 설계 및 개발, 데이터베이스 스키마 설계, 트래픽 분산 및 성능 최적화, 보안 로직 구현', salary: '초봉 4,000만 원 ~', certs: '정보처리기사, AWS/GCP 자격증', companies: '네이버, 카카오, 라인, 쿠팡' },
  { id: 2, title: '프론트엔드 개발자', category: 'IT/개발', keyword: 'UI/UX 구현', icon: Terminal, color: 'text-emerald-500', bgColor: 'bg-emerald-50', tasks: '웹/앱 사용자 인터페이스 구현, 컴포넌트 설계, 상태 관리, 렌더링 최적화', salary: '초봉 3,800만 원 ~', certs: '웹디자인기능사, 정보처리기사', companies: '토스, 당근, 배달의민족' },
  { id: 3, title: '데이터 분석가', category: 'IT/개발', keyword: '데이터 추출', icon: Search, color: 'text-indigo-500', bgColor: 'bg-indigo-50', tasks: '데이터 파이프라인 구축, A/B 테스트 설계 및 검증, 로그 분석, 대시보드 시각화', salary: '초봉 4,000만 원 ~', certs: 'SQLD, ADsP, 빅데이터분석기사', companies: '토스, 오늘의집, 직방' },
  { id: 4, title: '콘텐츠 마케터', category: '기획/마케팅', keyword: 'SNS 채널운영', icon: Megaphone, color: 'text-orange-500', bgColor: 'bg-orange-50', tasks: '인스타그램/유튜브 채널 운영, 숏폼 영상 기획, 바이럴 캠페인 기획, 퍼포먼스 광고 에셋 제작', salary: '초봉 3,000만 원 ~', certs: '검색광고마케터, 디지털마케팅자격증', companies: '야놀자, 무신사, 올리브영' },
  { id: 5, title: '그로스 해커', category: '기획/마케팅', keyword: '지표 개선', icon: Target, color: 'text-red-500', bgColor: 'bg-red-50', tasks: '퍼널 분석, 사용자 리텐션 증대 실험, 데이터 기반 마케팅 최적화, UA(유저 획득) 전략 수립', salary: '초봉 3,800만 원 ~', certs: 'GA4 인증, SQLD', companies: '뱅크샐러드, 마이리얼트립' },
  { id: 6, title: 'UX/UI 디자이너', category: '디자인/창작', keyword: '화면 설계', icon: Palette, color: 'text-pink-500', bgColor: 'bg-pink-50', tasks: '사용자 리서치, 와이어프레임 및 프로토타입 제작, 디자인 시스템 구축, 사용성 테스트', salary: '초봉 3,200만 원 ~', certs: '시각디자인산업기사, 컬러리스트', companies: '카카오스타일, 29CM, 무신사' },
  { id: 7, title: 'BX 디자이너', category: '디자인/창작', keyword: '브랜드 경험', icon: PenTool, color: 'text-purple-500', bgColor: 'bg-purple-50', tasks: '브랜드 아이덴티티(BI/CI) 개발, 굿즈 및 패키지 디자인, 온/오프라인 브랜드 경험 일치화', salary: '초봉 3,000만 원 ~', certs: '시각디자인기사', companies: '우아한형제들, 블랭크코퍼레이션' },
  { id: 8, title: '에이전시 PM', category: '경영/지원', keyword: '프로젝트 관리', icon: Briefcase, color: 'text-slate-700', bgColor: 'bg-slate-100', tasks: '클라이언트 커뮤니케이션, 프로젝트 일정 및 리소스 관리, 요구사항 정의, 산출물 검수', salary: '초봉 3,300만 원 ~', certs: 'PMP, 정보처리기사', companies: '메가존, 슬로워크, 디스트릭트' },
  { id: 9, title: 'HR 담당자', category: '경영/지원', keyword: '채용/평가', icon: Calculator, color: 'text-cyan-600', bgColor: 'bg-cyan-50', tasks: '인재 채용 파이프라인 구축, 성과 평가 제도 기획, 조직 문화(Culture Fit) 개선, 급여/보상 관리', salary: '초봉 3,200만 원 ~', certs: 'PHR, 공인노무사(우대)', companies: '크래프톤, 넥슨, 쏘카' },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('전체');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const filteredJobs = activeCategory === '전체' 
    ? EXPLORE_JOBS 
    : EXPLORE_JOBS.filter(job => job.category === activeCategory);

  return (
    <main className="min-h-screen bg-slate-50 pb-20 flex flex-col relative break-keep whitespace-pre-wrap">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-[17px] font-extrabold text-slate-900 tracking-tight">직업 탐구</h1>
        <div className="w-10 h-10"></div> {/* Placeholder for centering */}
      </header>

      {/* Tabs */}
      <div className="bg-white px-5 pt-4 border-b border-slate-100 sticky top-[73px] z-20">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-3">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
                activeCategory === category 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {filteredJobs.map((job) => {
            const IconComponent = job.icon;
            return (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col items-start text-left transition-all hover:border-slate-200 hover:shadow-sm active:scale-[0.98] group"
              >
                <div className={`w-10 h-10 rounded-2xl ${job.bgColor} ${job.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg mb-1.5 border border-slate-100">
                  {job.keyword}
                </span>
                <h3 className="text-[15px] font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </h3>
              </button>
            );
          })}
        </div>
        
        {filteredJobs.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <Search className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm font-medium">해당 카테고리의 직업이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Detail Modal (Bottom Sheet) */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white sm:border border-slate-100 rounded-t-[2rem] sm:rounded-3xl w-full max-w-[480px] sm:max-w-sm max-h-[85vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md pb-4 pt-6 px-6 border-b border-slate-100 z-10 flex justify-between items-start">
              <div className="pr-4">
                <span className={`inline-block px-2.5 py-1 ${selectedJob.bgColor} ${selectedJob.color} text-[10px] font-extrabold rounded-lg mb-3`}>
                  {selectedJob.category}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  {selectedJob.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedJob(null)} 
                className="w-8 h-8 shrink-0 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1">
              <ul className="space-y-5 text-sm">
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
                    <MousePointer2 className="w-4 h-4" /> 핵심 업무
                  </span>
                  <span className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl block border border-slate-100 text-sm break-keep whitespace-pre-wrap">
                    {selectedJob.tasks}
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
                    <Gem className="w-4 h-4" /> 평균 연봉
                  </span>
                  <span className="text-blue-600 font-extrabold text-[15px] bg-blue-50 p-4 rounded-2xl block border border-blue-100">
                    {selectedJob.salary}
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
                    <Building2 className="w-4 h-4" /> 주요 채용 회사
                  </span>
                  <span className="text-slate-700 font-bold bg-slate-50 p-4 rounded-2xl block border border-slate-100 text-sm">
                    {selectedJob.companies}
                  </span>
                </li>
              </ul>
              
              <button 
                onClick={() => setSelectedJob(null)} 
                className="w-full mt-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-colors shadow-sm text-[15px] active:scale-95"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
