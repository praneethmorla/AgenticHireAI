"use client";

import Link from "next/link";
import { Send, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/use-api-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function JobsPage() {
  const { data, loading } = useApiData(api.jobs, []);
  const jobs = data?.jobs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Link href="/dashboard/jobs/create">
          <Button>
            <Plus size={16} />
            Create
          </Button>
        </Link>
      </div>
      {loading ? <p className="text-sm text-slate-600">Loading jobs...</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{job.description}</p>
              </div>
              <Link
                href={`/jobs/${job.id}/apply`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                <Send size={16} />
                Apply
              </Link>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700">Required: {job.required_skills.join(", ")}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
