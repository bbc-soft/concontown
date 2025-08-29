import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'EN';
    const member_idx = parseInt(searchParams.get('member_idx') || '0');
    const page = parseInt(searchParams.get('page') || '1');
    const size = parseInt(searchParams.get('size') || '20');

    if (!member_idx) {
      return NextResponse.json({ error: 'member_idx is required' }, { status: 400 });
    }

    const pool = await getDBConnection();
    const result = await pool.request()
      .input('LangId', sql.Char(2), lang)
      .input('member_idx', sql.Int, member_idx)
      .input('intPageNo', sql.Int, page)
      .input('intPageSize', sql.Int, size)
      .execute('Get_Member_QnA_list');

    // console.dir(result, { depth: null });
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('QnA 리스트 API 오류:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
