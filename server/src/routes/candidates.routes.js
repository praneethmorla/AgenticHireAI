import { Router } from "express";
import { getCandidate, listCandidates, uploadCandidate } from "../controllers/candidates.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { resumeUpload } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { candidateIdSchema, uploadCandidateSchema } from "../validators/candidate.validator.js";

const router = Router();

router.post("/upload", resumeUpload.single("resume"), validate(uploadCandidateSchema), uploadCandidate);
router.get("/", requireAuth, listCandidates);
router.get("/:id", requireAuth, validate(candidateIdSchema), getCandidate);

export default router;
