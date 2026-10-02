import { PrismaClient } from './generated/client';

import { PrismaPg } from '@prisma/adapter-pg';

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof createPrismaClient>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? createPrismaClient();

export default prisma;
export * from './generated/client'; // re-export types (User, Prisma namespace, etc.)

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;