import { z } from "zod";

export const workflowStartSchema = z.object({
  body: z.object({
    candidate_id: z.string().min(1),
    job_id: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const workflowIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});

export const workflowActionSchema = z.object({
  body: z.object({
    workflow_id: z.string().min(1),
    approved: z.boolean().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
