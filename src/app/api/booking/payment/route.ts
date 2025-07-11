import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';


export async function POST(req: NextRequest) {
  try {
    const { member_idx, res_day, res_seq } = await req.json();

    if (!member_idx || !res_day || !res_seq) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    // DB 연결
    const pool = await getDBConnection();

    // 프로시저 호출
    const result = await pool.request()
      .input('Member_idx', sql.Int, member_idx)
      .input('Res_day', sql.NVarChar(8), res_day)
      .input('Res_seq', sql.Int, res_seq)
      .execute('Get_Booking_Payment_List');

    const recordset = result.recordset;

    return NextResponse.json(recordset ?? []);
  } catch (error) {
    console.error('[❌ Booking Payment API Error]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
