
import sql from 'mssql';
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { member_id, member_idx, member_pwd, member_pwd2, U_IP } = await req.json();

  if (!member_id || !member_idx || !member_pwd || !member_pwd2) {
    return NextResponse.json({ Result: '0001', ResultStr: '필수값 누락' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('member_id', sql.NVarChar, member_id)
      .input('member_idx', sql.Int, member_idx)
      .input('member_pwd', sql.NVarChar, member_pwd)
      .input('member_pwd2', sql.NVarChar, member_pwd2)
      .input('U_IP', sql.VarChar, U_IP || '')
      .execute('Set_Member_Deactivate');

    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error('[회원탈퇴 실패]', error);
    return NextResponse.json({ Result: '9999', ResultStr: '시스템 에러' }, { status: 500 });
  }
}
