import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is required. Set it in your .env or Vercel project settings."
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export default prisma;
