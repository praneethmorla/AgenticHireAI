"use client";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/use-api-data";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  const { data: candidateData } = useApiData(api.candidates, []);
  const { data: workflowData } = useApiData(api.workflows, []);
  const candidates = candidateData?.candidates || [];
  const workflows = workflowData?.workflows || [];
  const shortlisted = candidates.filter((candidate) => candidate.status === "shortlisted" || candidate.status === "completed").length;
  const completed = workflows.filter((workflow) => workflow.status === "completed").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-slate-500">Candidate statistics</p>
          <p className="mt-2 text-3xl font-bold">{candidates.length}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Shortlist rate</p>
          <p className="mt-2 text-3xl font-bold">{candidates.length ? Math.round((shortlisted / candidates.length) * 100) : 0}%</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Workflow completion rate</p>
          <p className="mt-2 text-3xl font-bold">{workflows.length ? Math.round((completed / workflows.length) * 100) : 0}%</p>
        </Card>
      </div>
      <Card>
        <h2 className="text-lg font-bold">Agent execution metrics</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["resume_parser", "embedding_agent", "matching_agent", "shortlisting_agent"].map((agent) => (
            <div className="rounded-md border border-border p-3" key={agent}>
              <p className="text-xs font-semibold uppercase text-slate-500">{agent.replaceAll("_", " ")}</p>
              <p className="mt-1 text-2xl font-bold">{workflows.filter((workflow) => workflow.nodes?.some((node) => node.name === agent && node.status === "success")).length}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
