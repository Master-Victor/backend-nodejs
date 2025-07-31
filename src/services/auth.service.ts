import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../utils/token';
import jwt from 'jsonwebtoken';

export const registerUserService = async (email: string, password: string, name: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('USER_EXISTS');

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true, name: true, createdAt: true }
  });

  const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.name);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt
    }
  });

  return { user, accessToken, refreshToken };
};

export const loginUserService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error('INVALID_CREDENTIALS');

  const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.name);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt
    }
  });

  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  };

  return { user: userResponse, accessToken, refreshToken };
};

export const refreshTokenService = async (refreshToken: string) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true }
  });

  if (!tokenRecord) throw new Error('INVALID_REFRESH_TOKEN');
  if (tokenRecord.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    throw new Error('REFRESH_EXPIRED');
  }

  const refreshSecret = process.env.JWT_REFRESH_SECRET!;
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch {
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    throw new Error('INVALID_REFRESH_SIGNATURE');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    tokenRecord.user.id,
    tokenRecord.user.email,
    tokenRecord.user.name
  );

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: {
      token: newRefreshToken,
      expiresAt: newExpiresAt
    }
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutService = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};
