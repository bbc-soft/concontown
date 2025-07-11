// src/app/api/event/cancel-policy/route.ts
import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event_idx = searchParams.get('event_idx');

  if (!event_idx) {
    return NextResponse.json({ error: 'event_idx is required' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('event_idx', sql.Int, Number(event_idx))
      .query(`exec [dbo].[Get_Event_CancelPolicy] @event_idx=@event_idx`);

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('취소 수수료 API 실패:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
