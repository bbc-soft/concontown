// /src/app/api/event/pickup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const event_idx = req.nextUrl.searchParams.get('event_idx');

  if (!event_idx) {
    return NextResponse.json({ error: 'Missing event_idx' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('event_idx', sql.Int, event_idx)
      .execute('Get_Event_PickUp_Option');

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('[PickupOption API Error]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
