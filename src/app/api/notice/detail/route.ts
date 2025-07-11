import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const LangId = params.get('lang') || 'EN';
  const Member_Idx = parseInt(params.get('member') || '1');
  const idx = parseInt(params.get('idx') || '1');
  const U_IP = params.get('ip') || '0.0.0.0';
  const Type = params.get('type') || 'NOTICE';

  try {
    const pool = await getDBConnection();
    const result = await pool.request()
      .input('LangId', sql.Char(2), LangId)
      .input('Type', sql.VarChar(10), Type)
      .input('Member_Idx', sql.Int, Member_Idx)
      .input('idx', sql.Int, idx)
      .input('U_IP', sql.VarChar(50), U_IP)
      .execute('Set_General_Notice_Detail');

    return NextResponse.json(result.recordset?.[0]);
  } catch (err) {
    console.error('[Notice Detail API Error]', err);
    return NextResponse.json({ error: 'Failed to fetch notice detail' }, { status: 500 });
  }
}
