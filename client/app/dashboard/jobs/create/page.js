"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  required_skills: z.string().min(1),
  preferred_skills: z.string(),
  min_experience: z.coerce.number().min(0)
});

export default function CreateJobPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "Frontend Developer",
      description: "Build modern hiring workflow interfaces with React and Next.js.",
      required_skills: "React, JavaScript, CSS",
      preferred_skills: "Next.js, Tailwind CSS",
      min_experience: 2
    }
  });

  async function onSubmit(values) {
    setError("");
    try {
      await api.createJob({
        ...values,
        required_skills: values.required_skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        preferred_skills: values.preferred_skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        workflow_spec_id: "default-hiring-workflow",
        hiring_spec_id: "frontend-developer"
      });
      router.push("/dashboard/jobs");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <Card className="max-w-3xl">
      <h1 className="text-2xl font-bold">Create job</h1>
      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label>Title</Label>
          <Input {...form.register("title")} />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea {...form.register("description")} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Required skills</Label>
            <Input {...form.register("required_skills")} />
          </div>
          <div>
            <Label>Preferred skills</Label>
            <Input {...form.register("preferred_skills")} />
          </div>
        </div>
        <div>
          <Label>Minimum experience</Label>
          <Input type="number" {...form.register("min_experience")} />
        </div>
        {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
        <Button type="submit">
          <Save size={16} />
          Save job
        </Button>
      </form>
    </Card>
  );
}
