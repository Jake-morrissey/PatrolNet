import dns from "dns/promises";

import { prisma } from "../../db/client";
import { HttpError } from "../../utils/errors";

type VerificationMethod = "dns" | "file" | "token";

const verifyDns = async (domain: string, token: string) => {
  try {
    const records = await dns.resolveTxt(`_scan-verify.${domain}`);
    const flat = records.flat();
    return flat.includes(token);
  } catch {
    return false;
  }
};

const verifyHttp = async (domain: string, token: string) => {
  try {
    const res = await fetch(`https://${domain}/.well-known/scan-verify.txt`);
    if (!res.ok) return false;
    const text = await res.text();
    return text.trim() === token;
  } catch {
    return false;
  }
};

export const verificationService = {
  async requestOrVerify(userId: number, domain: string, method: VerificationMethod, token: string) {
    const existing = await prisma.domainVerification.findUnique({ where: { domain } });

    if (existing && existing.status === "blocked") {
      throw new HttpError(403, "Domain verification blocked");
    }

    let verified = false;

    if (method === "dns") {
      verified = await verifyDns(domain, token);
    } else if (method === "file") {
      verified = await verifyHttp(domain, token);
    } else {
      // token/manual mode
      verified = true;
    }

    if (!verified) {
      const status = "failed";
      await prisma.domainVerification.upsert({
        where: { domain },
        update: { status, failedAt: new Date(), token, method, userId },
        create: { domain, method, token, status, failedAt: new Date(), userId },
      });
      throw new HttpError(403, "Verification failed");
    }

    const verification = await prisma.domainVerification.upsert({
      where: { domain },
      update: {
        method,
        token,
        status: "verified",
        verifiedAt: new Date(),
        userId,
      },
      create: {
        domain,
        method,
        token,
        status: "verified",
        verifiedAt: new Date(),
        userId,
      },
    });

    return verification;
  },

  async ensureVerified(userId: number, domain: string) {
    const verification = await prisma.domainVerification.findUnique({ where: { domain } });
    if (!verification || verification.userId !== userId || verification.status !== "verified") {
      throw new HttpError(403, "Domain not verified");
    }
    return verification;
  },
};

