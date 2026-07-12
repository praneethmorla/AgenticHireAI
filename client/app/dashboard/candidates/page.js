"use client";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/use-api-data";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/status-pill";

export default function CandidatesPage() {
  const { data } = useApiData(api.candidates, []);
  const candidates = data?.candidates || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Candidates</h1>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-4">Candidate</th>
              <th className="p-4">Job</th>
              <th className="p-4">Match Score</th>
              <th className="p-4">ATS Score</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr className="border-t border-border" key={candidate.id}>
                <td className="p-4 font-semibold">{candidate.name}</td>
                <td className="p-4">{candidate.job_id?.title || "Job"}</td>
                <td className="p-4">{candidate.match_score || 0}%</td>
                <td className="p-4">{candidate.ats_score || 0}%</td>
                <td className="p-4"><StatusPill status={candidate.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
