import { verifyAuthToken, getAuthCookie } from './auth';
import { prisma } from '@/db/prisma';

type AuthPayload = {
  userId: string;
};

export async function getCurrentUser() {
  try {
    const token = await getAuthCookie();
    if (!token) return null;


    // the payload will contain the userId and any other info we included when signing the token
    const payload = (await verifyAuthToken(token)) as AuthPayload;

    if (!payload?.userId) return null;

    // fetch the user from the database and get basic info like id, email, name
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  } catch (error) {
    console.log('Error getting the current user', error);
    return null;
  }
}