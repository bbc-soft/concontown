// /src/app/api/tourfriends/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      member_idx,
      member_id,
      Name_1st,
      Name_3rd,
      Birth_day,
      Birth_month,
      Birth_year,
      Gender,
      National_Code,
      Nationality,
      City,
      Phone,
      U_IP
    } = body;

    const pool = await getDBConnection();

    const result = await pool.request()
      .input('Method', sql.VarChar(10), 'INSERT')
      .input('Member_Idx', sql.Int, member_idx)
      .input('member_id', sql.VarChar(100), member_id)
      .input('Name_1st', sql.VarChar(100), Name_1st)
      .input('Name_3rd', sql.VarChar(100), Name_3rd)
      .input('Birth_day', sql.VarChar(2), Birth_day)
      .input('Birth_month', sql.VarChar(2), Birth_month)
      .input('Birth_year', sql.VarChar(4), Birth_year)
      .input('Gender', sql.VarChar(1), Gender)
      .input('National_Code', sql.VarChar(10), National_Code)
      .input('Nationality', sql.VarChar(10), Nationality)
      .input('City', sql.VarChar(100), City)
      .input('Phone', sql.VarChar(20), Phone)
      .input('U_IP', sql.VarChar(20), U_IP)
      .execute('Set_Tour_Friends');

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('Add Tour Friend API error:', err);
    return NextResponse.json({ error: 'Failed to add friend' }, { status: 500 });
  }
}
