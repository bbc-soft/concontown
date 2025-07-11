// /app/api/member/setLang/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { member_idx, LangId } = body;

  if (!member_idx || !LangId) {
    return NextResponse.json({ result: '9999', error: 'Missing params' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();

    const result = await pool
      .request()
      .input('member_idx', sql.Int, member_idx)
      .input('LangId', sql.VarChar(10), LangId)
      .execute('Set_LangId');

    const output = result.recordset?.[0];

    return NextResponse.json({
      result: output?.result?.toString() || '9999',
    });
  } catch (err) {
    console.error('[Set_LangId Error]', err);
    return NextResponse.json({ result: '9999', error: 'DB error' }, { status: 500 });
  }
}
