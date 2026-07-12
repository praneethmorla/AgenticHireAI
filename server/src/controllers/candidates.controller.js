import path from "node:path";
import { Candidate } from "../models/candidate.model.js";
import { Job } from "../models/job.model.js";
import { createWorkflow } from "../services/workflow.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { created, ok } from "../utils/respond.js";
import { AppError } from "../utils/app-error.js";

export const uploadCandidate = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Resume file is required", 400);
  }

  const job = await Job.findById(req.validated.body.job_id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const resumeUrl = `/uploads/${path.basename(req.file.path)}`;
  const candidate = await Candidate.create({
    ...req.validated.body,
    job_id: job.id,
    resume_path: req.file.path,
    resume_url: resumeUrl,
    status: "processing"
  });
  const workflow = await createWorkflow({ candidate_id: candidate.id, job_id: job.id });

  return created(res, { candidate, workflow });
});

export const listCandidates = asyncHandler(async (req, res) => {
  const candidates = await Candidate.find().populate("job_id").sort({ created_at: -1 });
  return ok(res, { candidates });
});

export const getCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.validated.params.id).populate("job_id");

  if (!candidate) {
    throw new AppError("Candidate not found", 404);
  }

  return ok(res, { candidate });
});
