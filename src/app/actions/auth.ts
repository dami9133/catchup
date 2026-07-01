'use server';

import { appendRow, updateRowByEmail, findUserByEmail } from '@/lib/googleSheets';

export async function signupUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const email = formData.get('email') as string || `sns_${Date.now()}@example.com`;
    const provider = formData.get('provider') as string || 'Email';
    const password = formData.get('password') as string || ''; // 실제 서비스에선 해싱 권장

    // 중복 이메일 검사
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return { success: false, message: '이미 가입된 이메일입니다.' };
    }

    // 타임스탬프 기반 임시 ID 생성
    const id = `usr_${Date.now()}`;

    // Users 시트에 넣을 데이터 행
    const rowData = {
      id: id,
      email: email,
      name: `[${provider}] ${name}`, // SNS 식별 용이하게
      password: password, // 비밀번호 필드 추가
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

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' };
    }

    if (user.password !== password) {
      return { success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' };
    }

    // 인증 성공 시 비밀번호를 제외한 유저 정보 반환
    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser };

  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, message: '로그인 처리 중 문제가 발생했습니다.' };
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

// 이메일 인증 발송
export async function sendVerificationEmail(email: string) {
  // 실제 서비스 환경에서는 env에 배포된 GAS 웹앱 URL을 설정해야 합니다.
  const gasUrl = process.env.NEXT_PUBLIC_GAS_URL || process.env.GAS_WEB_APP_URL;
  
  if (!gasUrl) {
    console.warn('GAS_WEB_APP_URL이 설정되지 않았습니다. 개발 환경 모의 작동합니다.');
    // 개발 모드 모의 성공
    return { success: true, message: '[개발 모드] 인증번호 123456이 발송되었습니다. (실제 메일 발송 안됨)' };
  }

  try {
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type: 'send_verification', email }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Send Verification Error:', error);
    return { success: false, message: '이메일 발송에 실패했습니다.' };
  }
}

// 이메일 인증코드 확인
export async function verifyEmailCode(email: string, code: string) {
  const gasUrl = process.env.NEXT_PUBLIC_GAS_URL || process.env.GAS_WEB_APP_URL;

  if (!gasUrl) {
    if (code === '123456') {
      return { success: true, message: '인증에 성공했습니다.' };
    }
    return { success: false, message: '인증번호가 일치하지 않습니다.' };
  }

  try {
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type: 'verify_code', email, code }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Verify Code Error:', error);
    return { success: false, message: '인증 검증에 실패했습니다.' };
  }
}
