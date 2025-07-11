// app/api/auth/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { member_id, nationality } = await req.json();

  const pool = await getDBConnection();

  try {
    const result = await pool
      .request()
      .input('Nationality', sql.VarChar, nationality)
      .input('Mail', sql.VarChar, member_id)
      .execute('Set_TokenSend');

      console.log('result', result);

    // const record = result.recordset?.[0];

    // if (!record || record.result !== '0000') {
    //   return NextResponse.json({ error: '인증번호 전송 실패' }, { status: 401 });
    // }

    return NextResponse.json(result);
    
  } catch (err) {
    console.error('인증번호 전송:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
