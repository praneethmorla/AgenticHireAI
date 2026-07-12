import { loadHiringSpec, loadSpec } from "../utils/spec-loader.js";
import { retrieveHiringContext } from "../services/rag.service.js";

export async function runMatchingAgent({ job, parsedResume }) {
  const resume = parsedResume || {};
  await loadSpec("specs/prompts/matching-agent.json");
  const matchingSpec = await loadSpec("specs/evaluation/matching.json");
  const hiringSpec = await loadHiringSpec(job.hiring_spec_id);
  const context = await retrieveHiringContext(job, resume);
  const requiredSkills = hiringSpec.required_skills || job.required_skills || [];
  const preferredSkills = hiringSpec.preferred_skills || job.preferred_skills || [];
  const candidateSkills = new Set((resume.skills || []).map((skill) => skill.toLowerCase()));
  const matchedRequired = requiredSkills.filter((skill) => candidateSkills.has(skill.toLowerCase()));
  const matchedPreferred = preferredSkills.filter((skill) => candidateSkills.has(skill.toLowerCase()));
  const requiredScore = requiredSkills.length
    ? (matchedRequired.length / requiredSkills.length) * matchingSpec.weights.required_skills
    : matchingSpec.weights.required_skills;
  const preferredScore = preferredSkills.length
    ? (matchedPreferred.length / preferredSkills.length) * matchingSpec.weights.preferred_skills
    : matchingSpec.weights.preferred_skills;
  const experienceScore = (resume.experience || 0) >= job.min_experience ? matchingSpec.weights.experience : 0;
  const matchScore = Math.round(requiredScore + preferredScore + experienceScore);

  return {
    success: true,
    data: {
      match_score: matchScore,
      missing_skills: requiredSkills.filter((skill) => !candidateSkills.has(skill.toLowerCase())),
      recommendation: matchScore >= hiringSpec.minimum_score ? "Shortlist" : "Review",
      rag_context: context
    }
  };
}
