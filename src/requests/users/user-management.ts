import { UserRole } from '@prisma/client';

import { CreateUserInput, PaginatedResponse, UpdateUserInput, UserQueryParams, UserResponse } from '@/lib/validations/user';

export const getUsers = async (params: UserQueryParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.append(key, String(value));
  });

  const response = await fetch(`/api/users?${searchParams}`);

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to fetch users');
  }

  return response.json();
};

export const getUser = async (id: string): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to fetch user');
  }

  return response.json();
};

export const createUser = async (data: CreateUserInput): Promise<UserResponse> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to create user');
  }

  return response.json();
};

export const updateUser = async ({ id, data }: { id: string; data: UpdateUserInput }): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to update user');
  }

  return response.json();
};

export const blockUser = async (id: string): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${id}/block`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to block user');
  }

  return response.json();
};

export const unblockUser = async (id: string): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${id}/unblock`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to unblock user');
  }

  return response.json();
};

export const changeRole = async ({ id, role }: { id: string; role: UserRole }): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${id}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to change role');
  }

  return response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to delete user');
  }
};

export const restoreUser = async (id: string): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${id}/restore`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error || 'Failed to restore user');
  }

  return response.json();
};
