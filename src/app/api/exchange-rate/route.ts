// /src/app/api/exchange-rate/route.ts

import { NextResponse } from 'next/server';
import { executeProcedure } from '../../../../lib/db';

interface ExchangeRate {
    Buying: number;
    [key: string]: any;
  }
  
  export async function GET() {
    try {
      const recordset = await executeProcedure('Get_Exchange_Rate', {}) as ExchangeRate[];
  
      if (!recordset || recordset.length === 0) {
        return NextResponse.json({ success: false, message: '환율 정보 없음' }, { status: 404 });
      }
  
      const latest = recordset[0];
      const exchangeRate = Math.ceil(latest.Buying);
  
      return NextResponse.json({
        success: true,
        rate: exchangeRate,
        raw: latest
      });
    } catch (err) {
      console.error('환율 조회 에러:', err);
      return NextResponse.json({ success: false, message: '서버 오류 발생' }, { status: 500 });
    }
  }
  
