import { UserRole } from '@prisma/client';

export const roleHierarchy: Record<UserRole, number> = {
  ADMIN: 3,
  MODERATOR: 2,
  USER: 1,
};