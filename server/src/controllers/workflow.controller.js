import { Workflow } from "../models/workflow.model.js";
import {
  approveWorkflow,
  createWorkflow,
  getWorkflowWithLogs,
  retryWorkflow
} from "../services/workflow.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { created, ok } from "../utils/respond.js";

export const startWorkflow = asyncHandler(async (req, res) => {
  const workflow = await createWorkflow(req.validated.body);
  return created(res, { workflow });
});

export const retry = asyncHandler(async (req, res) => {
  const workflow = await retryWorkflow(req.validated.body);
  return ok(res, { workflow });
});

export const approve = asyncHandler(async (req, res) => {
  const workflow = await approveWorkflow(req.validated.body);
  return ok(res, { workflow });
});

export const getWorkflow = asyncHandler(async (req, res) => {
  const result = await getWorkflowWithLogs(req.validated.params.id);
  return ok(res, result);
});

export const listWorkflows = asyncHandler(async (req, res) => {
  const workflows = await Workflow.find().populate("candidate_id").populate("job_id").sort({ created_at: -1 });
  return ok(res, { workflows });
});
