// /api/fanclub/joined/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeProcedure } from '../../../../../lib/db';


export async function GET(req: NextRequest) {
  const member_idx = req.nextUrl.searchParams.get('member_idx');
  if (!member_idx) return NextResponse.json({ error: 'member_idx required' }, { status: 400 });

  try {
    const result = await executeProcedure('Get_Member_Fanclub', { member_idx });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'DB Error', details: String(error) }, { status: 500 });
  }
}