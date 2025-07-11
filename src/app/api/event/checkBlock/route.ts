// /api/event/checkBlock.ts

import { NextResponse } from 'next/server';
import { executeProcedure } from '../../../../../lib/db';

export async function POST(req: Request) {
  const body = await req.json();

  const { Event_Idx, Package_Idx, Ticket_Idx, Pickup_Idx, Option_Idx } = body;

  try {
    const result = await executeProcedure('Set_CheckPackageBlockBeforeReserve', {
      Event_Idx,
      Package_Idx,
      Ticket_Idx,
      Pickup_Idx,
      Option_Idx,
    });

    return NextResponse.json(result[0]); // 첫 번째 결과만 사용
  } catch (error) {
    console.error('[checkBlock error]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
