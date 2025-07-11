// src/app/api/member/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  try {
    const { member_idx, member_pwd, member_new_pwd, U_IP } = await req.json();

    if (!member_idx || !member_pwd || !member_new_pwd) {
      return NextResponse.json({ resultCode: 0, message: 'Missing parameters' }, { status: 400 });
    }

    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('member_idx', sql.Int, member_idx)
      .input('member_pwd', sql.VarChar(100), member_pwd)
      .input('member_new_pwd', sql.VarChar(100), member_new_pwd)
      .input('U_IP', sql.VarChar(100), U_IP || '')
      .execute('Set_Password');

    const code = result.recordset[0]?.result ?? '0000';

    return NextResponse.json({
      resultCode: code,
      message: code === '0000' ? 'Success' : 'Failed',
    });
  } catch (err) {
    console.error('❌ Set_Password API error:', err);
    return NextResponse.json({ resultCode: 0, message: 'Server error' }, { status: 500 });
  }
}
