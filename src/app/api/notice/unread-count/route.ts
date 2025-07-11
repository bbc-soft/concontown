import { NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') ?? 'NOTICE';
    const memberParam = searchParams.get('member');
    const isPopup = searchParams.get('popup') ?? '';

    if (!memberParam) {
      return NextResponse.json({ error: 'Missing member' }, { status: 400 });
    }

    const memberIdx = parseInt(memberParam, 10);

    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Type', sql.VarChar(10), type)
      .input('Member_Idx', sql.Int, memberIdx)
      .input('isPopup', sql.Char(1), isPopup)
      .query('EXEC dbo.Get_Notice_UnRead_Count @Type=@Type, @Member_Idx=@Member_Idx, @isPopup=@isPopup');

    return NextResponse.json(result.recordset[0]);
  } catch (err) {
    console.error('[ERROR] Get unread count failed:', err);
    return NextResponse.json({ error: 'Failed to fetch unread count' }, { status: 500 });
  }
}
