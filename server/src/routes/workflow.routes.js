import { Router } from "express";
import { approve, getWorkflow, listWorkflows, retry, startWorkflow } from "../controllers/workflow.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { workflowActionSchema, workflowIdSchema, workflowStartSchema } from "../validators/workflow.validator.js";

const router = Router();

router.post("/start", requireAuth, validate(workflowStartSchema), startWorkflow);
router.post("/retry", requireAuth, validate(workflowActionSchema), retry);
router.post("/approve", requireAuth, validate(workflowActionSchema), approve);
router.get("/", requireAuth, listWorkflows);
router.get("/:id", requireAuth, validate(workflowIdSchema), getWorkflow);

export default router;
