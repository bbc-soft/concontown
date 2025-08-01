// src/app/api/qna/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// export async function POST(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const blobUrl = searchParams.get('url');

//     if (!blobUrl) {
//       return NextResponse.json({ error: 'Missing blob URL' }, { status: 400 });
//     }

//     const contentType = req.headers.get('content-type') || 'application/octet-stream';
//     const uploadRes = await fetch(blobUrl, {
//       method: 'PUT',
//       headers: {
//         'x-ms-blob-type': 'BlockBlob',
//         'Content-Type': contentType,
//       },
//       body: req.body, // 스트리밍 방식 전달
//       duplex: 'half',
//     } as RequestInit & { duplex: 'half' });

//     const resultText = await uploadRes.text();

//     // if (!uploadRes.ok) {
//     //   return NextResponse.json(
//     //     { error: `Azure upload failed`, detail: resultText },
//     //     { status: uploadRes.status }
//     //   );
//     // }

//     if (!uploadRes.ok) {
//       const errorText = await uploadRes.text(); // 👈 Azure가 주는 에러 XML
//       console.error('Azure upload error:', uploadRes.status, errorText);
//       return NextResponse.json({ error: 'Azure upload failed', detail: errorText }, { status: 500 });
//     }    

//     return NextResponse.json({ message: 'Upload successful' });
//   } catch (err: any) {
//     console.error('Upload error:', err);
//     return NextResponse.json({ error: 'Upload failed', detail: err.message }, { status: 500 });
//   }
// }
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const extension = file.name.split('.').pop() || 'bin';
    const now = new Date();
    const folder = now.toISOString().slice(0, 7).replace('-', '');
    const fileName = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 17) + '.' + extension;

    const blobAccount = 'concontown';
    const blobContainer = 'data';
    const blobName = `qna/${folder}/${fileName}`;
    const fileUrl = `https://${blobAccount}.blob.core.windows.net/${blobContainer}/${blobName}`;
    const sasToken = '?sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-06-23T22:16:36Z&st=2025-06-23T13:16:36Z&spr=https&sig=ldloFAIOFbKYFNoFUlz6yrdcS2Hu%2Fq8XK9IPe95stbw%3D'; // ← 생략

    const fullUrl = fileUrl + sasToken;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: buffer,
      duplex: 'half',
    } as RequestInit & { duplex: 'half' }); // 👈 TypeScript 우회

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Azure upload error:', uploadRes.status, errorText);
      return NextResponse.json({ error: 'Azure upload failed' }, { status: 500 });
    }

    return NextResponse.json({
      fileName,
      fileUrl,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}