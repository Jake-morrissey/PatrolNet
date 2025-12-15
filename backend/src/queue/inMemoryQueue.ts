import { prisma } from "../db/client";
import { executeScan } from "../features/scans/scanExecutor";

type ScanJobPayload = {
  jobId: number;
  retries: number;
};

const queue: ScanJobPayload[] = [];
let processing = false;
const MAX_RETRIES = 1;

const processNext = async (): Promise<void> => {
  if (processing) return;
  const next = queue.shift();
  if (!next) return;
  processing = true;

  try {
    await prisma.scanJob.update({
      where: { id: next.jobId },
      data: { status: "running", startedAt: new Date() },
    });

    const job = await prisma.scanJob.findUnique({ where: { id: next.jobId } });
    if (!job) throw new Error("Job not found");

    const result = await executeScan({
      domain: job.domain,
      planTier: job.planTier,
      jobId: job.id,
    });

    if (!result.success) {
      if (next.retries < MAX_RETRIES) {
        queue.unshift({ jobId: next.jobId, retries: next.retries + 1 });
      } else {
        await prisma.scanJob.update({
          where: { id: next.jobId },
          data: {
            status: "failed",
            completedAt: new Date(),
            failureReason: result.error,
          },
        });
      }
    } else {
      await prisma.scanJob.update({
        where: { id: next.jobId },
        data: {
          status: "completed",
          completedAt: new Date(),
          findings: result.findings,
        },
      });
    }
  } catch (err) {
    await prisma.scanJob.update({
      where: { id: next.jobId },
      data: {
        status: "failed",
        completedAt: new Date(),
        failureReason: (err as Error).message,
      },
    });
  } finally {
    processing = false;
    if (queue.length > 0) void processNext();
  }
};

export const enqueueScanJob = (jobId: number) => {
  queue.push({ jobId, retries: 0 });
  void processNext();
};

