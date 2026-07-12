import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("rounded-lg border border-border bg-white p-5 shadow-sm", className)} {...props} />;
}
