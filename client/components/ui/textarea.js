import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none ring-primary/20 transition focus:ring-4",
        className
      )}
      {...props}
    />
  );
}
