// src/app/api/notice/personal/detail/route.ts

import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const lang = searchParams.get('lang') || 'EN';
  const type = searchParams.get('type') || 'NOTICE';
  const member = Number(searchParams.get('member') || '1');
  const idx = Number(searchParams.get('idx'));
  const ip = searchParams.get('ip') || '0.0.0.0';

  if (!idx) {
    return NextResponse.json({ error: 'Missing idx' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool.request()
      .input('LangId', sql.VarChar(2), lang)
      .input('Type', sql.VarChar(10), type)
      .input('Member_Idx', sql.Int, member)
      .input('idx', sql.Int, idx)
      .input('U_IP', sql.VarChar(50), ip)
      .execute('Set_Personal_Notice_Detail');

    const row = result.recordset?.[0];

    if (!row) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    return NextResponse.json({
      TITLE: row.TITLE,
      CONTENTS: row.CONTENTS,
      INS_DATE: row.PUB_DATE,
      FILENAME2: row.FILENAME2 !== 'NULL' ? row.FILENAME2 : undefined,
    });
    
  } catch (err) {
    console.error('[Personal Notice Detail API Error]', err);
    return NextResponse.json({ error: 'Failed to fetch detail' }, { status: 500 });
  }
}
