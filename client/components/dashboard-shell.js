"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BriefcaseBusiness, GitBranch, LayoutDashboard, LogOut, Users } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/workflows", label: "Workflows", icon: GitBranch },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 }
];

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-border bg-white p-4 md:block">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">AI Recruitment</p>
          <h1 className="text-xl font-bold text-slate-950">Hiring Ops</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold ${
                  active ? "bg-sky-50 text-primary" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-white px-4 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Recruiter Workspace</p>
            <p className="text-sm font-semibold text-slate-900">{user?.name || "Recruiter"}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
