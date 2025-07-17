// ✅ useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// src/app/api/auth/apple/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import qs from 'querystring';
import { executeProcedure } from '../../../../../../lib/db';


function generateClientSecret() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: process.env.APPLE_TEAM_ID,
    iat: now,
    exp: now + 3600 * 24 * 180,
    aud: 'https://appleid.apple.com',
    sub: process.env.APPLE_CLIENT_ID,
  };

  console.log('payload', payload);

  return jwt.sign(payload, process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, '\n'), {
    algorithm: 'ES256',
    keyid: process.env.APPLE_KEY_ID,
  });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const code = form.get('code')?.toString();
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  // 1. Apple에서 토큰 받기
  const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.APPLE_REDIRECT_URI!,//process.env.APPLE_REDIRECT_URI!
      client_id: process.env.APPLE_CLIENT_ID!,
      client_secret: generateClientSecret(),
    }),
  });

  const tokenData = await tokenRes.json();
  const idToken = tokenData.id_token;
  if (!idToken) {
    console.error('❌ id_token 없음:', tokenData);
    return NextResponse.json({ error: 'No id_token in response' }, { status: 500 });
  }

  const decoded: any = jwt.decode(idToken);
  if (!decoded || !decoded.sub) {
    console.error('❌ id_token 디코딩 실패 또는 sub 없음:', idToken);
    return NextResponse.json({ error: 'Invalid id_token' }, { status: 500 });
  }

  // ✅ 여기 ↓↓↓ 로그 추가
    console.log('✅ Apple 로그인 성공 - 디코딩 결과 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');
    console.dir(decoded, { depth: null });
    console.log('✅ Apple sub (sns_uid):', decoded.sub);
    console.log('✅ Apple email:', decoded.email);

  const sns_provider = 'apple';
  const sns_uid = decoded.sub;
  const sns_email = decoded.email;
  const sns_oauth_json = JSON.stringify(decoded);
  const forwarded = req.headers.get('x-forwarded-for');
  const userIp = forwarded?.split(',')[0] ?? '0.0.0.0';

  try {
    // 2. 기존 유저인지 확인
    const existing = await executeProcedure('Get_Member_sns_oauth', {
      sns_provider,
      sns_uid,
    });

    if (existing.length > 0) {
      // 3. 기존 회원 → 로그인 처리
      const loginResult = await executeProcedure('Set_Member_Login_sns', {
        sns_provider,
        sns_uid,
        U_IP: userIp,
      });

      const memberInfo = loginResult[0] as MemberInfo;
      console.log('🧾 [Set_Member_Login_sns 결과]', loginResult);
      // console.log('🔎 로그인된 최종 member_idx:', memberInfo?.idx);

      // return new NextResponse(
      //   `<html><body>
      //     <script>
      //       const state = {
      //         state: {
      //           isLoggedIn: true,
      //           token: "dummy-token",
      //           member: ${JSON.stringify(JSON.stringify(memberInfo))},
      //           autoLogin: false
      //         },
      //         version: 0
      //       };
      //       localStorage.setItem("auth-storage", JSON.stringify(state));
      //       localStorage.setItem("sns_provider", "apple");
      //       location.href = "/sns-redirect";
      //     </script>
      //   </body></html>`,
      //   { headers: { 'Content-Type': 'text/html' } }
      // );      

      const redirectTo = `/apple-redirect`;
      return new NextResponse(
        `<html><body>
          <script>
            location.href = "${redirectTo}";
          </script>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );        
    } else {
      // 4. 신규 회원 → 가입 처리
      // await executeProcedure('Set_Member', {
      //   sns_provider,
      //   sns_oauth_json,
      // });

      const redirectTo = `/register-sns?email=${encodeURIComponent(sns_email)}&sub=${sns_uid}`;
      return new NextResponse(
        `<html><body>
          <script>
            localStorage.setItem("sns_oauth_json", ${JSON.stringify(JSON.stringify(decoded))});
            localStorage.setItem("sns_provider", "apple");
            localStorage.setItem("code", "${code}");
            location.href = "${redirectTo}";
          </script>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );      
    }
  } catch (err: any) {
    console.error('❌ Apple 로그인 실패:', err);
    return NextResponse.json({ error: err.message || 'Apple login error' }, { status: 500 });
  }
}
