'use client';

import { useState } from 'react';

const MATCHING_DATA = [
  {
    id: 1,
    company: '우아한형제들',
    title: '퍼포먼스 마케팅 실무 멘토링 및 미니 프로젝트',
    task: '마케팅 퍼널 데이터 분석, 배달의민족 앱 프로모션 아이데이션 및 가설 설정',
    age: '만 19세 ~ 24세',
    persona: '실행력 100% 불도저, 논리적인 전략가',
    period: '2026.07.15 ~ 07.28 (2주)',
    isNew: true,
  },
  {
    id: 2,
    company: '토스 (비바리퍼블리카)',
    title: '프로덕트 오너(PO) 섀도잉 프로그램',
    task: '현업 PO와 함께 스쿼드 데일리 스크럼 참석, A/B 테스트 결과 회의 참관',
    age: '제한 없음',
    persona: '고객 중심 사고를 가진 모든 유형',
    period: '2026.08.01 (1일)',
    isNew: true,
  },
  {
    id: 3,
    company: '당근',
    title: '동네 상권 활성화 기획 챌린지',
    task: '로컬 마케팅 전략 수립 및 오프라인 캠페인 실행 보조',
    age: '만 20세 ~ 28세',
    persona: '공감 요정 커뮤니케이터',
    period: '2026.08.10 ~ 09.10 (1개월)',
    isNew: false,
  }
];

export default function MatchingPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <main className="min-h-full pb-20 bg-background flex flex-col">
      <header className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">체험학습 매칭 🤝</h1>
        <p className="text-sm text-slate-400">기업의 리얼한 실무를 직접 경험하고 직무 적성을 확인하세요.</p>
      </header>

      <div className="px-6 space-y-4">
        {MATCHING_DATA.map((item) => (
          <div 
            key={item.id} 
            className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
          >
            {/* 요약 카드 영역 (클릭 시 토글) */}
            <div 
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="p-5 cursor-pointer hover:bg-slate-700/50 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded">{item.company}</span>
                {item.isNew && <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>}
              </div>
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-slate-500 flex justify-between items-center mt-2">
                <span>{item.period}</span>
                <span className={`transform transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`}>▼</span>
              </p>
            </div>

            {/* 상세 정보 영역 (확장 시 노출) */}
            <div 
              className={`bg-slate-900/50 px-5 border-t border-slate-700/50 transition-all duration-300 ease-in-out overflow-hidden ${
                expandedId === item.id ? 'max-h-[400px] py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
              }`}
            >
              <ul className="space-y-4 text-sm">
                <li>
                  <span className="text-emerald-400 font-bold block mb-1">어떤 일?</span>
                  <span className="text-slate-300">{item.task}</span>
                </li>
                <li className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-emerald-400 font-bold block mb-1">어떤 나이?</span>
                    <span className="text-slate-300">{item.age}</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold block mb-1">원하는 사람?</span>
                    <span className="text-slate-300">{item.persona}</span>
                  </div>
                </li>
              </ul>
              <button className="w-full mt-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-colors active:scale-95 shadow-lg shadow-primary/20">
                지원하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
