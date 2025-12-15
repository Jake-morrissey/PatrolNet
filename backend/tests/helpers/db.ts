import { prisma } from "../../src/db/client";

export const resetDb = async () => {
  await prisma.asset.deleteMany();
  await prisma.scanJob.deleteMany();
  await prisma.domainVerification.deleteMany();
  await prisma.user.deleteMany();
};

export const disconnectDb = async () => {
  await prisma.$disconnect();
};

