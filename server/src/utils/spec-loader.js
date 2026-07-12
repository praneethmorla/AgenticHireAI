import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AppError } from "./app-error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../../../");

const cache = new Map();

export async function loadSpec(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  const absolutePath = path.resolve(root, normalized);

  if (!absolutePath.startsWith(path.resolve(root, "specs"))) {
    throw new AppError("Specs must be loaded from /specs", 400);
  }

  if (cache.has(absolutePath)) {
    return cache.get(absolutePath);
  }

  const raw = await fs.readFile(absolutePath, "utf8");
  const parsed = JSON.parse(raw);
  cache.set(absolutePath, parsed);
  return parsed;
}

export async function loadHiringSpec(specId = "frontend-developer") {
  return loadSpec(`specs/hiring/${specId}.json`);
}
