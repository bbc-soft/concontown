import { NextResponse } from 'next/server';
import { executeProcedure } from '../../../../lib/db';

interface NationalityRow {
  Nation: string;
  National_Code: string;
}

export async function GET() {
  try {
    const recordset = await executeProcedure('Get_Nationality', {}) as NationalityRow[];

    const data = recordset.map((row) => ({
      Nation: row.Nation,
      National_Code: row.National_Code,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Get_Nationality Error:', error);
    return NextResponse.json({ error: 'Failed to fetch nationality list' }, { status: 500 });
  }
}
