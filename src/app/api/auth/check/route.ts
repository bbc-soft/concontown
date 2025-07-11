// app/api/auth/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { member_id, token } = await req.json();

  const pool = await getDBConnection();

  try {
    const result = await pool
      .request()
      .input('Mail', sql.VarChar, member_id)
      .input('Token', sql.VarChar, token)
      .execute('Set_TokenCheck');

    const output = result.recordset?.[0];
    return NextResponse.json(output);
    
  } catch (err) {
    console.error('인증 실패:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
