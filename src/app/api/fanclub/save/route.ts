// /api/fanclub/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeProcedure } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    LangId,
    method,
    member_idx,
    Fanclub_Seq,
    Fanclub_Code,
    Fanclub_ID,
    Remark1,
    Remark2,
    Remark3,
    Remark4,
    Weverse_Email
  } = body;

  if (!LangId || !method || !member_idx) {
    return NextResponse.json({ Result: '9999', ResultStr: 'Missing required fields' }, { status: 400 });
  }

  const params: Record<string, any> = {
    LangId,
    method,
    member_idx
  };

  if (method === 'INSERT') {
    if (!Fanclub_Code || !Fanclub_ID) {
      return NextResponse.json(
        { Result: '9999', ResultStr: 'Fanclub_Code and Fanclub_ID required for INSERT' },
        { status: 400 }
      );
    }
    params.Fanclub_Code = Fanclub_Code;
    params.Fanclub_ID = Fanclub_ID;
    if (Remark1) params.Remark1 = Remark1;
    if (Remark2) params.Remark2 = Remark2;
    if (Remark3) params.Remark3 = Remark3;
    if (Remark4) params.Remark4 = Remark4;
    if (Weverse_Email) params.Weverse_Email = Weverse_Email;
  }

  if (method === 'DELETE') {
    if (!Fanclub_Seq) {
      return NextResponse.json(
        { Result: '9999', ResultStr: 'Fanclub_Seq required for DELETE' },
        { status: 400 }
      );
    }
    params.Fanclub_Seq = Fanclub_Seq;
  }

  try {
    const procedureResult = await executeProcedure('Set_Member_Fanclub', params);

    // ✅ 결과가 배열이라면 첫 번째 요소를 반환
    if (Array.isArray(procedureResult) && procedureResult.length > 0) {
      return NextResponse.json(procedureResult[0]);
    }

    // ❌ 응답 형식이 예상과 다를 경우
    return NextResponse.json({ Result: '9999', ResultStr: 'Unexpected result format' }, { status: 500 });
  } catch (error) {
    console.error('팬클럽 저장 실패:', error);
    return NextResponse.json(
      { Result: '9999', ResultStr: 'DB Error', details: String(error) },
      { status: 500 }
    );
  }
}
