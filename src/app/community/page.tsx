'use client';

import { useState } from 'react';

type Tab = 'jobInfo' | 'counseling';

const MOCK_POSTS = {
  jobInfo: [
    { id: 1, title: '문과생 데이터 분석가 신입 서류 합격 후기', time: '10분 전', comments: 15 },
    { id: 2, title: '마케팅 직무 포트폴리오 피드백 부탁드립니다!', time: '1시간 전', comments: 8 },
    { id: 3, title: '비전공자 프론트엔드 6개월 부트캠프 현실', time: '3시간 전', comments: 34 },
    { id: 4, title: '네카라쿠배 코딩테스트 준비 어떻게 하시나요?', time: '5시간 전', comments: 12 },
  ],
  counseling: [
    { id: 5, title: '물경력 3년차, 이직할 수 있을까요? ㅠㅠ', time: '5분 전', comments: 22 },
    { id: 6, title: '면접에서 계속 떨어지는데 멘탈 관리 어떻게 하나요', time: '2시간 전', comments: 15 },
    { id: 7, title: '사수 없는 스타트업 신입인데 너무 힘듭니다', time: '5시간 전', comments: 40 },
  ]
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('jobInfo');

  return (
    <main className="min-h-full pb-20 bg-background flex flex-col">
      <header className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-white mb-6">커뮤니티</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('jobInfo')}
            className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'jobInfo' 
                ? 'text-primary border-primary' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            취준/이직 정보 공유
          </button>
          <button
            onClick={() => setActiveTab('counseling')}
            className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'counseling' 
                ? 'text-primary border-primary' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            익명 고민 상담소
          </button>
        </div>
      </header>

      {/* Post List */}
      <ul className="flex-1 overflow-y-auto">
        {MOCK_POSTS[activeTab].map((post) => (
          <li key={post.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors cursor-pointer p-5">
            <h3 className="text-slate-200 font-medium text-base mb-2">{post.title}</h3>
            <div className="flex items-center text-xs text-slate-500 gap-3">
              <span>{post.time}</span>
              <span className="flex items-center gap-1">
                💬 {post.comments}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* FAB (Floating Action Button) */}
      <button className="fixed bottom-20 right-4 w-12 h-12 bg-primary hover:bg-primary-hover text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 transition-transform active:scale-95 z-40 max-w-[480px] md:right-auto md:ml-[390px]">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
      </button>
    </main>
  );
}
