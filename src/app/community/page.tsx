'use client';

import { useState, useEffect } from 'react';
import { getStartupData, StartupCampItem } from '@/app/actions/community';

type Tab = 'jobInfo' | 'counseling' | 'startupCamp';

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
  
  // 창업지원 데이터 상태
  const [startupData, setStartupData] = useState<StartupCampItem[]>([]);
  const [isLoadingStartup, setIsLoadingStartup] = useState(false);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<StartupCampItem | null>(null);

  useEffect(() => {
    if (activeTab === 'startupCamp' && startupData.length === 0) {
      const fetchStartup = async () => {
        setIsLoadingStartup(true);
        setStartupError(null);
        try {
          const res = await getStartupData();
          if (res.success && res.data) {
            setStartupData(res.data);
          } else {
            setStartupError(res.message || '데이터를 불러올 수 없습니다.');
          }
        } catch (err) {
          setStartupError('데이터 로드 중 에러가 발생했습니다.');
        } finally {
          setIsLoadingStartup(false);
        }
      };
      fetchStartup();
    }
  }, [activeTab]);

  return (
    <main className="min-h-full pb-20 bg-background flex flex-col relative">
      <header className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-white mb-6">커뮤니티</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-700 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button
            onClick={() => setActiveTab('jobInfo')}
            className={`px-4 pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'jobInfo' 
                ? 'text-primary border-primary' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            취준/이직 정보
          </button>
          <button
            onClick={() => setActiveTab('counseling')}
            className={`px-4 pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'counseling' 
                ? 'text-primary border-primary' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            익명 고민 상담
          </button>
          <button
            onClick={() => setActiveTab('startupCamp')}
            className={`px-4 pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'startupCamp' 
                ? 'text-primary border-primary' 
                : 'text-slate-500 border-transparent hover:text-slate-400'
            }`}
          >
            창업지원 공고 🚀
          </button>
        </div>
      </header>

      {/* Post List */}
      <ul className="flex-1 overflow-y-auto">
        {activeTab === 'startupCamp' ? (
          <div className="p-4">
            {isLoadingStartup ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : startupError ? (
              <div className="p-6 bg-slate-800/50 rounded-xl text-center border border-slate-700">
                <p className="text-slate-400 text-sm">{startupError}</p>
              </div>
            ) : startupData.length === 0 ? (
              <div className="p-6 bg-slate-800/50 rounded-xl text-center border border-slate-700">
                <p className="text-slate-400 text-sm">현재 접수 중인 창업지원 공고가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {startupData.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setSelectedStartup(item)}
                    className="w-full text-left p-5 bg-slate-800/40 hover:bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-primary/50 transition-all group block"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        마감: {item.endDate}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-base leading-tight mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-xs text-slate-400">
                      <span className="truncate">🏢 {item.agency}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          MOCK_POSTS[activeTab].map((post) => (
            <li key={post.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors cursor-pointer p-5">
              <h3 className="text-slate-200 font-medium text-base mb-2">{post.title}</h3>
              <div className="flex items-center text-xs text-slate-500 gap-3">
                <span>{post.time}</span>
                <span className="flex items-center gap-1">
                  💬 {post.comments}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* FAB (Floating Action Button) - 공고 탭 아닐때만 표시 */}
      {activeTab !== 'startupCamp' && (
        <button className="fixed bottom-20 right-4 w-12 h-12 bg-primary hover:bg-primary-hover text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 transition-transform active:scale-95 z-40 max-w-[480px] md:right-auto md:ml-[390px]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
      )}

      {/* 창업지원 공고 상세 모달 */}
      {selectedStartup && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-t border-slate-700 sm:border rounded-t-3xl sm:rounded-2xl w-full max-w-[480px] sm:max-w-sm max-h-[85vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur pb-4 pt-6 px-6 border-b border-slate-800 z-10 flex justify-between items-start">
              <div className="pr-4">
                <span className="inline-block px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/30 mb-3">
                  {selectedStartup.category}
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">{selectedStartup.title}</h3>
              </div>
              <button onClick={() => setSelectedStartup(null)} className="w-8 h-8 shrink-0 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="p-6">
              <ul className="space-y-6 text-sm">
                <li>
                  <span className="block text-slate-500 mb-2 text-xs font-bold uppercase">주관 기관</span>
                  <span className="text-slate-200 leading-relaxed bg-slate-800/50 p-3 rounded-lg block font-medium flex items-center gap-2">
                    <span className="text-lg">🏢</span> {selectedStartup.agency}
                  </span>
                </li>
                <li>
                  <span className="block text-slate-500 mb-2 text-xs font-bold uppercase">마감일</span>
                  <span className="text-primary font-bold text-lg bg-primary/10 p-3 rounded-lg block border border-primary/20 flex items-center gap-2">
                    <span className="text-lg">⏰</span> {selectedStartup.endDate}
                  </span>
                </li>
              </ul>
              
              <div className="mt-8 space-y-3">
                <a 
                  href={selectedStartup.url && selectedStartup.url !== '#' ? selectedStartup.url : `https://www.k-startup.go.kr`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-primary hover:bg-primary-hover text-white text-center font-bold rounded-xl transition-colors shadow-lg shadow-primary/20"
                >
                  🔗 원문 보러가기 (공식 홈페이지)
                </a>
                <button 
                  onClick={() => setSelectedStartup(null)} 
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
