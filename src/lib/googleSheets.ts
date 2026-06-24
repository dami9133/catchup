import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

// 시트 ID (URL에서 추출)
const SHEET_ID = '1MD7Uurqsk3a8ZvHlaiB60u83vrr0kzmNSs4QuCe6btk';

export async function getGoogleSheet(tabName: string) {
  try {
    let clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    // 환경 변수가 없으면 로컬 JSON 파일에서 읽기 (로컬 개발용)
    if (!clientEmail || !privateKey) {
      const keyFilePath = path.join(process.cwd(), 'catchup-500203-22af005da0f1.json');
      if (fs.existsSync(keyFilePath)) {
        const keyFile = fs.readFileSync(keyFilePath, 'utf8');
        const creds = JSON.parse(keyFile);
        clientEmail = creds.client_email;
        privateKey = creds.private_key;
      } else {
        throw new Error('Google credentials not found in environment variables or local JSON file.');
      }
    }

    // privateKey의 줄바꿈 문자를 실제 줄바꿈으로 치환 (Vercel 환경 변수 대응)
    // 쌍따옴표로 묶여있을 수 있으니 쌍따옴표 제거 로직 추가
    const formattedPrivateKey = privateKey?.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

    // JWT 인증 객체 생성
    const serviceAccountAuth = new JWT({
      email: clientEmail,
      key: formattedPrivateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    // 스프레드시트 초기화
    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    
    // 시트 메타데이터 로드
    await doc.loadInfo(); 
    
    // 탭 이름으로 시트 찾기 (예: 'Users')
    const sheet = doc.sheetsByTitle[tabName];
    
    if (!sheet) {
      throw new Error(`Sheet titled "${tabName}" not found`);
    }

    return sheet;
  } catch (error) {
    console.error('Error connecting to Google Sheets:', error);
    throw error;
  }
}

export async function appendRow(tabName: string, rowData: Record<string, string | number | boolean>) {
  try {
    const sheet = await getGoogleSheet(tabName);
    // 컬럼 헤더가 시트에 미리 정의되어 있어야 합니다.
    await sheet.addRow(rowData);
    return true;
  } catch (error) {
    console.error('Error appending row to Google Sheets:', error);
    throw error;
  }
}

export async function updateRowByEmail(tabName: string, email: string, updates: Record<string, string | number | boolean>) {
  try {
    const sheet = await getGoogleSheet(tabName);
    const rows = await sheet.getRows();
    const targetRow = rows.find(row => row.get('email') === email);
    
    if (targetRow) {
      targetRow.assign(updates);
      await targetRow.save();
      return true;
    } else {
      console.warn(`Row with email ${email} not found in ${tabName}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating row in Google Sheets:', error);
    throw error;
  }
}
