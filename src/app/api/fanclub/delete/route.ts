// /api/fanclub/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeProcedure } from '../../../../../lib/db';


export async function POST(req: NextRequest) {
  const body = await req.json();
  const { member_idx, fanclub_seq } = body;

  if (!member_idx || !fanclub_seq) {
    return NextResponse.json({ success: false, message: 'member_idx와 fanclub_seq는 필수입니다.' }, { status: 400 });
  }

  try {
    const result = await executeProcedure('Set_Member_Fanclub', {
      LangId: 'EN',
      method: 'DELETE',
      member_idx,
      Fanclub_Seq: fanclub_seq,
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error('팬클럽 삭제 오류:', err);
    return NextResponse.json({ success: false, message: '서버 오류 발생' }, { status: 500 });
  }
}
