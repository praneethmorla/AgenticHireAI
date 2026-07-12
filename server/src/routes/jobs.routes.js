import { Router } from "express";
import { createJob, getJob, listJobs, updateJob } from "../controllers/jobs.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createJobSchema, jobIdSchema, updateJobSchema } from "../validators/job.validator.js";

const router = Router();

router.get("/", listJobs);
router.get("/:id", validate(jobIdSchema), getJob);
router.post("/", requireAuth, validate(createJobSchema), createJob);
router.put("/:id", requireAuth, validate(updateJobSchema), updateJob);

export default router;
