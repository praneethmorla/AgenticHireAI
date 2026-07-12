import fs from "node:fs/promises";
import pdf from "pdf-parse";
import { loadSpec } from "../utils/spec-loader.js";

const skillCatalog = [
  "React",
  "JavaScript",
  "CSS",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "MongoDB",
  "TypeScript",
  "Python"
];

export async function runResumeParserAgent({ candidate }) {
  await loadSpec("specs/prompts/resume-parser.json");
  const buffer = await fs.readFile(candidate.resume_path);
  let text = "";

  try {
    const parsed = await pdf(buffer);
    text = parsed.text || "";
  } catch (error) {
    text = candidate.name;
  }

  const lower = text.toLowerCase();
  const skills = skillCatalog.filter((skill) => lower.includes(skill.toLowerCase()));
  const experienceMatch = lower.match(/(\d+)\+?\s*(years|yrs|year)/);

  return {
    success: true,
    data: {
      name: candidate.name,
      skills,
      experience: experienceMatch ? Number(experienceMatch[1]) : 0,
      education: lower.includes("b.tech") || lower.includes("bachelor") ? "Bachelor" : "Not specified",
      projects: lower.includes("project") ? ["Resume project experience detected"] : []
    }
  };
}
