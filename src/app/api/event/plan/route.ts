import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event_idx = searchParams.get('event_idx');
  const member_idx = searchParams.get('member_idx');
  const package_idx = searchParams.get('package_idx') || '0';

  if (!event_idx || !member_idx) {
    return NextResponse.json({ error: 'event_idx and member_idx are required' }, { status: 400 });
  }

  try {
    //console.log(`▶️ 실행 프로시저: exec [dbo].[Get_Event_Plan] @Member_Idx=${member_idx}, @event_idx=${event_idx}, @Package_Idx=${package_idx}`);

    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Member_Idx', sql.Int, Number(member_idx))
      .input('event_idx', sql.Int, Number(event_idx))
      .input('Package_Idx', sql.Int, Number(package_idx))
      .query('exec [dbo].[Get_Event_Plan] @Member_Idx, @event_idx, @Package_Idx');

    // ✅ 로그 추가
    //console.log('✅ [Get_Event_Plan] 응답 데이터:', result.recordset);

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('❌ 패키지 플랜 조회 실패:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
