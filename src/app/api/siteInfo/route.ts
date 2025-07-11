// src/app/api/siteInfo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('LangId') || 'EN';

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('LangId', sql.Char(2), lang)
      .execute('Get_Site_Info');

    return NextResponse.json(result.recordset[0]);
  } catch (err) {
    console.error('사이트 정보 조회 실패:', err);
    return NextResponse.json({ error: 'Failed to load site info' }, { status: 500 });
  }
}
