import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    method,
    member_id,
    member_pwd,
    member_idx,
    Name_1st,
    Name_3rd,
    Gender,
    Birth_day,
    Birth_month,
    Birth_year,
    Nationality,
    City,
    Phone,
    National_Code,
    MailYN = '', // ✅ 광고성 수신 동의 추가
  } = body;

  if (!member_idx) {
    return NextResponse.json({ result: '9999', error: 'Missing member_idx' }, { status: 400 });
  }

  try {
    const pool = await getDBConnection();

    console.log('[Executing Set_Member with parameters]');
    console.log(`
      EXEC Set_Member 
        @method = '${method || 'UPDATE'}',
        @member_idx = ${member_idx},
        @Name_1st = N'${Name_1st}',
        @Name_2nd = N'',
        @Name_3rd = N'${Name_3rd}',
        @Gender = '${Gender}',
        @Birth_day = '${Birth_day}',
        @Birth_month = '${Birth_month}',
        @Birth_year = '${Birth_year}',
        @Nationality = N'${Nationality}',
        @City = N'${City}',
        @Phone = '${Phone}',
        @member_id = '${member_id}',
        @member_pwd = '${member_pwd}',
        @passport = '',
        @National_Code = '${National_Code}',
        @zipcode = '',
        @address = '',
        @MailYN = '${MailYN}',
        @favorite_artist = '',
        @favorite_artist_etc = '',
        @site_language = 'EN',
        @MailSelector = '',
        @U_IP = ''
    `);

    const result = await pool
      .request()
      .input('method', 'UPDATE')
      .input('member_idx', sql.Int, member_idx)
      .input('Name_1st', sql.NVarChar, Name_1st)
      .input('Name_2nd', sql.NVarChar, '')
      .input('Name_3rd', sql.NVarChar, Name_3rd)
      .input('Gender', sql.NVarChar, Gender)
      .input('Birth_day', sql.NVarChar, Birth_day)
      .input('Birth_month', sql.NVarChar, Birth_month)
      .input('Birth_year', sql.NVarChar, Birth_year)
      .input('Nationality', sql.NVarChar, Nationality)
      .input('City', sql.NVarChar, City)
      .input('Phone', sql.NVarChar, Phone)
      .input('member_id', sql.NVarChar, member_id || '')
      .input('member_pwd', sql.NVarChar, member_pwd)
      .input('member_pwd_new', sql.NVarChar, member_pwd)
      .input('passport', sql.NVarChar, '')
      .input('National_Code', sql.NVarChar, National_Code || '')
      .input('zipcode', sql.NVarChar, '')
      .input('address', sql.NVarChar, '')
      .input('MailYN', sql.Char, MailYN) // ✅ 실제 반영
      .input('favorite_artist', sql.NVarChar, '')
      .input('favorite_artist_etc', sql.NVarChar, '')
      .input('site_language', sql.Char, 'EN')
      .input('MailSelector', sql.Char, '')
      .input('U_IP', sql.NVarChar, '')
      .execute('Set_Member');

    const output = result.recordset?.[0];
    console.log('[Set_Member 결과]', output);

    return NextResponse.json({
      result: output?.Result || '9999',
      message: output?.ResultStr || '',
    });

  } catch (error) {
    console.error('[Member Update API Error]', error);
    return NextResponse.json({ result: '9999', error: 'Database update failed' }, { status: 500 });
  }
}
