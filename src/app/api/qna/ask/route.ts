// src/app/api/qna/ask/route.ts

import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const {
      member_idx,
      member_id,
      event_idx,
      category,
      title,
      content,
      file_name,
      file_url,
    } = await req.json();

    if (!member_idx || !member_id) {
      return NextResponse.json({ error: 'Missing member info' }, { status: 400 });
    }

    const pool = await getDBConnection();
    const result = await pool.request()
      .input('method', sql.NVarChar(10), 'INSERT')
      .input('idx', sql.Int, 0)
      .input('member_idx', sql.Int, member_idx)
      .input('member_id', sql.NVarChar(100), member_id)
      .input('event_idx', sql.Int, event_idx && !isNaN(Number(event_idx)) ? Number(event_idx) : null)
      .input('title', sql.NVarChar(510), title)
      .input('contents', sql.NVarChar(sql.MAX), content)
      .input('file_name', sql.NVarChar(200), file_name || '')
      .input('file_url', sql.VarChar(200), file_url || '')
      .input('SUB_CATEGORY', sql.VarChar(10), category)
      .input('u_ip', sql.VarChar(20), '111.111.111.111')
      .execute('Set_QnA');

    return NextResponse.json({ result: result.recordset[0]?.result || '0001' });
  } catch (err) {
    console.error('QnA 작성 실패:', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
