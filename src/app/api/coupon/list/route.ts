// app/api/coupon/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const langId = req.nextUrl.searchParams.get('LangId') || 'EN';
  const memberIdx = req.nextUrl.searchParams.get('member_idx');

  if (!memberIdx) {
    return NextResponse.json({ error: 'member_idx is required' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('LangId', sql.Char(2), langId)
      .input('member_idx', sql.Int, memberIdx)
      .execute('Get_Member_Coupon_List');

    const rows = result.recordset;

    return NextResponse.json(rows);
  } catch (err) {
    console.error('쿠폰 조회 실패:', err);
    return NextResponse.json({ error: '쿠폰 조회 실패' }, { status: 500 });
  }
}
