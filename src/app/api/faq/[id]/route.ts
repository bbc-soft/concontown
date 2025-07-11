//  FAQ 상세 API - /api/faq/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from '../../../../../lib/db';
import sql from 'mssql';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const langId = req.nextUrl.searchParams.get('LangId') || 'EN';
  const faqId = parseInt(params.id);

  try {
    const pool = await getDBConnection();
    const result = await pool
      .request()
      .input('LangId', sql.Char(2), langId)
      .execute('Get_FAQ_list');

    const allFaqs = result.recordset;
    const faq = allFaqs.find((item) => item.NO === faqId);

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json(faq);
  } catch (err) {
    console.error('FAQ 상세 조회 실패:', err);
    return NextResponse.json({ error: 'Failed to load FAQ detail' }, { status: 500 });
  }
}
