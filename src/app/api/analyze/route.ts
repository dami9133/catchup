import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, questId, answerText } = body;

    // TODO: 나중에 여기에 OpenAI API를 호출하여 유저의 텍스트(answerText)를 분석하고,
    // 주도성 및 분석 역량 등을 평가하는 프롬프트 엔지니어링 로직이 들어갈 자리입니다.
    
    // 현재는 가상의 AI 평가 리포트를 성공(200) 상태로 반환합니다.
    const mockReport = {
      success: true,
      analysis: {
        initiativeScore: 85,
        analyticalScore: 92,
        summary: "주어진 문제 상황에서 구조적인 접근을 시도했으며, 실행 전 데이터를 먼저 검토하려는 분석적 성향이 강하게 나타났습니다.",
        recommendedPersona: "혁신적인 문제해결사"
      }
    };

    // 지연 시간(AI 분석 시뮬레이션)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(mockReport, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
