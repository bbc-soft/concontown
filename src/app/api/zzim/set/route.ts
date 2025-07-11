// src/app/api/zzim/set/route.ts
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { event_idx, member_idx } = await req.json();

  if (!event_idx || !member_idx) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Method', sql.NVarChar, 'SET')
      .input('Event_Idx', sql.Int, event_idx)
      .input('Member_Idx', sql.Int, member_idx)
      .execute('Set_Member_ZZIM');

    return NextResponse.json(result.recordset[0]);
  } catch (err) {
    console.error('찜 실행 실패:', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
