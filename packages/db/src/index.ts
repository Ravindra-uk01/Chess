import { PrismaClient } from './generated/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
export * from './generated/client'; // re-export types (User, Prisma namespace, etc.)

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;