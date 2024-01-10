import { PrismaClient } from '@prisma/client';

let prisma;

if ((global as any).prisma) {
    prisma = (global as any).prisma;
} else {
    (global as any).prisma = new PrismaClient();
    prisma = (global as any).prisma;
}

export default prisma;