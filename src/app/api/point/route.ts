// app/api/point/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  try {
    const { member_idx, lang = 'EN' } = await req.json();

    const pool = await getDBConnection();

    const result = await pool
      .request()
      .input('LangId', sql.NVarChar, lang)
      .input('member_idx', sql.Int, member_idx)
      .execute('Get_Member_Point_List');

    const points = result.recordset;

    return NextResponse.json(points);
  } catch (error) {
    console.error('[Point API Error]', error);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
