import {NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

import MiddlewareRequest from '@/types/middleware-request';

export default async function middleware(req: MiddlewareRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin'
  ]
};