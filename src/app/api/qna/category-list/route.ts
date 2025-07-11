// src/app/api/qna/category-list/route.ts

import { NextResponse } from 'next/server';
import sql from 'mssql';
import { getDBConnection } from '../../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isGeneral = searchParams.get('isGeneral') || 'Y'; // 기본 일반문의
    const LangId = searchParams.get('LangId') || 'EN'; // 기본 영어

    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('LangId', sql.Char(2), LangId)
      .input('isGeneral', sql.Char(1), isGeneral)
      .query(`
        EXEC dbo.Get_QnA_Category @LangId=@LangId, @isGeneral=@isGeneral
      `);

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('카테고리 리스트 가져오기 실패:', err);
    return NextResponse.json({ error: 'Failed to fetch category list' }, { status: 500 });
  }
}
