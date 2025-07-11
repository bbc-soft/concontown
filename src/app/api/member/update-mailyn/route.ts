import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { member_idx, MailYN } = body;

  if (!member_idx) {
    return NextResponse.json({ result: '9999', error: 'Missing member_idx' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();

    const result = await pool
      .request()
      .input('member_idx', sql.Int, member_idx)
      .input('MailYN', sql.Char, MailYN)
      .execute('Set_MailYN');

    const output = result.recordset?.[0];

    return NextResponse.json({
      result: output?.result?.toString() || '9999',  // 프로시저에서 반환되는 필드명이 `result`인 점 주의
    });
  } catch (err) {
    console.error('[Set_MailYN Error]', err);
    return NextResponse.json({ result: '9999', error: 'DB error' }, { status: 500 });
  }
}
