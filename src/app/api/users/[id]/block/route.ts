import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { validateUserAccess } from '@/lib/auth/validate-role';
import prisma from '@/utils/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await validateUserAccess(req, UserRole.MODERATOR);

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent blocking admins
    if (targetUser.role === UserRole.ADMIN && currentUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Cannot block admin user' }, { status: 403 });
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        isBlocked: true,
        blockedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        blockedAt: true,
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
