// lib/validations/user.ts
import { UserRole } from '@prisma/client';
import { z } from 'zod';

// Base user schema
const userBaseSchema = {
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
};

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Query parameters schema
export const userQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'MODERATOR', 'USER']).optional(),
  sortBy: z.enum(['role', 'name', 'email', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  showDeleted: z.boolean().default(false),
  showBlocked: z.boolean().default(false),
}).transform(data => ({
  ...data,
  page: data.page ?? 1,
  limit: data.limit ?? 10,
}));

// Create user schema
export const createUserSchema = z.object({
  ...userBaseSchema,
  password: passwordSchema,
  role: z.nativeEnum(UserRole),
});

// Update user schema
export const updateUserSchema = z
  .object({
    ...userBaseSchema,
    password: passwordSchema,
    role: z.nativeEnum(UserRole),
  })
  .partial();

// Change role schema
export const changeRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

// Response schemas for type safety
export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.nativeEnum(UserRole),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  isBlocked: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  blockedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
});

export const paginatedResponseSchema = z.object({
  data: z.array(userResponseSchema),
  total: z.number(),
  currentPage: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQueryParams = z.infer<typeof userQuerySchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>;
