"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/use-api-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/status-pill";

export default function DashboardPage() {
  const { data: jobsData } = useApiData(api.jobs, []);
  const { data: candidatesData } = useApiData(api.candidates, []);
  const { data: workflowData } = useApiData(api.workflows, []);
  const jobs = jobsData?.jobs || [];
  const candidates = candidatesData?.candidates || [];
  const workflows = workflowData?.workflows || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
          <p className="text-sm text-slate-600">Recruiting workflows, approvals, and candidate progress.</p>
        </div>
        <Link href="/dashboard/jobs/create">
          <Button>
            <Plus size={16} />
            Create job
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-slate-500">Open Jobs</p>
          <p className="mt-2 text-3xl font-bold">{jobs.length}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Candidates</p>
          <p className="mt-2 text-3xl font-bold">{candidates.length}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Waiting Approval</p>
          <p className="mt-2 text-3xl font-bold">{workflows.filter((item) => item.status === "waiting_approval").length}</p>
        </Card>
      </div>
      <Card>
        <h2 className="text-lg font-bold">Recent workflows</h2>
        <div className="mt-4 space-y-3">
          {workflows.slice(0, 5).map((workflow) => (
            <Link
              href={`/dashboard/workflows?workflow=${workflow.id}`}
              key={workflow.id}
              className="flex items-center justify-between rounded-md border border-border p-3"
            >
              <span className="text-sm font-semibold">{workflow.candidate_id?.name || "Candidate"}</span>
              <StatusPill status={workflow.status} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
