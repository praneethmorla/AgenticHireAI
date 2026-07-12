import { describe, expect, test } from "@jest/globals";
import { createJobSchema } from "../src/validators/job.validator.js";

describe("job validators", () => {
  test("accepts valid job input", () => {
    const result = createJobSchema.safeParse({
      body: {
        title: "Frontend Developer",
        description: "Build recruiting user interfaces.",
        required_skills: ["React"],
        preferred_skills: [],
        min_experience: 2
      },
      params: {},
      query: {}
    });

    expect(result.success).toBe(true);
  });

  test("rejects jobs without required skills", () => {
    const result = createJobSchema.safeParse({
      body: {
        title: "Frontend Developer",
        description: "Build recruiting user interfaces.",
        required_skills: [],
        preferred_skills: [],
        min_experience: 2
      },
      params: {},
      query: {}
    });

    expect(result.success).toBe(false);
  });
});
