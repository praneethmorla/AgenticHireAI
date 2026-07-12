"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Upload } from "lucide-react";
import { api } from "@/lib/api";
import { useApiData } from "@/hooks/use-api-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusPill } from "@/components/status-pill";

export default function ApplyPage() {
  const { jobId } = useParams();
  const { data, error: jobError } = useApiData(() => api.job(jobId), [jobId]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    form.set("job_id", jobId);

    try {
      setResult(await api.uploadCandidate(form));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Card>
          <p className="text-sm font-semibold text-primary">Apply for</p>
          <h1 className="mt-2 text-3xl font-bold">{data?.job?.title || "Job"}</h1>
          {jobError ? <p className="mt-3 text-sm font-semibold text-danger">{jobError}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input type="hidden" name="job_id" value={jobId} />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input name="name" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" required />
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" required />
            </div>
            <div>
              <Label>Resume PDF</Label>
              <Input name="resume" type="file" accept="application/pdf" required />
            </div>
            {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
            <Button type="submit" disabled={submitting}>
              <Upload size={16} />
              {submitting ? "Processing..." : "Submit application"}
            </Button>
          </form>
        </Card>
        {result ? (
          <Card className="mt-4">
            <h2 className="text-lg font-bold">Application received</h2>
            <p className="mt-2 text-sm text-slate-600">The AI workflow started automatically.</p>
            <div className="mt-4 flex items-center gap-3">
              <StatusPill status={result.workflow.status} />
              <span className="text-sm font-semibold">Current node: {result.workflow.current_state || "processing"}</span>
            </div>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
