//  전체 FAQ 리스트 API - /api/faq/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const langId = req.nextUrl.searchParams.get('LangId') || 'EN';

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('LangId', sql.Char(2), langId)
      .execute('Get_FAQ_list');

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('FAQ 리스트 조회 실패:', err);
    return NextResponse.json({ error: 'Failed to load FAQ list' }, { status: 500 });
  }
}

