// app/api/auth/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { member_id, lang_id } = await req.json();

  const pool = await getDBConnection();

  try {
    const result = await pool
      .request()
      .input('LangID', sql.VarChar, lang_id)
      .input('Mail', sql.VarChar, member_id)
      .execute('Set_TokenSend');

      console.log('result', result);

    return NextResponse.json(result);
    
  } catch (err) {
    console.error('인증번호 전송:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
