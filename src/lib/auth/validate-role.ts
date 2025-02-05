// lib/auth.ts
import { UserRole } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import prisma from '@/utils/prisma';

import authOptions from './auth-options';
import { roleHierarchy } from './validate-role.types';

async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
      isDeleted: false,
      isBlocked: false,
    },
  });

  return user;
}

function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export async function validateUserAccess(req: NextApiRequest, res: NextApiResponse, requiredRole: UserRole) {
  const currentUser = await getCurrentUser(req, res);

  if (!currentUser) {
    throw new Error('Unauthorized');
  }

  if (!hasRequiredRole(currentUser.role, requiredRole)) {
    throw new Error('Insufficient permissions');
  }

  return currentUser;
}
