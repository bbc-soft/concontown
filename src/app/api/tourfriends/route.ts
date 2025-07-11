// src/app/api/tourfriends/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const member_idx = req.nextUrl.searchParams.get('member_idx');

  if (!member_idx) {
    return NextResponse.json({ error: 'Missing member_idx' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Method', sql.VarChar(10), 'SELECT')
      .input('Member_Idx', sql.Int, parseInt(member_idx))
      .execute('Set_Tour_Friends');

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('Tour friend list fetch failed:', err);
    return NextResponse.json({ error: 'Failed to load tour friends' }, { status: 500 });
  }
}
