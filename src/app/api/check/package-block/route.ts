import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection, sql } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  const { Event_Idx, Package_Idx, Ticket_Idx, Pickup_Idx, Option_Idx } = await req.json();
  try {
    const db = await getDBConnection();

    // ✅ EXEC 쿼리 콘솔 출력
//     console.log(`🧾 [EXEC 쿼리 예시]
// EXEC [dbo].[Set_CheckPackageBlockBeforeReserve]
//   @Event_Idx = ${Event_Idx},
//   @Package_Idx = ${Package_Idx},
//   @Ticket_Idx = ${Ticket_Idx},
//   @Pickup_Idx = ${Pickup_Idx},
//   @Option_Idx = ${Option_Idx}
// `);

    const result = await db
      .request()
      .input('Event_Idx', sql.Int, Number(Event_Idx))
      .input('Package_Idx', sql.Int, Number(Package_Idx))
      .input('Ticket_Idx', sql.Int, Number(Ticket_Idx))
      .input('Pickup_Idx', sql.Int, Number(Pickup_Idx))
      .input('Option_Idx', sql.Int, Number(Option_Idx))
      .execute('Set_CheckPackageBlockBeforeReserve');

    return NextResponse.json(result.recordset[0]);
  } catch (err) {
    console.error('블럭 확인 실패:', err);
    return new NextResponse('서버 오류', { status: 500 });
  }
}
