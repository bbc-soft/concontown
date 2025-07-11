import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection, sql } from '../../../../../lib/db'; // DB 연결 유틸 경로에 맞게 수정

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const event_idx = searchParams.get('event_idx');
  const package_code = searchParams.get('package_code');
  const ticket_idx = searchParams.get('ticket_idx') || '0';

  if (!event_idx || !package_code) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Event_idx', sql.Int, Number(event_idx))
      .input('Package_Code', sql.VarChar(50), package_code)
      .input('Ticket_Idx', sql.Int, Number(ticket_idx))
      .execute('dbo.Get_Ticket_Plan');

    const records = result.recordset || [];

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error('🎫 티켓 플랜 조회 실패:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
