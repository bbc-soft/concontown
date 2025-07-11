import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.APPLE_CLIENT_ID!;
  const redirectUri = process.env.APPLE_REDIRECT_URI!;
  const scope = 'name email';

  const url = `https://appleid.apple.com/auth/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${scope}&` +
    `response_mode=form_post`; 

  return NextResponse.redirect(url);
}
