"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm({ resolver: zodResolver(schema) });
  const [error, setError] = useState("");

  async function onSubmit(values) {
    setError("");

    try {
      const session = await api.login(values);
      setSession(session);
      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-950">Recruiter login</h1>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label>Email</Label>
            <Input type="email" {...form.register("email")} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...form.register("password")} />
          </div>
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          <Button className="w-full" type="submit">
            <LogIn size={16} />
            Login
          </Button>
        </form>
        <Link className="mt-4 block text-sm font-semibold text-primary" href="/signup">
          Create recruiter account
        </Link>
      </Card>
    </main>
  );
}
