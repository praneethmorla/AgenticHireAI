import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { created, ok } from "../utils/respond.js";
import { AppError } from "../utils/app-error.js";
import { loadHiringSpec, loadSpec } from "../utils/spec-loader.js";

export const createJob = asyncHandler(async (req, res) => {
  await loadHiringSpec(req.validated.body.hiring_spec_id);
  await loadSpec(`specs/workflow/${req.validated.body.workflow_spec_id}.json`);

  const job = await Job.create({ ...req.validated.body, recruiter_id: req.user.id });
  return created(res, { job, public_apply_url: `/jobs/${job.id}/apply` });
});

export const listJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ created_at: -1 });
  return ok(res, { jobs });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.validated.params.id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return ok(res, { job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.validated.params.id, req.validated.body, {
    new: true,
    runValidators: true
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return ok(res, { job });
});
