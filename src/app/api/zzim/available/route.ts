// src/app/api/zzim/available/route.ts
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const event_idx = Number(searchParams.get('event_idx'));
  const member_idx = Number(searchParams.get('member_idx'));

  if (!event_idx || !member_idx) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Method', sql.NVarChar, 'GET')
      .input('Event_Idx', sql.Int, event_idx)
      .input('Member_Idx', sql.Int, member_idx)
      .execute('Set_Member_ZZIM');

    return NextResponse.json(result.recordset[0]);
  } catch (err) {
    console.error('찜 가능 여부 확인 실패:', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
