import fs from "node:fs/promises";
import path from "node:path";
import { Candidate } from "../models/candidate.model.js";
import { Job } from "../models/job.model.js";
import { Workflow } from "../models/workflow.model.js";
import { WorkflowLog } from "../models/workflow-log.model.js";
import { runResumeParserAgent } from "../agents/resume-parser.agent.js";
import { runEmbeddingAgent } from "../agents/embedding.agent.js";
import { runAtsScorerAgent } from "../agents/ats-scorer.agent.js";
import { runMatchingAgent } from "../agents/matching.agent.js";
import { runShortlistingAgent } from "../agents/shortlisting.agent.js";
import { runInterviewAgent } from "../agents/interview.agent.js";
import { runEmailAgent } from "../agents/email.agent.js";
import { loadSpec } from "../utils/spec-loader.js";
import { AppError } from "../utils/app-error.js";

const agents = {
  resume_parser: runResumeParserAgent,
  embedding_agent: runEmbeddingAgent,
  ats_scorer: runAtsScorerAgent,
  matching_agent: runMatchingAgent,
  shortlisting_agent: runShortlistingAgent,
  interview_agent: runInterviewAgent,
  email_agent: runEmailAgent
};

async function writeLog({ workflow, agentName, input, output, status, error }) {
  const entry = {
    workflow_id: workflow.id,
    agent_name: agentName,
    input,
    output,
    status,
    error: error?.message,
    stack: error?.stack,
    timestamp: new Date().toISOString()
  };

  await WorkflowLog.create({
    workflow_id: entry.workflow_id,
    agent_name: entry.agent_name,
    input: entry.input,
    output: entry.output,
    status: entry.status,
    error: entry.error,
    stack: entry.stack
  });
  const logDir = path.resolve(process.cwd(), "logs");
  await fs.mkdir(logDir, { recursive: true });
  await fs.appendFile(path.join(logDir, "workflow.log"), `${JSON.stringify(entry)}\n`);
}

function node(workflow, name) {
  return workflow.nodes.find((item) => item.name === name);
}

function setNode(workflow, name, patch) {
  const item = node(workflow, name);
  Object.assign(item, patch);
}

async function runWithRetry({ workflow, agentName, input, runner }) {
  const retryPolicy = await loadSpec("specs/system/retry-policy.json");
  let attempt = 0;

  while (attempt <= retryPolicy.max_retries) {
    try {
      setNode(workflow, agentName, { status: "running", retries: attempt, error: null });
      workflow.current_state = agentName;
      workflow.status = "running";
      await workflow.save();
      await writeLog({ workflow, agentName, input, status: "running" });

      const output = await runner(input);
      setNode(workflow, agentName, { status: "success", output });
      await writeLog({ workflow, agentName, input, output, status: "success" });
      await workflow.save();
      return output;
    } catch (error) {
      attempt += 1;
      setNode(workflow, agentName, { status: "failed", retries: attempt, error: error.message });
      await writeLog({ workflow, agentName, input, status: "failed", error });
      await workflow.save();

      if (attempt > retryPolicy.max_retries) {
        throw error;
      }
    }
  }
}

function buildContext({ candidate, job, workflow }) {
  const parsedResume = workflow.context.parsedResume || candidate.parsed_resume_json || {};

  return {
    candidate,
    job,
    parsedResume,
    matchResult: workflow.context.matchResult || {},
    shortlisting: workflow.context.shortlisting || {}
  };
}

async function applyAgentOutput({ workflow, candidate, agentName, output }) {
  if (agentName === "resume_parser") {
    workflow.context.parsedResume = output.data;
    candidate.parsed_resume_json = output.data;
    candidate.status = "processing";
  }

  if (agentName === "ats_scorer") {
    workflow.context.atsResult = output.data;
    candidate.ats_score = output.data.ats_score;
  }

  if (agentName === "matching_agent") {
    workflow.context.matchResult = output.data;
    candidate.match_score = output.data.match_score;
  }

  if (agentName === "shortlisting_agent") {
    workflow.context.shortlisting = output.data;
    candidate.status = "waiting_approval";
  }

  if (agentName === "interview_agent") {
    workflow.context.interview = output.data;
    candidate.status = "interviewing";
  }

  if (agentName === "email_agent") {
    workflow.context.email = output.data;
    candidate.status = "completed";
  }

  await candidate.save();
  await workflow.save();
}

