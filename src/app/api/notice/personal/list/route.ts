// /src/app/api/notice/personal/list/route.ts
import { NextRequest, NextResponse } from 'next/server';

import sql from 'mssql';
import { getDBConnection } from '../../../../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const lang = req.nextUrl.searchParams.get('lang') || 'EN';
    const type = req.nextUrl.searchParams.get('type') || 'NOTICE';
    const member = req.nextUrl.searchParams.get('member') || '1';

    const pool = await getDBConnection();

    const result = await pool.request()
      .input('LangId', sql.Char(2), lang)
      .input('Type', sql.VarChar(10), type)
      .input('Member_Idx', sql.Int, parseInt(member))
      .execute('Get_Personal_Notice_List');

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('[Personal Notice List API]', error);
    return NextResponse.json({ error: 'Failed to fetch personal notice list' }, { status: 500 });
  }
}
