'use client';

import { useState, useEffect } from 'react';
import { getStartupData, StartupCampItem } from '@/app/actions/community';
import { Rocket, Building2, MessageSquare, Clock, Link as LinkIcon, X, Plus } from 'lucide-react';

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
    <main className="min-h-full flex flex-col relative break-keep whitespace-pre-wrap bg-transparent">
      <header className="pt-8 px-5 pb-10 bg-[#111827]">
        <h1 className="text-xl font-extrabold text-white mb-5 tracking-tight">커뮤니티</h1>
        
        {/* Tabs - Now part of the white body but visually sticking out or just inside the white body */}
      </header>

      <div className="flex-1 bg-white rounded-t-[32px] pt-4 shadow-[0_-10px_40px_rgb(0,0,0,0.12)] -mt-6 z-20 flex flex-col pb-20">
        {/* Tabs */}
        <div className="px-5 pt-4 bg-white rounded-t-[32px]">
          <div className="flex border-b border-slate-100 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button
            onClick={() => setActiveTab('jobInfo')}
            className={`px-4 pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'jobInfo' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            취준/이직 정보
          </button>
          <button
            onClick={() => setActiveTab('counseling')}
            className={`px-4 pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'counseling' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            익명 고민 상담
          </button>
          <button
            onClick={() => setActiveTab('startupCamp')}
            className={`px-4 pb-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-1 ${
              activeTab === 'startupCamp' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            창업지원 공고
            <Rocket className="w-4 h-4" />
          </button>
          </div>
        </div>

      {/* Post List */}
      <ul className="flex-1 overflow-y-auto bg-slate-50 mt-2">
        {activeTab === 'startupCamp' ? (
          <div className="p-4">
            {isLoadingStartup ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : startupError ? (
              <div className="p-5 bg-white rounded-xl text-center border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-sm font-medium">{startupError}</p>
              </div>
            ) : startupData.length === 0 ? (
              <div className="p-5 bg-white rounded-xl text-center border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-sm font-medium">현재 접수 중인 창업지원 공고가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {startupData.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setSelectedStartup(item)}
                    className="w-full text-left p-6 bg-white hover:border-slate-200 rounded-3xl border border-slate-100 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)] group block active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold rounded-lg border border-emerald-100">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-400">
                        마감: {item.endDate}
                      </span>
                    </div>
                    <h3 className="text-slate-900 font-extrabold text-[15px] leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5">
                      <Building2 className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="truncate">{item.agency}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {MOCK_POSTS[activeTab].map((post) => (
              <li key={post.id} className="bg-white border border-slate-100 rounded-3xl p-6 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer active:scale-[0.98] list-none">
              <h3 className="text-slate-800 font-bold text-[15px] mb-2">{post.title}</h3>
              <div className="flex items-center text-xs font-medium text-slate-400 gap-4">
                <span>{post.time}</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {post.comments}
                </span>
              </div>
              </li>
            ))}
          </div>
        )}
      </ul>
      </div>

      {/* FAB (Floating Action Button) */}
      {activeTab !== 'startupCamp' && (
        <button className="fixed bottom-20 right-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform active:scale-95 z-40 max-w-[480px] md:right-auto md:ml-[390px]">
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* 창업지원 공고 상세 모달 */}
      {selectedStartup && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white border-t border-slate-100 sm:border rounded-t-[2rem] sm:rounded-3xl w-full max-w-[480px] sm:max-w-sm max-h-[85vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md pb-4 pt-6 px-6 border-b border-slate-100 z-10 flex justify-between items-start">
              <div className="pr-4">
                <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold rounded-lg border border-emerald-100 mb-3">
                  {selectedStartup.category}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{selectedStartup.title}</h3>
              </div>
              <button onClick={() => setSelectedStartup(null)} className="w-8 h-8 shrink-0 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <ul className="space-y-5 text-sm">
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
                    <Building2 className="w-4 h-4" /> 주관 기관
                  </span>
                  <span className="text-slate-700 font-bold bg-slate-50 p-4 rounded-2xl block border border-slate-100">
                    {selectedStartup.agency}
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4" /> 마감일
                  </span>
                  <span className="text-blue-600 font-extrabold text-[15px] bg-blue-50 p-4 rounded-2xl block border border-blue-100">
                    {selectedStartup.endDate}
                  </span>
                </li>
              </ul>
              
              <div className="mt-8 space-y-3">
                <a 
                  href={selectedStartup.url && selectedStartup.url !== '#' && selectedStartup.url.startsWith('http') ? selectedStartup.url : `https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do?schM=view&pbancSn=${selectedStartup.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-colors shadow-sm active:scale-95"
                >
                  <LinkIcon className="w-4 h-4" /> 원문 보러가기
                </a>
                <button 
                  onClick={() => setSelectedStartup(null)} 
                  className="w-full py-4 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-2xl transition-colors border border-slate-100 shadow-sm active:scale-95"
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
