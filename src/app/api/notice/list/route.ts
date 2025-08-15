import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const LangId = params.get('lang') || 'EN';
  const Member_Idx = parseInt(params.get('member') || '1');
  const Type = params.get('type') || 'NOTICE';
  const isMAIN = params.get('main') || 'Y';

  try {
    const pool = await getDBConnection();
    const result = await pool.request()
      .input('LangId', sql.Char(2), LangId)
      .input('Type', sql.VarChar(10), Type)
      .input('Member_Idx', sql.Int, Member_Idx)
      // .input('isMAIN', sql.Char(1), isMAIN)
      .execute('Get_General_Notice_List');

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('[Notice List API Error]', err);
    return NextResponse.json({ error: 'Failed to fetch notice list' }, { status: 500 });
  }
}
