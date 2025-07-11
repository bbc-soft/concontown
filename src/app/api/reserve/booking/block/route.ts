// /src/app/api/reserve/booking/block/route.ts
import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../../lib/db';

export async function POST(req: Request) {
  const body = await req.json();

  // ✅ 예약번호 조합된 값으로 들어온 경우 분리 처리
  let Res_Day = body.Res_Day;
  let Res_Seq = body.Res_Seq;

  if (body.reservation_code) {
    const [day, seq] = body.reservation_code.split('-');
    Res_Day = day;
    Res_Seq = seq;
  }

  const {
    payment_method = 'all',
    payment_divide = '',
    payment_email = ''
  } = body;

  try {
    const pool = await getDBConnection();
    const result = await pool.request()
      .input('Res_Day', sql.VarChar, Res_Day)
      .input('Res_Seq', sql.Int, Number(Res_Seq))
      .input('payment_method', sql.VarChar, payment_method)
      .input('payment_divide', sql.VarChar, payment_divide)
      .input('payment_email', sql.VarChar, payment_email)
      .execute('Set_Booking');

    return NextResponse.json({ success: true, result: result.recordset });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Booking block failed' }, { status: 500 });
  }
}
