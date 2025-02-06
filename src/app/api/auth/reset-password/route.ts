import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { resetPasswordSchema } from '@/schemas/auth';
import { resetPassword } from '@/services/auth';
import AuthError from '@/types/auth-error';

export async function POST(request: NextRequest) {

  try {
    const body = await request.json();
    const { email } = resetPasswordSchema.parse(body);

    await resetPassword(email);

    return NextResponse.json({ message: 'Password reset email sent successfully' }, { status: 200 });
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
