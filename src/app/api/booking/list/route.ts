// ✅ /src/app/api/booking/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { member_idx } = await req.json();

    if (!member_idx) {
      return NextResponse.json({ error: 'Missing member_idx' }, { status: 400 });
    }

    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Member_Idx', sql.Int, member_idx)
      .execute('Get_Booking_List');

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('예약 리스트 조회 실패:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
