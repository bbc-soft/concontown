import { NextRequest, NextResponse } from 'next/server';
import { executeProcedure} from '../../../../../lib/db'; // DB 유틸 경로에 맞게 조정
interface CheckDuplicateResult {
    result: string;
  }
  
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await executeProcedure('Set_Member', {
      method: 'INSERT',
      member_id: email,
      member_pwd: '',      // 필수지만 더미 값
      Name_1st: '',
      Name_2nd: '',
      Name_3rd: '',
      Birth_day: '',
      Birth_month: '',
      Birth_year: '',
      Gender: '',
      passport: '',
      Nationality: '',
      City: '',
      National_Code: '',
      zipcode: '',
      address: '',
      Phone: '',
      MailYN: '',
      favorite_artist: '',
      favorite_artist_etc: '',
      site_language: '',
      MailSelector: '',
      U_IP: '',
    });

      const typedResult = result as CheckDuplicateResult[];
      const code = typedResult[0]?.result;
      const exists = code === '0001';
      

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('❌ 이메일 중복 확인 오류:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
