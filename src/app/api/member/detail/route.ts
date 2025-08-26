import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const memberIdx = req.nextUrl.searchParams.get('member_idx');

  if (!memberIdx) {
    return NextResponse.json({ error: 'member_idx is required' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('member_idx', sql.Int, memberIdx)
      .execute('Get_Member_Detail');

    const rows = result.recordset;

    // ✅ 로그 추가
    // console.log('🧾 [Get_Member_Detail Result]', rows);

    return NextResponse.json(rows?.[0] || {});
  } catch (error) {
    console.error('[Member Detail API Error]', error);
    return NextResponse.json({ error: 'Failed to fetch member detail' }, { status: 500 });
  }
}
