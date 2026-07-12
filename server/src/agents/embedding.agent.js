import { storeResumeEmbedding } from "../services/rag.service.js";

export async function runEmbeddingAgent({ candidate, parsedResume }) {
  const result = await storeResumeEmbedding(candidate, parsedResume);
  return { success: true, data: result };
}
