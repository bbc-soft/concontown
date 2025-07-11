// app/api/member/check-id/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { executeProcedure } from '../../../../../lib/db';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const member_id = searchParams.get('member_id');

  if (!member_id) {
    return NextResponse.json({ message: 'member_id is required' }, { status: 400 });
  }

  try {
    const recordset = await executeProcedure('Get_Member_IDX', {
      member_id: member_id as string,
    });

    const data = recordset?.[0];

    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error('❌ ID 중복 확인 오류:', error);
    return NextResponse.json({ message: 'DB error' }, { status: 500 });
  }
}
