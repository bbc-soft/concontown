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

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  member: MemberInfo | null;
  autoLogin: boolean;
  login: (token: string, member: MemberInfo, autoLogin: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      member: null,
      autoLogin: false,
      login: (token, member, autoLogin) =>
        set(() => ({
          isLoggedIn: true,
          token,
          member,
          autoLogin,
        })),
      logout: () =>
        set(() => ({
          isLoggedIn: false,
          token: null,
          member: null,
          autoLogin: false,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// ✅ pages/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import qs from 'querystring';
import jwt from 'jsonwebtoken';
import { executeProcedure } from '../../../../../../lib/db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: qs.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();
  const idToken = tokenData.id_token;
  const decoded: any = jwt.decode(idToken);

  const sns_provider = 'google';
  const sns_uid = decoded.sub;
  const sns_email = decoded.email;
  const sns_name = decoded.name;  
  const sns_given_name = decoded.given_name;   // 이름 (길동)
  const sns_family_name = decoded.family_name; // 성 (홍)
  const sns_oauth_json = JSON.stringify(decoded);
  const forwarded = req.headers.get('x-forwarded-for');
  const userIp = forwarded?.split(',')[0] ?? '0.0.0.0';

  console.log('🔐 [Google OAuth Decoded]', decoded);
  console.log('📦 [SNS Info]', {
    sns_provider,
    sns_uid,
    sns_email,
    sns_oauth_json,
  });

  try {
    const existing = await executeProcedure('Get_Member_sns_oauth', {
      sns_provider,
      sns_uid,
    });

    console.log('🐛 [DB 응답 existing]', existing);

    if (existing.length > 0) {
      const loginResult = await executeProcedure('Set_Member_Login_sns', {
        sns_provider,
        sns_uid,
        U_IP: userIp,
      });

      const memberInfo = loginResult[0] as MemberInfo;
      console.log('🧾 [Set_Member_Login_sns 결과]', loginResult);
      console.log('🔎 로그인된 최종 member_idx:', memberInfo?.idx);
      
      return new NextResponse(
        `<html><body>
          <script>
            const state = {
              state: {
                isLoggedIn: true,
                token: "dummy-token",
                member: ${JSON.stringify(JSON.stringify(memberInfo))},
                autoLogin: false
              },
              version: 0
            };
            localStorage.setItem("auth-storage", JSON.stringify(state));
            localStorage.setItem("sns_provider", "google");
            localStorage.setItem("sns_uid", "${sns_uid}");
            location.href = "/sns-redirect";
          </script>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    } else {
      const redirectTo = `/register-sns?email=${encodeURIComponent(sns_email)}&sub=${sns_uid}`;
      return new NextResponse(
        `<html><body>
          <script>
            localStorage.setItem("sns_oauth_json", ${JSON.stringify(JSON.stringify(decoded))});
            localStorage.setItem("sns_provider", "google");
            localStorage.setItem("code", "${code}");
            localStorage.setItem("sns_name", "${sns_name}");
            localStorage.setItem("sns_family_name", "${sns_family_name}");
            localStorage.setItem("sns_given_name", "${sns_given_name}");
            location.href = "${redirectTo}";
          </script>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
  } catch (err) {
    console.error('❌ Google 로그인 실패:', err);
    return NextResponse.json({ error: 'Google login error' }, { status: 500 });
  }
}
