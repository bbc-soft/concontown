// /app/api/member/update-pushyn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { member_idx, isPush } = body;

  if (!member_idx || !['Y', 'N'].includes(isPush)) {
    return NextResponse.json({ result: '9999', error: 'Invalid params' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('member_idx', sql.Int, member_idx)
      .input('isPush', sql.Char, isPush)
      .execute('Set_isPush');

    const output = result.recordset?.[0];

    return NextResponse.json({
      result: output?.result?.toString() || '9999',
    });
  } catch (err) {
    console.error('[Set_isPush Error]', err);
    return NextResponse.json({ result: '9999', error: 'DB error' }, { status: 500 });
  }
}
