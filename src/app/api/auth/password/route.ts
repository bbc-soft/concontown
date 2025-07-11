// app/api/auth/password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { member_id, name_1st, name_3rd } = await req.json();

  const pool = await getDBConnection();

  try {
    const result = await pool
      .request()
      .input('Member_Id', sql.VarChar, member_id)
      .input('Name_1st', sql.VarChar, name_1st)
      .input('Name_3rd', sql.VarChar, name_3rd)
      .execute('Set_ResetPassword');

    return NextResponse.json({
      resultCode: result.recordset[0]?.Result,
      message: result.recordset[0]?.ResultStr,
    });
  } catch (err) {
    console.error('인증 실패:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
