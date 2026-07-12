import crypto from "node:crypto";
import { QdrantClient } from "@qdrant/js-client-rest";
import { loadSpec } from "../utils/spec-loader.js";

function hashEmbedding(text, size = 384) {
  const values = [];
  let seed = text || "empty";

  while (values.length < size) {
    const hash = crypto.createHash("sha256").update(seed).digest();
    for (const byte of hash) {
      values.push(byte / 255);
      if (values.length === size) break;
    }
    seed = hash.toString("hex");
  }

  return values;
}

function chunkText(text, size) {
  const chunks = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }
  return chunks.length ? chunks : [text];
}

export async function embedText(text) {
  return hashEmbedding(text);
}

export async function storeResumeEmbedding(candidate, parsedResume) {
  const ragSpec = await loadSpec("specs/system/rag.json");
  const qdrantUrl = process.env.QDRANT_URL;
  const text = JSON.stringify(parsedResume || {});
  const chunks = chunkText(text, ragSpec.chunking.resume_chars);

  if (!qdrantUrl) {
    return { stored: false, chunks: chunks.length };
  }

  const client = new QdrantClient({ url: qdrantUrl });
  const collectionName = ragSpec.collections.resumes;

  try {
    try {
      await client.getCollection(collectionName);
    } catch (error) {
      await client.createCollection(collectionName, { vectors: { size: 384, distance: "Cosine" } });
    }

    await client.upsert(collectionName, {
      points: chunks.map((chunk, index) => ({
        id: parseInt(crypto.createHash("sha256").update(`${candidate.id}-${index}`).digest("hex").slice(0, 12), 16),
        vector: hashEmbedding(chunk),
        payload: { candidate_id: candidate.id, text: chunk }
      }))
    });

    return { stored: true, chunks: chunks.length };
  } catch (error) {
    return { stored: false, chunks: chunks.length, error: error.message };
  }
}

export async function retrieveHiringContext(job, parsedResume) {
  const ragSpec = await loadSpec("specs/system/rag.json");
  const resume = parsedResume || {};
  return {
    top_k: ragSpec.similarity.top_k,
    minimum_similarity: ragSpec.similarity.minimum_similarity,
    context: [
      `Job requires: ${(job.required_skills || []).join(", ")}`,
      `Candidate skills: ${(resume.skills || []).join(", ")}`
    ]
  };
}
