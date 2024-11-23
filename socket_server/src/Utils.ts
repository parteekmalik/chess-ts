import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function getLastElement<T>(arr: T[]): T {
  return arr[arr.length - 1];
}


