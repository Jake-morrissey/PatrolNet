import { prisma } from "../../db/client";
import { HttpError } from "../../utils/errors";
import { verificationService } from "../verification/service";
import { enqueueScanJob } from "../../queue/inMemoryQueue";

const ACTIVE_STATUSES = ["queued", "running"];
const MAX_ACTIVE_PER_USER = 3;

export const scansService = {
  async startScan(userId: number, domain: string, planTier: number) {
    if (![10, 50, 100].includes(planTier)) {
      throw new HttpError(400, "Invalid plan tier");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.acceptedTosAt) {
      throw new HttpError(403, "TOS not accepted");
    }

    await verificationService.ensureVerified(userId, domain);

    const activeForDomain = await prisma.scanJob.findFirst({
      where: { domain, status: { in: ACTIVE_STATUSES } },
    });
    if (activeForDomain) {
      throw new HttpError(409, "Scan already running for this domain");
    }

    const activeCount = await prisma.scanJob.count({
      where: { userId, status: { in: ACTIVE_STATUSES } },
    });
    if (activeCount >= MAX_ACTIVE_PER_USER) {
      throw new HttpError(429, "Rate limit exceeded");
    }

    const job = await prisma.scanJob.create({
      data: {
        domain,
        planTier,
        status: "queued",
        userId,
      },
    });

    enqueueScanJob(job.id);

    return job;
  },
};

