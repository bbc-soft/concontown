// /src/app/api/booking/detail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { member_idx, res_day, res_seq } = await req.json();

    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Member_Idx', sql.Int, member_idx)
      .input('Res_day', sql.VarChar, res_day)
      .input('Res_Seq', sql.Int, res_seq)
      .execute('Get_Booking_Detail');

    return NextResponse.json(result.recordset);
  } catch (err: any) {
    console.error('❌ 예약 상세 조회 실패:', err.message || err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
