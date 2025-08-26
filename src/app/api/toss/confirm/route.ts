// /src/app/api/toss/confirm/route.ts

import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount, exchangeRate } = await req.json(); // ✅ 환율 받기
    console.log('✅ [Input Params]', { paymentKey, orderId, amount, exchangeRate });

    const secretKey = 'live_gsk_DnyRpQWGrNWdWERY2M0l8Kwv1M9E';
    const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

    console.log('결제 승인요청 파라미터:', {
       paymentKey: paymentKey,
       orderId: orderId,
       amount: amount
     });

    // ✅ Step 1: Toss 결제 승인 요청
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const tossResult = await tossRes.json();
    if (!tossRes.ok) {
      console.log('결제 승인요청 실패', tossResult);
      return NextResponse.json({ success: false, error: tossResult }, { status: tossRes.status });
    }

    console.log('결제 승인요청 성공');

    // ✅ Step 2: 예약코드 파싱
    const [Res_day, Res_seq_raw] = orderId.includes('-') ? orderId.split('-') : [null, null];
    const Res_seq = parseInt(Res_seq_raw || '', 10);
    const Type_seq = null;

    if (!Res_day || isNaN(Res_seq)) {
      return NextResponse.json({ success: false, error: 'Invalid order ID format' }, { status: 400 });
    }

    // ✅ Step 3: DB 저장
    const pool = await getDBConnection();
    const request = pool.request();

    request.input('Res_day', sql.NVarChar(8), Res_day);
    request.input('Res_seq', sql.Int, Res_seq);
    request.input('Type_seq', sql.Int, Type_seq);
    request.input('PG', sql.NVarChar(50), 'TOSS');
    request.input('RQ', sql.NVarChar(sql.MAX), JSON.stringify({ paymentKey, orderId, amount }));
    request.input('RS', sql.NVarChar(sql.MAX), JSON.stringify(tossResult));
    request.input('TYPE', sql.VarChar(50), 'APPROVAL');
    request.input('REMARK', sql.VarChar(100), 'EVENT');

    // ✅ 환율 값 전달
    if (exchangeRate && !isNaN(exchangeRate)) {
      request.input('exchange_rate', sql.Float, exchangeRate);
    }

    console.log('프로시저 실행 Set_Payment_Log');
    const dbResult = await request.execute('Set_Payment_Log');
    const output = dbResult.recordset?.[0];
    const dbCode = output?.Result ?? output?.result;

    if (dbCode !== '0000') {
      console.log('프로시저 실행 Set_Payment_Log 실패!!', dbResult);
      return NextResponse.json({ success: false, error: 'DB logging failed', result: dbCode }, { status: 500 });
    }

    console.log('프로시저 실행 Set_Payment_Log 성공!!');
    return NextResponse.json({ success: true, data: tossResult });

  } catch (error) {
    console.error('[❌ TOSS CONFIRM ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
