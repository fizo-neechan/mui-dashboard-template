export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodIssueCode } from 'zod';

import { verifyUser } from '@/services/auth';
import AuthError from '@/types/auth-error';

export async function GET(request: NextRequest) {
  try {
    const identifier = request.nextUrl.searchParams.get('identifier');
    const token = request.nextUrl.searchParams.get('token');

    if (!token || token === 'null')
      throw new ZodError([
        {
          path: ['token'],
          message: 'Token is either missing or invalid.',
          code: ZodIssueCode.custom,
        },
      ]);

    if (!identifier || identifier === 'null')
      throw new ZodError([
        {
          path: ['identifier'],
          message: 'Identifier is either missing or invalid.',
          code: ZodIssueCode.custom,
        },
      ]);

    await verifyUser(identifier, token);

    return NextResponse.redirect(new URL('/', request.url));
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
