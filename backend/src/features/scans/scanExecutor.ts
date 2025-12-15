import { spawn } from "child_process";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";

export type NormalizedFinding = {
  id: string;
  domain: string;
  vulnerability_name: string;
  severity: "low" | "medium" | "high" | "critical";
  affected_url: string;
  description?: string;
  evidence?: unknown;
  remediation?: string;
  detected_at: string;
};

type ExecuteInput = {
  domain: string;
  planTier: number;
  jobId: number;
};

type ExecuteResult =
  | { success: true; findings: NormalizedFinding[] }
  | { success: false; error: string };

// Template selection by plan tier.
export const selectTemplates = (planTier: number) => {
  if (planTier >= 100) {
    return ["standard", "extended"];
  }
  if (planTier >= 50) {
    return ["standard"];
  }
  if (planTier >= 10) {
    return ["basic"];
  }
  throw new Error("Invalid plan tier");
};

const parseNucleiJsonLine = (line: string, domain: string): NormalizedFinding | null => {
  try {
    const data = JSON.parse(line);
    const severity = (data.info?.severity as NormalizedFinding["severity"]) ?? "low";
    const id = data["template-id"] ?? randomUUID();
    const url = data.url ?? `https://${domain}`;
    return {
      id,
      domain,
      vulnerability_name: data.info?.name ?? "Unknown",
      severity,
      affected_url: url,
      description: data.info?.description,
      evidence: data.extracted_results ?? data.matcher_status ?? data,
      remediation: data.info?.reference?.[0],
      detected_at: new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

// NOTE: Production command (documented, not executed in tests):
// docker run --rm --cpus="1" --memory="512m" \
//   -v $(pwd)/nuclei-templates:/root/.nuclei-templates \
//   projectdiscovery/nuclei:latest nuclei -u https://<domain> \
//   -severity medium,high,critical -json -o /results/output.json

const mockExecute = async (input: ExecuteInput): Promise<ExecuteResult> => {
  // Lightweight mocked findings for local/dev; replace with real docker execution in prod.
  return {
    success: true,
    findings: [
      {
        id: randomUUID(),
        domain: input.domain,
        vulnerability_name: "Mock Missing Security Header",
        severity: "low",
        affected_url: `https://${input.domain}`,
        description: "Mock finding for development",
        evidence: { header: "Content-Security-Policy" },
        remediation: "Add CSP header",
        detected_at: new Date().toISOString(),
      },
    ],
  };
};

export const executeScan = async (input: ExecuteInput): Promise<ExecuteResult> => {
  const templates = selectTemplates(input.planTier);

  // Toggle real scanner with USE_MOCK_SCANNER=false
  if (process.env.USE_MOCK_SCANNER !== "false") {
    return mockExecute(input);
  }

  const outputDir = path.join(process.cwd(), "tmp", "scan-results", String(input.jobId));
  await fs.mkdir(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, "output.json");

  const templateArgs = templates.flatMap((t) => ["-t", `/root/.nuclei-templates/${t}`]);

  const args = [
    "run",
    "--rm",
    "--cpus=1",
    "--memory=512m",
    "-v",
    `${path.join(process.cwd(), "nuclei-templates")}:/root/.nuclei-templates`,
    "-v",
    `${outputDir}:/results`,
    "projectdiscovery/nuclei:latest",
    "nuclei",
    "-u",
    `https://${input.domain}`,
    ...templateArgs,
    "-severity",
    "medium,high,critical",
    "-json",
    "-o",
    "/results/output.json",
  ];

  const findings: NormalizedFinding[] = [];

  const code = await new Promise<number>((resolve) => {
    const child = spawn("docker", args, { stdio: "inherit" });
    child.on("close", (exitCode) => resolve(exitCode ?? 1));
  });

  if (code !== 0) {
    return { success: false, error: `nuclei exit code ${code}` };
  }

  try {
    const raw = await fs.readFile(outputFile, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parsed = parseNucleiJsonLine(trimmed, input.domain);
      if (parsed) findings.push(parsed);
    }
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  return { success: true, findings };
};

