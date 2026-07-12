import { describe, expect, test } from "@jest/globals";
import { runAtsScorerAgent } from "../src/agents/ats-scorer.agent.js";

describe("ATS Scorer Agent", () => {
  test("calculates correct ATS score for a strong candidate", async () => {
    const result = await runAtsScorerAgent({
      candidate: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "123-456-7890"
      },
      job: {
        required_skills: ["React", "JavaScript", "CSS"],
        preferred_skills: ["Next.js", "Tailwind CSS"],
        min_experience: 2,
        hiring_spec_id: "frontend-developer"
      },
      parsedResume: {
        skills: ["React", "JavaScript", "CSS", "Next.js"],
        experience: 3,
        education: "Bachelor of Technology",
        projects: ["Built an ATS system"]
      }
    });

    expect(result.success).toBe(true);
    // Completeness = 30 (has education, projects, contact details)
    // Skills = 30 (all required) + 5 (1 of 2 preferred) = 35
    // Experience = 30 (3 >= 2)
    // Total = 30 + 35 + 30 = 95
    expect(result.data.ats_score).toBe(95);
    expect(result.data.breakdown.completeness).toBe(30);
    expect(result.data.breakdown.skills).toBe(35);
    expect(result.data.breakdown.experience).toBe(30);
  });

  test("calculates correct score when missing profile fields or skills", async () => {
    const result = await runAtsScorerAgent({
      candidate: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "" // missing phone
      },
      job: {
        required_skills: ["React", "JavaScript"],
        preferred_skills: ["Next.js"],
        min_experience: 5,
        hiring_spec_id: "frontend-developer"
      },
      parsedResume: {
        skills: ["React"], // missing JavaScript and Next.js
        experience: 2.5, // 2.5 yrs vs 5 yrs required
        education: "Not specified", // missing education
        projects: [] // missing projects
      }
    });

    expect(result.success).toBe(true);
    // Completeness = 0 (no education, no projects, missing phone)
    // Skills = (1 of 3 required skills) * 30 = 10 (React is present, JavaScript & CSS are missing)
    // Experience = (2.5 / 5) * 30 = 15
    // Total = 0 + 10 + 15 = 25
    expect(result.data.ats_score).toBe(25);
  });
});
