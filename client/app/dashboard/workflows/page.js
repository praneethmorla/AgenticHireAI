"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, RotateCcw, X } from "lucide-react";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/use-api-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/status-pill";
import { WorkflowGraph } from "@/components/workflow-graph";

export default function WorkflowsPage() {
  const params = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const { data } = useApiData(api.workflows, [refreshKey]);
  const workflows = data?.workflows || [];
  const selectedId = params.get("workflow") || workflows[0]?.id;
  const selected = useMemo(() => workflows.find((workflow) => workflow.id === selectedId), [workflows, selectedId]);

  async function act(action) {
    if (!selected) return;
    if (action === "approve") await api.approveWorkflow({ workflow_id: selected.id, approved: true });
    if (action === "reject") await api.approveWorkflow({ workflow_id: selected.id, approved: false });
    if (action === "retry") await api.retryWorkflow({ workflow_id: selected.id });
    setRefreshKey((value) => value + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <Button variant="secondary" onClick={() => setRefreshKey((value) => value + 1)}>
          <RotateCcw size={16} />
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="space-y-3">
          {workflows.map((workflow) => (
            <a
              href={`/dashboard/workflows?workflow=${workflow.id}`}
              key={workflow.id}
              className={`block rounded-md border p-3 ${
                selected?.id === workflow.id ? "border-primary bg-sky-50" : "border-border bg-white"
              }`}
            >
              <p className="font-semibold">{workflow.candidate_id?.name || "Candidate"}</p>
              <p className="text-xs text-slate-500">{workflow.job_id?.title || "Job"}</p>
              <div className="mt-2"><StatusPill status={workflow.status} /></div>
            </a>
          ))}
        </Card>
        <div className="space-y-4">
          {selected ? (
            <>
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{selected.candidate_id?.name || "Candidate"}</h2>
                    <p className="text-sm text-slate-600">Current node: {selected.current_state}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => act("retry")}>
                      <RotateCcw size={16} />
                      Retry
                    </Button>
                    <Button disabled={selected.status !== "waiting_approval"} onClick={() => act("approve")}>
                      <Check size={16} />
                      Approve
                    </Button>
                    <Button variant="danger" disabled={selected.status !== "waiting_approval"} onClick={() => act("reject")}>
                      <X size={16} />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
              <WorkflowGraph workflow={selected} />
            </>
          ) : (
            <Card>No workflows yet.</Card>
          )}
        </div>
      </div>
    </div>
  );
}
