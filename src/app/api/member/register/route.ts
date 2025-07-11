// /src/app/api/member/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      method,
      member_idx,
      member_id,
      member_pwd,
      member_pwd_new,
      Name_1st,
      Name_2nd,
      Name_3rd,
      Birth_day,
      Birth_month,
      Birth_year,
      Gender,
      passport,
      Nationality,
      City,
      National_Code,
      zipcode,
      address,
      Phone,
      MailYN,
      favorite_artist,
      favorite_artist_etc,
      site_language,
      MailSelector,
      U_IP
    } = body;

    const pool = await getDBConnection();

    const result = await pool.request()
      .input('method', sql.VarChar, method)
      .input('member_idx', sql.Int, member_idx)
      .input('member_id', sql.VarChar, member_id)
      .input('member_pwd', sql.VarChar, member_pwd)
      .input('member_pwd_new', sql.VarChar, member_pwd_new)
      .input('Name_1st', sql.NVarChar, Name_1st)
      .input('Name_2nd', sql.NVarChar, Name_2nd)
      .input('Name_3rd', sql.NVarChar, Name_3rd)
      .input('Birth_day', sql.VarChar, Birth_day)
      .input('Birth_month', sql.VarChar, Birth_month)
      .input('Birth_year', sql.VarChar, Birth_year)
      .input('Gender', sql.VarChar, Gender)
      .input('passport', sql.VarChar, passport)
      .input('Nationality', sql.NVarChar, Nationality)
      .input('City', sql.NVarChar, City)
      .input('National_Code', sql.VarChar, National_Code)
      .input('zipcode', sql.VarChar, zipcode)
      .input('address', sql.NVarChar, address)
      .input('Phone', sql.NVarChar, Phone)
      .input('MailYN', sql.VarChar, MailYN)
      .input('favorite_artist', sql.NVarChar, favorite_artist)
      .input('favorite_artist_etc', sql.VarChar, favorite_artist_etc)
      .input('site_language', sql.VarChar, site_language)
      .input('MailSelector', sql.VarChar, MailSelector)
      .input('U_IP', sql.VarChar, U_IP)
      .execute('Set_Member');

      const resultCode = result.recordset?.[0]?.Result || '9999';
      console.log('💬 Name_1st:', Name_1st, 'Name_3rd:', Name_3rd);

   
        return NextResponse.json({
            success: true,
            resultCode: resultCode || '0000', // fallback 처리
        });
  } catch (err) {
    console.error('[Register Member API Error]', err);
    return NextResponse.json({ error: 'Register failed' }, { status: 500 });
  }
}
