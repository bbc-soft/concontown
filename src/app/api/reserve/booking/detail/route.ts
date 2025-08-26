import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../../lib/db';

export async function POST(req: Request) {
  const body = await req.json();

  // ✅ EXEC 문 형식으로 콘솔 출력 추가
//   console.log(`🧾 [EXEC 쿼리 예시]
// EXEC [dbo].[Set_Booking_Detail]
//   @method='INSERT',
//   @Res_day='${body.Res_Day}',
//   @Res_Seq='${body.Res_Seq}',
//   @Name_1st=N'${body.Name_1st}',
//   @Name_3rd=N'${body.Name_3rd}',
//   @Birth_day='${body.Birth_day}',
//   @Birth_month='${body.Birth_month}',
//   @Birth_year='${body.Birth_year}',
//   @Gender='${body.Gender}',
//   @Nationality=N'${body.Nationality}',
//   @City=N'${body.City}',
//   @Mail=N'${body.Mail}',
//   @member_idx='${body.member_idx}',
//   @National_Code=N'${body.National_Code}',
//   @Phone=N'${body.Phone}',
//   @Emergency_National_Code=N'${body.Emergency_National_Code}',
//   @Emergency_Phone=N'${body.Emergency_Phone}',
//   @Depart=N'${body.Depart}',
//   @Etc=N'${body.Etc || ''}',
//   @Flight_info1=N'${body.Flight_info1 || ''}',
//   @Flight_info2=N'${body.Flight_info2 || ''}'
// `);

  try {
    const pool = await getDBConnection();
    const request = pool.request();

    const result = await request
      .input('method', sql.VarChar, 'INSERT')
      .input('Res_day', sql.VarChar, String(body.Res_Day))
      .input('Res_Seq', sql.VarChar, String(body.Res_Seq))
      .input('Name_1st', sql.NVarChar, body.Name_1st)
      .input('Name_3rd', sql.NVarChar, body.Name_3rd)
      .input('Birth_day', sql.NVarChar, body.Birth_day)
      .input('Birth_month', sql.NVarChar, body.Birth_month)
      .input('Birth_year', sql.NVarChar, body.Birth_year)
      .input('Gender', sql.NVarChar, body.Gender)
      .input('Nationality', sql.NVarChar, body.Nationality)
      .input('City', sql.NVarChar, body.City)
      .input('Mail', sql.NVarChar, body.Mail)
      .input('member_idx', sql.Int, body.member_idx)
      .input('National_Code', sql.NVarChar, body.National_Code)
      .input('Phone', sql.NVarChar, body.Phone)
      .input('Etc', sql.NVarChar, body.Etc || '')
      .input('Flight_info1', sql.NVarChar, body.Flight_info1 || '')
      .input('Flight_info2', sql.NVarChar, body.Flight_info2 || '')
      .execute('dbo.Set_Booking_Detail'); 

    return NextResponse.json({ success: true, result: result.recordset });
  } catch (err) {
    console.error('Set_Booking_Detail 오류:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
