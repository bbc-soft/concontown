// src/app/api/reserve/check-allowed/route.ts
import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';


export async function POST(req: Request) {
  const { event_idx, member_idx, LangId } = await req.json();

  try {
    const pool = await getDBConnection();
    const result = await pool.request()
      .input('Event_idx', sql.Int, event_idx)
      .input('Member_idx', sql.Int, member_idx)
      .input('LangId', sql.Char(2), LangId)
      .execute('Get_Event_Allow_Member');

    const isAllowed = result.recordset?.[0]?.isAllowedMember ?? 'N';


    return NextResponse.json({ isAllowedMember: isAllowed });
  } catch (error) {
    console.error('예약 허용 체크 실패:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
