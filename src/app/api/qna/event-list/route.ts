import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export const runtime = 'nodejs';

interface QnAEventRow {
    VALUE: string;
    TITLE: string;
  }


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const member_idx = searchParams.get('member_idx');

    if (!member_idx) {
      return NextResponse.json({ error: 'member_idx is required' }, { status: 400 });
    }

    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('member_idx', sql.Int, Number(member_idx))
      .execute('Get_QnA_Member_Event');

    const formatted = result.recordset.map((row: QnAEventRow) => ({
    VALUE: row.VALUE,
    TITLE: row.TITLE.replace(/<br\s*\/?>/gi, ' ').trim(),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('이벤트 리스트 불러오기 실패:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
