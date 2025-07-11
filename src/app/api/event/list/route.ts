// app/api/event/list/route.ts

export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('LangId') || 'EN';
    const memberIdx = parseInt(searchParams.get('member_idx') || '0', 10);

    if (!memberIdx || !lang) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('LangId', sql.Char(2), lang)
      .input('member_idx', sql.Int, memberIdx)
      .query('EXEC dbo.Get_Event_List @LangId=@LangId, @member_idx=@member_idx');

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('이벤트 리스트 조회 실패:', err);
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }
}
