// /api/fanclub/weverse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeProcedure } from '../../../../../lib/db';


export async function GET(req: NextRequest) {
  const member_idx = req.nextUrl.searchParams.get('member_idx');
  if (!member_idx) {
    return NextResponse.json({ error: 'member_idx is required' }, { status: 400 });
  }

  try {
    const result = await executeProcedure('Get_Member_Weverse', { member_idx });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get_Fanclub error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
