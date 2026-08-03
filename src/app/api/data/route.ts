import { NextResponse } from 'next/server';
import { fetchStoreData, saveStoreData } from '@/lib/github-store';
import { StoreData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data } = await fetchStoreData();
    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/data failed', err);
    return NextResponse.json(
      { error: 'Failed to load data from GitHub.' },
      { status: 502 }
    );
  }
}

export async function PUT(request: Request) {
  let body: StoreData;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof body.settings?.dailyRate !== 'number' ||
    typeof body.settings?.netRatio !== 'number' ||
    typeof body.days !== 'object'
  ) {
    return NextResponse.json({ error: 'Invalid data shape.' }, { status: 400 });
  }

  try {
    await saveStoreData(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/data failed', err);
    return NextResponse.json(
      { error: 'Failed to save data to GitHub.' },
      { status: 502 }
    );
  }
}
