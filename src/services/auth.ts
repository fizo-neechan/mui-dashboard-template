import { hash } from 'bcrypt';

import { RegisterInput } from '@/schemas/auth';
import prisma from '@/utils/prisma';

import * as UserRepository from '../repositories/user';
import AuthError, { AuthErrorType } from '../types/auth-error';

export async function registerUser(userData: RegisterInput) {
  let user;

  if (await UserRepository.getUserByEmail(userData.email)) {
    user = await reRegisterUser(userData);
  } else {
    user = await UserRepository.registerUser({
      name: userData.name,
      email: userData.email,
      image: '',
      role: 'ADMIN',
      password: await getHashedPassword(userData.password),
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return user;
}

export async function reRegisterUser(userData: RegisterInput) {
  const user = await prisma.user.update({
    where: { email: userData.email },
    data: {
      name: userData.name,
      image: '',
      role: 'USER',
      password: await getHashedPassword(userData.password),
      emailVerified: false,
      updatedAt: new Date(),
    },
  });

  return user;
}

async function getHashedPassword(password: string) {
  return await hash(password, 10);
}

export async function verifyUser(identifier: string, token: string) {
  const verificationToken = await UserRepository.validateVerificationToken(identifier, token);

  if (!verificationToken) {
    throw new AuthError(AuthErrorType.TOKEN_INVALID, 401);
  }

  const updatedUser = await prisma.user.update({
    where: { id: identifier.split(';;;')[0] },
    data: {
      emailVerified: true,
    },
  });

  if (!updatedUser) {
    throw new AuthError(AuthErrorType.USER_NOT_FOUND, 404);
  }

  return updatedUser;
}

export async function resetPassword(email: string) {
  const user = await UserRepository.getUserByEmail(email);

  if (!user) {
    throw new AuthError(AuthErrorType.USER_NOT_FOUND, 404);
  }

  const resetToken = await UserRepository.createVerificationToken(`${user.id};;;PASSWORD_RESET_TOKEN`);

  await sendPasswordResetEmail(email, resetToken);
}

async function sendPasswordResetEmail(_email: string, _resetToken: string) {
  // TODO: send password reset emails
}
