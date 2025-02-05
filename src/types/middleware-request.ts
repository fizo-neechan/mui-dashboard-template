/* eslint-disable no-extra-semi */
/* eslint-disable semi */
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest } from 'next/server';

export default interface MiddlewareRequest extends NextRequest {
  nextUrl: NextURL;
};
