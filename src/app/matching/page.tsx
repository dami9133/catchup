'use client';

import { useState } from 'react';
import { Handshake, MapPin, Target, Users, Calendar, ChevronDown } from 'lucide-react';

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
    <main className="min-h-full flex flex-col relative break-keep whitespace-pre-wrap bg-transparent">
      {/* Header */}
      <header className="pt-10 px-6 pb-12 bg-[#111827]">
        <h1 className="text-xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
          체험학습 매칭 <Handshake className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
        </h1>
        <p className="text-[13px] font-medium text-slate-400">기업의 리얼한 실무를 직접 경험하고 직무 적성을 확인하세요.</p>
      </header>

      {/* Body */}
      <div className="flex-1 bg-white rounded-t-[32px] p-6 pt-8 shadow-[0_-10px_40px_rgb(0,0,0,0.12)] -mt-6 z-20 flex flex-col pb-24 overflow-y-auto">
      <div className="space-y-4">
        {MATCHING_DATA.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          >
            {/* 요약 카드 영역 (클릭 시 토글) */}
            <div 
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="p-6 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-blue-600 font-extrabold text-[11px] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{item.company}</span>
                {item.isNew && <span className="text-[10px] bg-red-50 text-red-500 font-extrabold px-2 py-0.5 rounded-md border border-red-100 animate-pulse">NEW</span>}
              </div>
              <h3 className="text-[17px] font-extrabold text-slate-900 mb-2 line-clamp-2 leading-snug">{item.title}</h3>
              <p className="text-[13px] text-slate-500 flex justify-between items-center mt-3 font-medium">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400"/> {item.period}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`} />
              </p>
            </div>

            {/* 상세 정보 영역 (확장 시 노출) */}
            <div 
              className={`bg-slate-50 px-6 border-t border-slate-100 transition-all duration-300 ease-in-out overflow-hidden ${
                expandedId === item.id ? 'max-h-[500px] py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
              }`}
            >
              <ul className="space-y-5 text-sm">
                <li>
                  <span className="text-slate-500 font-extrabold text-xs flex items-center gap-1.5 mb-2"><Target className="w-4 h-4 text-blue-500"/> 어떤 일?</span>
                  <span className="text-slate-700 font-medium leading-relaxed block bg-white p-4 rounded-2xl border border-slate-200/50">{item.task}</span>
                </li>
                <li className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 font-extrabold text-xs flex items-center gap-1.5 mb-2"><Users className="w-4 h-4 text-emerald-500"/> 어떤 나이?</span>
                    <span className="text-slate-700 font-bold block bg-white p-3 rounded-2xl border border-slate-200/50 text-center">{item.age}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-extrabold text-xs flex items-center gap-1.5 mb-2"><MapPin className="w-4 h-4 text-purple-500"/> 원하는 사람?</span>
                    <span className="text-slate-700 font-medium block bg-white p-3 rounded-2xl border border-slate-200/50 text-[13px] leading-snug">{item.persona}</span>
                  </div>
                </li>
              </ul>
              <button className="w-full mt-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-colors active:scale-95 shadow-sm text-[15px]">
                지원하기
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </main>
  );
}
