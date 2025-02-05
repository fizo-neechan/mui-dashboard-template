// lib/auth.ts
import { User, UserRole } from '@prisma/client';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';

import AuthError, { AuthErrorType } from '@/types/auth-error';
import prisma from '@/utils/prisma';

import authOptions from './auth-options';
import { roleHierarchy } from './validate-role.types';

export async function getCurrentUser(_req: NextRequest) {
  // Get the session using the headers from the request
  const session = await getServerSession(authOptions);

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

export async function validateUserAccess(req: NextRequest, requiredRole: UserRole = UserRole.USER): Promise<User> {
  const currentUser = await getCurrentUser(req);

  if (!currentUser) {
    throw new AuthError(AuthErrorType.UNAUTHORIZED, 401);
  }

  if (!hasRequiredRole(currentUser.role, requiredRole)) {
    throw new AuthError(AuthErrorType.UNAUTHORIZED, 401);
  }

  return currentUser;
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);

  return !!session;
}

// Helper function to get current session user
export async function getSessionUser() {
  const session = await getServerSession(authOptions);

  return session?.user;
}