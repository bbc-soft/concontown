// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection, executeProcedure } from '../../../../../lib/db';

export interface MemberInfo {
  idx: number;
  member_id: string;
  email: string;
  Name_1st: string;
  Name_3rd: string;
  Birth_year?: string;
  Birth_month?: string;
  Birth_day?: string;
  Gender?: string;
  Nationality?: string;
  City?: string;
  Phone?: string;
  National_Code?: string;
}

export async function POST(req: NextRequest) {
  const { member_id, member_pwd, sns_provider, sns_uid} = await req.json();

  const pool = await getDBConnection();

  const forwarded = req.headers.get('x-forwarded-for');
  const userIp = forwarded?.split(',')[0] ?? '0.0.0.0';

  try {
    if(sns_provider === 'google') {
      const loginResult = await executeProcedure('Set_Member_Login_sns', {
        sns_provider,
        sns_uid,
        U_IP: userIp,
      });

      const memberInfo = loginResult[0] as MemberInfo;
      if (!memberInfo) {
        return NextResponse.json({ error: '구글 로그인 실패' }, { status: 401 });
      }

      return NextResponse.json({
        token: memberInfo.idx, // 예시로 token 처리
        user: {
          idx: memberInfo.idx,
          member_id: memberInfo.member_id,
          email: memberInfo.member_id, // or separate field if available
          Name_1st: memberInfo.Name_1st,
          Name_3rd: memberInfo.Name_3rd,
          isAdmin: 'N',
          isDev: 'N',
        },
      });
    } else if (sns_provider === 'apple') {
      const loginResult = await executeProcedure('Set_Member_Login_sns', {
        sns_provider,
        sns_uid,
        U_IP: userIp,
      });

      const memberInfo = loginResult[0] as MemberInfo;
      if (!memberInfo) {
        return NextResponse.json({ error: '애플 로그인 실패' }, { status: 401 });
      }

      return NextResponse.json({
        token: memberInfo.idx, // 예시로 token 처리
        user: {
          idx: memberInfo.idx,
          member_id: memberInfo.member_id,
          email: memberInfo.member_id, // or separate field if available
          Name_1st: memberInfo.Name_1st,
          Name_3rd: memberInfo.Name_3rd,
          isAdmin: 'N',
          isDev: 'N',
        },
      });
    } else {
      const result = await pool
        .request()
        .input('member_id', sql.VarChar, member_id)
        .input('member_pwd', sql.VarChar, member_pwd)
        .input('U_IP', sql.VarChar, '111,111,111,111') // 실제 클라이언트 IP로 대체 가능
        .execute('Set_Member_Login');

      const record = result.recordset?.[0];

      if (!record || record.result !== '0000') {
        return NextResponse.json({ error: '로그인 실패' }, { status: 401 });
      }

      return NextResponse.json({
        token: record.idx, // 예시로 token 처리
        user: {
          idx: record.idx,
          member_id: record.member_id,
          email: record.member_id, // or separate field if available
          Name_1st: record.Name_1st,
          Name_3rd: record.Name_3rd,
          isAdmin: record.isAdmin,
          isDev: record.isDev,
        member_pwd: member_pwd,
        },
      });
    }
    
  } catch (err : any) {
    console.error('로그인 실패:', err);
    return NextResponse.json({ error: '서버 오류 ' + err.message }, { status: 500 });
  }
}
