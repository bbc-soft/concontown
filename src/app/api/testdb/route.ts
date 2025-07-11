// app/api/testdb/route.ts
import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../../lib/db';

export async function GET() {
  try {
    const pool = await getDBConnection();
    const result = await pool.request().query('SELECT TOP 10 * FROM your_table');
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('DB 조회 실패:', error);
    return NextResponse.json({ error: 'DB 조회 실패' }, { status: 500 });
  }
}
