// app/api/save-user/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { saveUserToDB } from '@/lib/auth/saveUserToDB';

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.id || !body.email) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  try {
    await saveUserToDB({
      id: body.id,
      email: body.email,
      name: body.name,
    });

    return NextResponse.json({ success: true });
  } catch (error:any) {
    return NextResponse.json({ error: 'Failed to save user', message: error.message }, { status: 500 });
  }
}
