// /src/app/api/notice/banner/route.ts
import { NextRequest, NextResponse } from 'next/server';

import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const lang = req.nextUrl.searchParams.get('lang') || 'EN';
    const member = req.nextUrl.searchParams.get('member') || '1';

    const pool = await getDBConnection();

    const result = await pool.request()
      .input('LangId', sql.Char(2), lang)
      .input('Member_Idx', sql.Int, parseInt(member))
      .execute('Get_Notice_Banner');

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('[Notice Banner API]', error);
    return NextResponse.json({ error: 'Failed to fetch notice banner' }, { status: 500 });
  }
}
