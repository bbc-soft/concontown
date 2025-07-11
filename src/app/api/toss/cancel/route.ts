import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const {
      paymentKey,
      cancelReason,
      cancelAmount,
      res_day,
      res_seq,
      type_seq,
      remark
    } = await req.json();

    const secretKey = 'live_gsk_DnyRpQWGrNWdWERY2M0l8Kwv1M9E';
    const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

    // ✅ Step 1: 결제 정보 조회 (통화 확인)
    const paymentRes = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${encodedKey}`,
      }
    });

    const paymentInfo = await paymentRes.json();
    const currency = paymentInfo?.currency || 'USD'; // 기본값 USD

    // ✅ Step 2: 취소 요청
    const tossRes = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancelReason, cancelAmount, currency }),
    });

    const tossResult = await tossRes.json();

    // ✅ Step 3: DB 저장
    const pool = await getDBConnection();
    const request = pool.request();

    request.input('Res_day', sql.NVarChar(8), res_day);
    request.input('Res_seq', sql.Int, res_seq);
    request.input('Type_seq', sql.Int, type_seq ?? null);
    request.input('PG', sql.NVarChar(50), 'TOSS');
    request.input('RQ', sql.NVarChar(sql.MAX), JSON.stringify({ cancelReason }));
    request.input('RS', sql.NVarChar(sql.MAX), JSON.stringify(tossResult));
    request.input('TYPE', sql.NVarChar(50), 'CANCEL');
    request.input('REMARK', sql.NVarChar(50), remark || 'EVENT');

    const param =  {
        Res_day: res_day,
        Res_seq: res_seq,
        Type_seq: type_seq,
        PG: 'TOSS',
        RQ: JSON.stringify({ cancelReason }),
        RS: JSON.stringify(tossResult),
        TYPE: 'CANCEL',
        REMARK: remark || 'EVENT'
      }

    const dbResult = await request.execute('Set_Payment_Log');
    const resultCode = dbResult.recordset?.[0]?.Result ?? 'UNKNOWN';

    const isSuccess = resultCode === '0000';//tossRes.ok && resultCode === '0000';

    return NextResponse.json({
      // request: param,
      success: isSuccess,
      resultCode: resultCode,
      tossResult: tossResult,
      currencyUsed: currency
    }, { status: isSuccess ? 200 : 207 });

  } catch (error) {
    console.error('[TOSS CANCEL ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
