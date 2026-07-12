"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export default function SignupPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    const session = await api.signup({ ...values, role: "recruiter" });
    setSession(session);
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-950">Create recruiter account</h1>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label>Name</Label>
            <Input {...form.register("name")} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" {...form.register("email")} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...form.register("password")} />
          </div>
          <Button className="w-full" type="submit">
            <UserPlus size={16} />
            Sign up
          </Button>
        </form>
        <Link className="mt-4 block text-sm font-semibold text-primary" href="/login">
          Already have an account?
        </Link>
      </Card>
    </main>
  );
}
