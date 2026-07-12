import { z } from "zod";

const jobBody = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  required_skills: z.array(z.string().min(1)).min(1),
  preferred_skills: z.array(z.string().min(1)).default([]),
  min_experience: z.coerce.number().min(0),
  workflow_spec_id: z.string().default("default-hiring-workflow"),
  hiring_spec_id: z.string().default("frontend-developer")
});

export const createJobSchema = z.object({
  body: jobBody,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateJobSchema = z.object({
  body: jobBody.partial(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});

export const jobIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});
