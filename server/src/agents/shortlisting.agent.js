import { loadSpec } from "../utils/spec-loader.js";

export async function runShortlistingAgent({ matchResult }) {
  const spec = await loadSpec("specs/evaluation/shortlisting.json");
  const decision = spec.decisions.find((item) => matchResult.match_score >= item.minimum_score);

  return {
    success: true,
    data: {
      status: decision.status,
      recommendation: decision.recommendation,
      match_score: matchResult.match_score
    }
  };
}
