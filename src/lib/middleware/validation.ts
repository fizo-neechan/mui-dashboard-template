// lib/middleware/validate.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function validateRequest<T>(
  schema: z.Schema<T>,
  handler: (validatedData: T) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      let data;
      
      // Handle different HTTP methods
      if (req.method === 'GET') {
        const url = new URL(req.url);

        data = Object.fromEntries(url.searchParams);
      } else {
        data = await req.json();
      }

      const validatedData = await schema.parseAsync({
        ...data,
        page: data.page ? Number(data.page) : 1,
        limit: data.limit ? Number(data.limit) : 10,
      });

      return handler(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation failed', 
            details: error.errors.map(e => ({
              path: e.path.join('.'),
              message: e.message
            }))
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}