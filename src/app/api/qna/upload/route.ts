// src/app/api/qna/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blobUrl = searchParams.get('url');

    if (!blobUrl) {
      return NextResponse.json({ error: 'Missing blob URL' }, { status: 400 });
    }

    const contentType = req.headers.get('content-type') || 'application/octet-stream';
    const uploadRes = await fetch(blobUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': contentType,
      },
      body: req.body, // 스트리밍 방식 전달
      duplex: 'half',
    } as RequestInit & { duplex: 'half' });

    const resultText = await uploadRes.text();

    // if (!uploadRes.ok) {
    //   return NextResponse.json(
    //     { error: `Azure upload failed`, detail: resultText },
    //     { status: uploadRes.status }
    //   );
    // }

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text(); // 👈 Azure가 주는 에러 XML
      console.error('Azure upload error:', uploadRes.status, errorText);
      return NextResponse.json({ error: 'Azure upload failed', detail: errorText }, { status: 500 });
    }    

    return NextResponse.json({ message: 'Upload successful' });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed', detail: err.message }, { status: 500 });
  }
}