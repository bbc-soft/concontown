import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../../lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  
  console.log('Set_Booking_Master 요청 파라미터:', body);

  const {
    member_idx, event_idx, package_idx, ticket_idx,
    pickup_idx = 0, option_idx = 0,
    coupon_idx = 0, u_ip = '', lang = 'EN',
    point = 0
  } = body;

  try {
    const pool = await getDBConnection();

    const result = await pool.request()
      .input('method', sql.VarChar, 'INSERT')
      .input('LangId', sql.NVarChar, lang)
      .input('Member_Idx', sql.Int, member_idx)
      .input('Event_Idx', sql.Int, event_idx)
      .input('Package_Idx', sql.Int, package_idx)
      .input('Ticket_Idx', sql.Int, ticket_idx)
      .input('Pickup_Idx', sql.Int, pickup_idx)
      .input('Option_Idx', sql.Int, option_idx)
      .input('Coupon_Idx', sql.Int, coupon_idx)
      .input('U_IP', sql.VarChar, u_ip)
      .input('Point', sql.Int, point)
      .execute('Set_Booking_Master');

    const record = result.recordset?.[0];

    if (!record) {
      console.warn('⚠️ DB에서 반환된 결과가 없습니다.');
      return NextResponse.json({ error: 'No result returned from DB' }, { status: 500 });
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error('❌ Set_Booking_Master 실패:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
