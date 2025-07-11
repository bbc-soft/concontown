import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { res_day, res_seq, member_idx, LangId = 'EN' } = await req.json();

  if (!res_day || !res_seq || !member_idx) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();

    const result = await pool
      .request()
      .input('LangId', sql.NVarChar, LangId)
      .input('Member_Idx', sql.Int, Number(member_idx))
      .input('Res_day', sql.NVarChar, String(res_day))
      .input('Res_Seq', sql.NVarChar, String(res_seq))
      .execute('Get_Booking_Cancel'); 

    const output = result.recordset?.[0];

    if (!output || output.Result !== '0000') {
      return NextResponse.json({
        success: false,
        result: output?.Result || '9999',
        message: output?.ResultStr || 'Unable to cancel payment at this time.',
      });
    }

    // ✅ 통화 설정: 추후 output.currency가 나오면 그걸 쓰세요
    const currency = output.currency || (output.PG === 'TOSS' ? 'USD' : 'KRW');

    return NextResponse.json({
      success: true,
      result: output.Result,
      amount: output.amount,
      UserCancelPenalty: output.UserCancelPenalty,
      refund_amount: output.refund_amount,
      PG: output.PG,
      txn_id: output.txn_id,
      currency, // ✅ 프론트에 전달
    });

  } catch (error) {
    console.error('[Cancel Fee API Error]', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
