import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const event_idx = searchParams.get('event_idx');
  const langId = searchParams.get('LangId') || 'EN';

  if (!event_idx) {
    return NextResponse.json({ error: 'event_idx is required' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();

    await pool.request().query('SET TEXTSIZE 2147483647');

    // console.log('📨 프로시저 요청 파라미터:', {
    //   LangId: langId,
    //   Event_idx: Number(event_idx),
    // });

    const result = await pool
      .request()
      .input('LangId', sql.NVarChar, langId)
      .input('Event_idx', sql.Int, Number(event_idx))
      .query(`exec [dbo].[Get_Event_Detail] @LangId=@LangId, @Event_idx=@Event_idx`);

    // console.log('✅ 프로시저 응답 recordset:', result.recordset);

    if (result.recordset.length === 0) {
      console.warn('⚠️ 결과 없음');
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ 이벤트 상세 API 실패:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
