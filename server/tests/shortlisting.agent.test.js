import { describe, expect, test } from "@jest/globals";
import { runShortlistingAgent } from "../src/agents/shortlisting.agent.js";

describe("shortlisting agent", () => {
  test("shortlists from the spec threshold", async () => {
    const result = await runShortlistingAgent({ matchResult: { match_score: 82 } });
    expect(result.data.status).toBe("shortlisted");
  });

  test("holds mid-range candidates from the spec threshold", async () => {
    const result = await runShortlistingAgent({ matchResult: { match_score: 67 } });
    expect(result.data.status).toBe("hold");
  });

  test("rejects below the hold threshold", async () => {
    const result = await runShortlistingAgent({ matchResult: { match_score: 42 } });
    expect(result.data.status).toBe("rejected");
  });
});
