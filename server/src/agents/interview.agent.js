import { loadHiringSpec } from "../utils/spec-loader.js";

export async function runInterviewAgent({ job, parsedResume }) {
  const resume = parsedResume || {};
  const hiringSpec = await loadHiringSpec(job.hiring_spec_id);
  const skills = resume.skills?.length ? resume.skills : hiringSpec.required_skills;

  return {
    success: true,
    data: {
      rounds: hiringSpec.interview_rounds,
      questions: skills.slice(0, 5).map((skill) => `Describe a production problem you solved with ${skill}.`),
      coding_task: `Build a small ${job.title} exercise aligned with ${hiringSpec.role}.`,
      rubric: ["Correctness", "Code clarity", "Testing approach", "Communication"]
    }
  };
}
