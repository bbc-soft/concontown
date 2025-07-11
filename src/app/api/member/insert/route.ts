// /src/app/api/member/insert/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      member_id,
      member_pwd,
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
      COMPANY_CODE,
      favorite_artist,
      favorite_artist_etc,
      site_language,
      MailSelector,
      U_IP
    } = body;

    const pool = await getDBConnection();

    await pool.request()
      .input('method', sql.VarChar, 'INSERT')
      .input('member_id', sql.VarChar, member_id)
      .input('member_pwd', sql.VarChar, member_pwd)
      .input('Name_1st', sql.VarChar, Name_1st)
      .input('Name_2nd', sql.VarChar, Name_2nd)
      .input('Name_3rd', sql.VarChar, Name_3rd)
      .input('Birth_day', sql.VarChar, Birth_day)
      .input('Birth_month', sql.VarChar, Birth_month)
      .input('Birth_year', sql.VarChar, Birth_year)
      .input('Gender', sql.VarChar, Gender)
      .input('passport', sql.VarChar, passport)
      .input('Nationality', sql.VarChar, Nationality)
      .input('City', sql.VarChar, City)
      .input('National_Code', sql.VarChar, National_Code)
      .input('zipcode', sql.VarChar, zipcode)
      .input('address', sql.VarChar, address)
      .input('Phone', sql.VarChar, Phone)
      .input('MailYN', sql.VarChar, MailYN)
      .input('COMPANY_CODE', sql.VarChar, COMPANY_CODE)
      .input('favorite_artist', sql.VarChar, favorite_artist)
      .input('favorite_artist_etc', sql.VarChar, favorite_artist_etc)
      .input('site_language', sql.VarChar, site_language)
      .input('MailSelector', sql.VarChar, MailSelector)
      .input('U_IP', sql.VarChar, U_IP)
      .execute('Set_Member');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Insert Member API Error]', err);
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }
}
