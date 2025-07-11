// src/app/api/tourfriends/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const idx = parseInt(params.id);
  const member_idx = req.nextUrl.searchParams.get('member_idx');

  if (!idx || !member_idx) {
    return NextResponse.json({ error: 'Missing idx or member_idx' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('Method', 'DELETE')
      .input('Member_Idx', sql.Int, parseInt(member_idx))
      .input('Idx', sql.Int, idx)
      .execute('Set_Tour_Friends');

    return NextResponse.json(result.recordset[0]);
  } catch (err) {
    console.error('Tour friend deletion failed:', err);
    return NextResponse.json({ error: 'Failed to delete tour friend' }, { status: 500 });
  }
}
