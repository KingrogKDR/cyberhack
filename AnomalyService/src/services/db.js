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
