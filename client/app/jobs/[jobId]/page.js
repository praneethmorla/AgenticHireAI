"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/use-api-data";
import { Card } from "@/components/ui/card";

export default function PublicJobPage() {
  const { jobId } = useParams();
  const { data, loading, error } = useApiData(() => api.job(jobId), [jobId]);
  const job = data?.job;

  return (
    <main className="min-h-screen bg-background p-4 md:p-10">
      <div className="mx-auto max-w-3xl">
        {loading ? <p>Loading job...</p> : null}
        {error ? <p className="text-danger">{error}</p> : null}
        {job ? (
          <Card>
            <p className="text-sm font-semibold text-primary">Public application</p>
            <h1 className="mt-2 text-3xl font-bold">{job.title}</h1>
            <p className="mt-4 text-slate-700">{job.description}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-500">Required skills</p>
                <p className="font-semibold">{job.required_skills.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Minimum experience</p>
                <p className="font-semibold">{job.min_experience} years</p>
              </div>
            </div>
            <Link
              href={`/jobs/${job.id}/apply`}
              className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <Send size={16} />
              Apply
            </Link>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
