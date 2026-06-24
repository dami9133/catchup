'use server';

import { appendRow, updateRowByEmail } from '@/lib/googleSheets';

export async function signupUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const email = formData.get('email') as string || `sns_${Date.now()}@example.com`;
    const provider = formData.get('provider') as string || 'Email';

    // 타임스탬프 기반 임시 ID 생성
    const id = `usr_${Date.now()}`;

    // Users 시트에 넣을 데이터 행
    const rowData = {
      id: id,
      email: email,
      name: `[${provider}] ${name}`, // SNS 식별 용이하게
      age: age,
      persona_type: '미검사', // 테스트 전이므로
      level: 1,
      exp_score: 0,
      sub_status: 'FREE'
    };

    // 구글 시트에 데이터 추가
    await appendRow('Users', rowData);

    return { success: true, message: '회원가입이 완료되었습니다.', email: email };
  } catch (error: any) {
    console.error('Signup Error:', error);
    
    // 에러 메시지 상세화
    let errorMessage = '회원가입 처리 중 알 수 없는 오류가 발생했습니다.';
    const rawError = error.message || '';

    if (rawError.includes('403') || rawError.includes('Permission') || rawError.includes('caller does not have permission')) {
      errorMessage = '구글 시트 접근 권한이 없습니다. 시트 [공유] 설정에 서비스 계정(catchup@catchup-500203.iam.gserviceaccount.com)이 "편집자"로 추가되어 있는지 확인해주세요.';
    } else if (rawError.includes('not found') || rawError.includes('No sheet')) {
      errorMessage = '스프레드시트에서 "Users" 탭을 찾을 수 없습니다. 하단의 탭 이름이 정확히 Users인지 확인해주세요.';
    } else {
      errorMessage = `API 오류: ${rawError}`;
    }

    return { success: false, message: errorMessage };
  }
}

export async function updateUserPersona(email: string, persona: string) {
  try {
    await updateRowByEmail('Users', email, { persona_type: persona });
    return { success: true };
  } catch (error) {
    console.error('Update Persona Error:', error);
    return { success: false };
  }
}
