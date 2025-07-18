import { prisma } from '../lib/prisma.js';

export async function getEmail(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    return user?.email || null;
  } catch (err) {
    console.error("Prisma error:", err);
    return null;
  }
}

export async function getUserInfo(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    return user || null;
  } catch (err) {
    console.error("Prisma error:", err);
    return null;
  }
}

export async function getAllUsersInfo() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true },
    });

    return users || [];
  } catch (err) {
    console.error("Prisma error:", err);
    return [];
  }
}