export async function createWorkflow({ candidate_id, job_id }) {
  const [candidate, job] = await Promise.all([Candidate.findById(candidate_id), Job.findById(job_id)]);

  if (!candidate || !job) {
    throw new AppError("Candidate or job not found", 404);
  }

  const workflowSpec = await loadSpec(`specs/workflow/${job.workflow_spec_id}.json`);
  const workflow = await Workflow.create({
    candidate_id,
    job_id,
    workflow_spec_id: job.workflow_spec_id,
    current_state: workflowSpec.workflow[0],
    status: "pending",
    nodes: workflowSpec.workflow.map((name) => ({ name, status: "pending", retries: 0 })),
    context: {}
  });

  return executeWorkflow(workflow.id);
}

export async function executeWorkflow(workflowId) {
  const workflow = await Workflow.findById(workflowId);

  if (!workflow) {
    throw new AppError("Workflow not found", 404);
  }

  const [candidate, job] = await Promise.all([
    Candidate.findById(workflow.candidate_id),
    Job.findById(workflow.job_id)
  ]);

  const workflowSpec = await loadSpec(`specs/workflow/${workflow.workflow_spec_id}.json`);
  const startIndex = workflowSpec.workflow.findIndex((name) => {
    const currentNode = node(workflow, name);
    return currentNode && currentNode.status !== "success";
  });

  if (startIndex === -1) {
    workflow.status = "completed";
    candidate.status = "completed";
    await Promise.all([workflow.save(), candidate.save()]);
    return workflow;
  }

  for (const agentName of workflowSpec.workflow.slice(Math.max(startIndex, 0))) {
    if (agentName === "human_approval") {
      setNode(workflow, agentName, { status: "waiting_approval" });
      workflow.current_state = agentName;
      workflow.status = "waiting_approval";
      candidate.status = "waiting_approval";
      await Promise.all([workflow.save(), candidate.save()]);
      return workflow;
    }

    const runner = agents[agentName];
    if (!runner) {
      throw new AppError(`Unknown workflow agent: ${agentName}`, 400);
    }

    const input = buildContext({ candidate, job, workflow });
    const output = await runWithRetry({ workflow, agentName, input, runner });
    await applyAgentOutput({ workflow, candidate, agentName, output });
  }

  workflow.status = "completed";
  candidate.status = "completed";
  await Promise.all([workflow.save(), candidate.save()]);
  return workflow;
}

export async function approveWorkflow({ workflow_id, approved = true }) {
  const workflow = await Workflow.findById(workflow_id);

  if (!workflow) {
    throw new AppError("Workflow not found", 404);
  }

  const candidate = await Candidate.findById(workflow.candidate_id);
  const approvalNode = node(workflow, "human_approval");

  if (!approvalNode || workflow.status !== "waiting_approval") {
    throw new AppError("Workflow is not waiting for approval", 400);
  }

  if (!approved) {
    approvalNode.status = "success";
    workflow.status = "rejected";
    workflow.current_state = "human_approval";
    candidate.status = "rejected";
    await Promise.all([workflow.save(), candidate.save()]);
    return workflow;
  }

  approvalNode.status = "success";
  workflow.status = "running";
  await workflow.save();
  return executeWorkflow(workflow.id);
}

export async function retryWorkflow({ workflow_id }) {
  const workflow = await Workflow.findById(workflow_id);

  if (!workflow) {
    throw new AppError("Workflow not found", 404);
  }

  return executeWorkflow(workflow.id);
}

export async function getWorkflowWithLogs(id) {
  const workflow = await Workflow.findById(id).populate("candidate_id").populate("job_id");

  if (!workflow) {
    throw new AppError("Workflow not found", 404);
  }

  const logs = await WorkflowLog.find({ workflow_id: id }).sort({ created_at: 1 });
  return { workflow, logs };
}
