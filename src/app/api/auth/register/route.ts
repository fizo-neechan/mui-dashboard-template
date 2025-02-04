import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { registerSchema } from '@/schemas/auth';
import { registerUser } from '@/services/auth';
import AuthError from '@/types/auth-error';

export async function POST(request: NextRequest) {

  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const user = await registerUser(validatedData);

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ errors: error.message, name: error.name }, { status: error.statusCode });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
