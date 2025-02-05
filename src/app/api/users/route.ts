import { Prisma, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import { validateUserAccess } from '@/lib/auth/validate-role';
import { validateRequest } from '@/lib/middleware/validation';
import { CreateUserInput, createUserSchema, UserQueryParams, userQuerySchema } from '@/lib/validations/user';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return validateRequest(userQuerySchema as any, async (params: UserQueryParams) => {
    try {
      // Using the updated validateUserAccess
      await validateUserAccess(req, UserRole.MODERATOR);
      
      const skip = (params.page - 1) * params.limit;

      const where = {
        ...(params.search && {
          OR: [
            { name: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
          ],
        }),
        ...(params.role && { role: params.role }),
        isDeleted: params.showDeleted ? undefined : false,
        isBlocked: params.showBlocked ? undefined : false,
      };

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            image: true,
            isBlocked: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take: params.limit,
          orderBy: { [params.sortBy]: params.sortOrder },
        }),
        prisma.user.count({ where }),
      ]);

      return NextResponse.json({
        data: users,
        total,
        currentPage: params.page,
        totalPages: Math.ceil(total / params.limit),
        hasNext: skip + params.limit < total,
        hasPrevious: params.page > 1,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Unauthorized') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error.message === 'Insufficient permissions') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  })(req);
}

export async function POST(req: NextRequest) {
  return validateRequest(createUserSchema, async (data: CreateUserInput) => {
    try {
      await validateUserAccess(req, UserRole.ADMIN);
      
      const hashedPassword = await hash(data.password, 12);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      return NextResponse.json(user);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Unauthorized') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error.message === 'Insufficient permissions') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        if (error.message.includes('Unique constraint')) {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  })(req);
}