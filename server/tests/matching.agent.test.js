import { describe, expect, test } from "@jest/globals";
import { runMatchingAgent } from "../src/agents/matching.agent.js";

describe("matching agent", () => {
  test("returns deterministic JSON-serializable matching output", async () => {
    const result = await runMatchingAgent({
      job: {
        required_skills: ["React", "JavaScript", "CSS"],
        preferred_skills: ["Next.js", "Tailwind CSS"],
        min_experience: 2,
        hiring_spec_id: "frontend-developer"
      },
      parsedResume: {
        skills: ["React", "JavaScript", "CSS", "Next.js"],
        experience: 3
      }
    });

    expect(result.success).toBe(true);
    expect(result.data.match_score).toBe(90);
    expect(result.data.missing_skills).toEqual([]);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });
});
