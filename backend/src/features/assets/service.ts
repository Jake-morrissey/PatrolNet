import { prisma } from "../../db/client";

type CreateAssetInput = {
  name: string;
  description?: string;
  type?: string;
  status?: string;
  uri?: string;
  metadata?: Record<string, unknown>;
};

export const assetsService = {
  async listByUser(userId: number) {
    return prisma.asset.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(userId: number, data: CreateAssetInput) {
    return prisma.asset.create({
      data: { ...data, userId },
    });
  },
};

