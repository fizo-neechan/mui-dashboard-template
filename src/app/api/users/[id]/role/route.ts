import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { validateUserAccess } from '@/lib/auth/validate-role';
import { validateRequest } from '@/lib/middleware/validation';
import { changeRoleSchema } from '@/lib/validations/user';
import prisma from '@/utils/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return validateRequest(changeRoleSchema, async (data) => {
    try {
      const currentUser = await validateUserAccess(req, UserRole.ADMIN);

      const targetUser = await prisma.user.findUnique({
        where: { id: params.id },
      });

      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Prevent admins from modifying other admins
      if (targetUser.role === UserRole.ADMIN && currentUser.id !== params.id) {
        return NextResponse.json(
          { error: 'Cannot modify admin role' },
          { status: 403 }
        );
      }

      const user = await prisma.user.update({
        where: { id: params.id },
        data: { role: data.role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
        },
      });

      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: error instanceof Error ? 400 : 500 }
      );
    }
  })(req);
}