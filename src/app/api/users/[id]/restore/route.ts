import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { validateUserAccess } from '@/lib/auth/validate-role';
import prisma from '@/utils/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await validateUserAccess(req, UserRole.ADMIN);

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isDeleted: true,
        deletedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}
