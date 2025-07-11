// /api/fanclub/check-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeProcedure } from '../../../../../lib/db';


export async function POST(req: NextRequest) {
  const body = await req.json();
  const { LangId, method, member_idx, Weverse_Email, U_IP } = body;
  if (!LangId || !method || !member_idx || !Weverse_Email || !U_IP) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await executeProcedure('Set_Member_Fanclub_Check', {
      LangId,
      method,
      member_idx,
      Weverse_Email,
      U_IP,
    });

    if (Array.isArray(result) && result.length > 0) {
      return NextResponse.json(result[0]);
    } else {
      return NextResponse.json(result);
    }
  } catch (error) {
    return NextResponse.json({ error: 'DB Error', details: String(error) }, { status: 500 });
  }
}