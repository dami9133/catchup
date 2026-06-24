'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PersonaCard } from '@/components/PersonaCard';
import { updateUserPersona } from '@/app/actions/auth';



export default function TestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [resultPersona, setResultPersona] = useState<any>(null);

  // 10가지 세분화된 질문
  const QUIZ_QUESTIONS = [
    { id: 1, question: "새로운 프로젝트 과제가 주어졌을 때 당신의 행동은?", options: [{ id: 'A', text: "먼저 계획부터 꼼꼼하게 짠다." }, { id: 'B', text: "일단 시작해보고 부딪히면서 수정한다." }] },
    { id: 2, question: "팀원과 의견이 충돌했을 때 당신은?", options: [{ id: 'A', text: "객관적인 데이터와 논리로 설득한다." }, { id: 'B', text: "상대방의 감정을 공감하며 타협점을 찾는다." }] },
    { id: 3, question: "주말에 시간이 주어졌을 때 더 선호하는 것은?", options: [{ id: 'A', text: "평소 관심있던 분야의 사이드 프로젝트를 한다." }, { id: 'B', text: "새로운 사람들을 만나 네트워킹을 한다." }] },
    { id: 4, question: "복잡한 문제가 발생했을 때 해결 방식은?", options: [{ id: 'A', text: "문제를 잘게 쪼개어 하나씩 구조적으로 푼다." }, { id: 'B', text: "직관에 의존해 창의적인 해결책을 던진다." }] },
    { id: 5, question: "가장 만족스러운 피드백은?", options: [{ id: 'A', text: "'결과물의 완성도가 엄청나네요!'" }, { id: 'B', text: "'당신의 아이디어 덕분에 팀이 살았어요!'" }] },
    { id: 6, question: "업무 마감일이 다가올 때 당신은?", options: [{ id: 'A', text: "미리 끝내두고 여유롭게 검토한다." }, { id: 'B', text: "마감일의 압박 속에서 엄청난 초인적 힘을 낸다." }] },
    { id: 7, question: "새로운 기술이나 툴이 등장했을 때?", options: [{ id: 'A', text: "남들이 써보고 좋다고 할 때까지 기다린다." }, { id: 'B', text: "가장 먼저 다운받아서 요리조리 만져본다." }] },
    { id: 8, question: "회의 시간에 주로 취하는 포지션은?", options: [{ id: 'A', text: "다른 사람의 의견을 경청하고 정리한다." }, { id: 'B', text: "주도적으로 분위기를 띄우고 의견을 제시한다." }] },
    { id: 9, question: "이력서를 작성할 때 가장 신경 쓰는 부분은?", options: [{ id: 'A', text: "수치화된 성과와 정확한 팩트" }, { id: 'B', text: "나만의 독특한 스토리와 디자인 요소" }] },
    { id: 10, question: "내가 가장 피하고 싶은 업무 환경은?", options: [{ id: 'A', text: "체계 없고 룰이 계속 바뀌는 혼란스러운 곳" }, { id: 'B', text: "매일 똑같은 일만 반복해야 하는 지루한 곳" }] },
  ];

  // 30가지 세부 페르소나 데이터
  const PERSONAS = [
    { name: '실행력 100% 불도저', desc: '망설임 없이 일단 부딪히며 문제를 해결하는 탁월한 실행의 아이콘입니다.', jobs: ['스타트업 창업가', '그로스 해커'] },
    { name: '데이터가 취향인 분석가', desc: '직관보다는 숫자와 팩트를 사랑하는 분석의 스페셜리스트입니다.', jobs: ['데이터 분석가', '퍼포먼스 마케터'] },
    { name: '따뜻한 커뮤니케이터', desc: '팀원들의 마음을 읽고 조직의 갈등을 부드럽게 풀어내는 윤활유입니다.', jobs: ['HR 매니저', '커뮤니티 매니저'] },
    { name: '픽셀 완벽주의 장인', desc: '1px의 오차도 허용하지 않는 섬세함과 높은 미적 감각의 소유자입니다.', jobs: ['UX/UI 디자이너', '프론트엔드 개발자'] },
    { name: '아이디어 뱅크 크리에이터', desc: '마르지 않는 톡톡 튀는 아이디어로 세상에 없는 기획을 만들어냅니다.', jobs: ['콘텐츠 기획자', '카피라이터'] },
    { name: '치밀한 룰 브레이커', desc: '규칙을 파괴하면서도 그 안에 자기만의 완벽한 체계를 세우는 전략가입니다.', jobs: ['사업 전략가', '경영 컨설턴트'] },
    { name: '조용한 그림자 리더', desc: '앞장서기보단 뒤에서 묵묵히 팀을 서포트하며 결과를 만들어내는 숨은 영웅입니다.', jobs: ['백엔드 개발자', '프로젝트 매니저'] },
    { name: '공감 능력 만렙 상담가', desc: '사용자의 숨겨진 니즈를 누구보다 잘 캐치해내는 감성적인 기획자입니다.', jobs: ['UX 리서처', 'CX 매니저'] },
    { name: '지치지 않는 에너자이저', desc: '어떤 실패에도 굴하지 않는 멘탈과 넘치는 에너지로 세일즈를 리드합니다.', jobs: ['세일즈 매니저', 'B2B 영업'] },
    { name: '효율성 끝판왕 자동화러', desc: '반복되는 걸 못 참으며 모든 걸 자동화시켜버려야 직성이 풀리는 천재입니다.', jobs: ['DevOps 엔지니어', 'RPA 개발자'] },
    { name: '트렌드 서퍼', desc: '새로운 밈과 유행을 누구보다 빨리 캐치하여 비즈니스에 녹여내는 감각이 있습니다.', jobs: ['SNS 마케터', '브랜드 마케터'] },
    { name: '방구석 아인슈타인', desc: '혼자만의 시간에서 폭발적인 지적 성과를 만들어내는 고도의 집중력 소유자입니다.', jobs: ['AI 연구원', '퀀트 분석가'] },
    { name: '육각형 올라운더', desc: '개발, 디자인, 기획, 마케팅 어느 하나 빠지지 않고 두루두루 다 잘하는 만능캐입니다.', jobs: ['스타트업 C-Level', 'PO(Product Owner)'] },
    { name: '리스크 관리 마스터', desc: '모든 최악의 수를 미리 계산하고 대비책을 세워두는 든든한 방패입니다.', jobs: ['보안 엔지니어', 'QA 엔지니어'] },
    { name: '인사이트 발굴러', desc: '방대한 정보의 홍수 속에서 핵심적인 인사이트 하나를 날카롭게 뽑아냅니다.', jobs: ['전략 기획자', '데이터 사이언티스트'] },
    { name: '비주얼 마술사', desc: '평범한 텍스트도 눈이 번쩍 뜨이는 시각물로 마법처럼 바꿔냅니다.', jobs: ['그래픽 디자이너', '영상 편집자'] },
    { name: '글로벌 유목민', desc: '국경이나 장소에 얽매이지 않고 넓은 시야로 세상을 바라보는 자유로운 영혼입니다.', jobs: ['해외 영업', '글로벌 마케터'] },
    { name: '논리정연 스피커', desc: '아무리 어려운 개념도 아주 쉽고 설득력 있게 말이나 글로 풀어내는 능력이 탁월합니다.', jobs: ['테크니컬 라이터', '프리세일즈'] },
    { name: '소셜 네트워킹 킹', desc: '어딜 가든 5분 안에 친구를 만들고 거대한 인맥 네트워크를 형성합니다.', jobs: ['PR 매니저', '파트너십 매니저'] },
    { name: '무결점 마감 요정', desc: '아무리 촉박한 마감이라도 퀄리티 저하 없이 귀신같이 맞춰내는 책임감의 화신입니다.', jobs: ['에이전시 PM', '출판 편집자'] },
    { name: '혁신적인 몽상가', desc: '남들이 불가능하다고 말할 때 상상력을 동원해 새로운 길을 제시합니다.', jobs: ['게임 디렉터', '신사업 기획자'] },
    { name: '친절한 가이드라인', desc: '복잡한 매뉴얼을 정리하고 룰을 세워서 모두가 편하게 일하도록 돕습니다.', jobs: ['Technical PM', '사내 오퍼레이션'] },
    { name: '위기 대처반장', desc: '긴급 상황이 터졌을 때 가장 침착하고 냉정하게 문제를 수습하는 강심장입니다.', jobs: ['SRE 엔지니어', '위기관리 PR'] },
    { name: '공간 활용의 마법사', desc: '오프라인과 온라인을 넘나들며 사용자 경험을 설계하는 능력이 뛰어납니다.', jobs: ['O2O 서비스 기획자', '공간 디자이너'] },
    { name: '디테일 수집가', desc: '남들이 무심코 지나치는 아주 사소한 힌트를 주워모아 큰 그림을 완성합니다.', jobs: ['UX 라이터', '디지털 포렌식'] },
    { name: '프로 N잡러', desc: '하나의 직업에 만족하지 않고 다양한 자아를 실현하며 끊임없이 도전합니다.', jobs: ['크리에이터', '프리랜서 마케터'] },
    { name: '팩트 폭격기', desc: '회의에서 뼈 때리는 객관적인 지적으로 팀이 올바른 방향으로 가도록 돕습니다.', jobs: ['회계감사', '투자 심사역'] },
    { name: '긍정 바이러스', desc: '팀의 사기가 떨어졌을 때 분위기를 확 끌어올리는 대체 불가능한 무드 메이커입니다.', jobs: ['사내 문화 담당자', '컬쳐 핏 인터뷰어'] },
    { name: '딥다이브 연구가', desc: '자신이 꽂힌 한 분야에 대해서는 끝을 볼 때까지 깊게 파고드는 오타쿠 기질이 있습니다.', jobs: ['블록체인 코어 개발', '리서치 엔지니어'] },
    { name: '무한 동력 학습기', desc: '항상 새로운 것을 배우고 흡수하는 속도가 스펀지 같아서 성장의 한계가 없습니다.', jobs: ['주니어 풀스택 개발자', '퍼포먼스 마케터'] }
  ];

  const handleAnswer = async (optionId: string) => {
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // 퀴즈 완료 시 30개 중 하나를 결정하는 해시 로직 (답변 조합에 따라 고유한 인덱스 도출)
      const answerString = newAnswers.join('');
      let hash = 0;
      for (let i = 0; i < answerString.length; i++) {
        hash = ((hash << 5) - hash) + answerString.charCodeAt(i);
        hash |= 0; 
      }
      const personaIndex = Math.abs(hash) % PERSONAS.length;
      const selectedPersona = PERSONAS[personaIndex];
      
      setResultPersona(selectedPersona);
      setIsFinished(true);

      // 구글 시트에 업데이트 반영
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        await updateUserPersona(userEmail, selectedPersona.name);
      }
    }
  };

  if (isFinished && resultPersona) {
    return (
      <main className="flex flex-col items-center justify-center min-h-full p-6 bg-background relative overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">분석이 완료되었습니다! 🎉</h2>
        <PersonaCard 
          name={resultPersona.name}
          description={resultPersona.desc}
          jobs={resultPersona.jobs}
        />
        <button 
          onClick={() => router.push('/dashboard')}
          className="mt-10 w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-bold transition-colors"
        >
          내 맞춤형 진로 맵 보러가기
        </button>
      </main>
    );
  }

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <main className="flex flex-col min-h-full p-6 bg-background">
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-12 mt-8">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-sm text-primary font-bold tracking-widest mb-4">QUESTION {currentStep + 1} <span className="text-slate-500 text-xs">/ 10</span></h2>
        <h1 className="text-2xl font-bold text-white leading-snug mb-10">
          {currentQ.question}
        </h1>

        <div className="space-y-4">
          {currentQ.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.id)}
              className="w-full text-left p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-primary/50 text-slate-200 transition-all duration-200 active:scale-[0.98]"
            >
              <span className="inline-block w-8 font-mono text-slate-500">{opt.id}.</span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
