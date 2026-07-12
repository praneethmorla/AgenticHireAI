import { loadHiringSpec, loadSpec } from "../utils/spec-loader.js";

export async function runAtsScorerAgent({ candidate, job, parsedResume }) {
  const resume = parsedResume || {};
  const atsSpec = await loadSpec("specs/evaluation/ats_scorer.json");
  const hiringSpec = await loadHiringSpec(job.hiring_spec_id);

  // 1. Profile Completeness Score (max 30)
  let completenessScore = 0;
  if (resume.education && resume.education !== "Not specified") {
    completenessScore += 10;
  }
  if (resume.projects && resume.projects.length > 0) {
    completenessScore += 10;
  }
  if (candidate.name && candidate.email && candidate.phone) {
    completenessScore += 10;
  }

  // 2. Skills Match Score (max 40)
  const requiredSkills = hiringSpec.required_skills || job.required_skills || [];
  const preferredSkills = hiringSpec.preferred_skills || job.preferred_skills || [];
  const candidateSkills = new Set((resume.skills || []).map((skill) => skill.toLowerCase()));

  const matchedRequired = requiredSkills.filter((skill) => candidateSkills.has(skill.toLowerCase()));
  const matchedPreferred = preferredSkills.filter((skill) => candidateSkills.has(skill.toLowerCase()));

  let skillsScore = 0;
  if (requiredSkills.length === 0 && preferredSkills.length === 0) {
    skillsScore = atsSpec.weights.skills_match;
  } else {
    // 30 points for required skills, 10 points for preferred skills
    const reqWeight = 30;
    const prefWeight = 10;

    const reqScore = requiredSkills.length
      ? (matchedRequired.length / requiredSkills.length) * reqWeight
      : reqWeight;
    const prefScore = preferredSkills.length
      ? (matchedPreferred.length / preferredSkills.length) * prefWeight
      : prefWeight;
    
    skillsScore = reqScore + prefScore;
  }

  // 3. Experience Match Score (max 30)
  let experienceScore = 0;
  const minExp = job.min_experience || 0;
  const candExp = resume.experience || 0;
  if (minExp === 0) {
    experienceScore = atsSpec.weights.experience_match;
  } else {
    if (candExp >= minExp) {
      experienceScore = atsSpec.weights.experience_match;
    } else {
      experienceScore = (candExp / minExp) * atsSpec.weights.experience_match;
    }
  }

  const atsScore = Math.round(completenessScore + skillsScore + experienceScore);

  return {
    success: true,
    data: {
      ats_score: Math.min(100, Math.max(0, atsScore)),
      breakdown: {
        completeness: Math.round(completenessScore),
        skills: Math.round(skillsScore),
        experience: Math.round(experienceScore)
      }
    }
  };
}
