import { UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import { validateUserAccess } from '@/lib/auth/validate-role';
import { validateRequest } from '@/lib/middleware/validation';
import { updateUserSchema, type UpdateUserInput } from '@/lib/validations/user';
import prisma from '@/utils/prisma';

// Update user
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return validateRequest(updateUserSchema, async (data: UpdateUserInput) => {
    try {
      const currentUser = await validateUserAccess(req, UserRole.MODERATOR);

      const targetUser = await prisma.user.findUnique({
        where: { id: params.id },
      });

      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Only ADMIN can modify ADMIN users
      if (targetUser.role === UserRole.ADMIN && currentUser.role !== UserRole.ADMIN) {
        return NextResponse.json({ error: 'Cannot modify admin user' }, { status: 403 });
      }

      const updateData = { ...data };

      if (data.password) {
        updateData.password = await hash(data.password, 12);
      }

      // Only allow role updates from ADMIN
      if (data.role && currentUser.role !== UserRole.ADMIN) {
        delete updateData.role;
      }

      const user = await prisma.user.update({
        where: { id: params.id },
        data: updateData,
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
      });

      return NextResponse.json(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }

      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: error instanceof Error ? 400 : 500 }
      );
    }
  })(req);
}
