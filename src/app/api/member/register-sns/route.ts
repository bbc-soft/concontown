// src/app/api/member/register-sns/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📥 [SNS Register Input Body as SQL Params]');
    for (const [key, value] of Object.entries(body)) {
      console.log(`@${key} = ${typeof value === 'string' ? `'${value}'` : value}`);
    }
    
    const {
      member_idx,
      method = 'INSERT',
      member_id,      
      Name_1st,
      Name_2nd = '',
      Name_3rd,
      Birth_day,
      Birth_month,
      Birth_year,
      Gender,
      passport = '',
      Nationality,
      City,
      National_Code,
      zipcode = '',
      address = '',
      Phone,
      MailYN = '',
      favorite_artist = '',
      favorite_artist_etc = '',
      site_language = 'EN',
      MailSelector = '',
      U_IP = '',
      sns_provider,
      sns_oauth_json,
      sns_sub,
      sns_email,
    } = body;

    const pool = await getDBConnection();

    const result = await pool.request()
      .input('method', sql.VarChar, method)
      .input('member_idx', sql.Int, member_idx)
      .input('member_id', sql.NVarChar, member_id)
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
      .input('MailYN', sql.Char, MailYN)
      .input('favorite_artist', sql.NVarChar, favorite_artist)
      .input('favorite_artist_etc', sql.VarChar, favorite_artist_etc)
      .input('site_language', sql.VarChar, site_language)
      .input('MailSelector', sql.VarChar, MailSelector)
      .input('U_IP', sql.VarChar, U_IP)
      .input('sns_provider', sql.NVarChar, sns_provider)
      .input('sns_oauth_json', sql.NVarChar, sns_oauth_json)
      .input('sns_sub', sql.NVarChar, sns_sub)
      .input('sns_email', sql.NVarChar, sns_email)
      .execute('Set_Member');

    const resultCode = result.recordset?.[0]?.Result || '9999';

    return NextResponse.json({
      success: true,
      resultCode,
    });
  } catch (err) {
    console.error('[Register SNS Member API Error]', err);
    return NextResponse.json({ error: 'SNS registration failed' }, { status: 500 });
  }
}
