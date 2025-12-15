import { describe, it, expect } from "vitest";

import { selectTemplates, executeScan } from "../../src/features/scans/scanExecutor";

describe("scanExecutor", () => {
  it("selects templates by plan tier", () => {
    expect(selectTemplates(10)).toEqual(["basic"]);
    expect(selectTemplates(50)).toEqual(["standard"]);
    expect(selectTemplates(100)).toEqual(["standard", "extended"]);
  });

  it("returns mock findings by default", async () => {
    const res = await executeScan({ domain: "example.com", planTier: 10, jobId: 1 });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.findings.length).toBeGreaterThan(0);
      expect(res.findings[0]).toHaveProperty("vulnerability_name");
    }
  });
});

