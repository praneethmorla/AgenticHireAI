const styles = {
  pending: "bg-slate-100 text-slate-700",
  running: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  waiting_approval: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  hold: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  applied: "bg-slate-100 text-slate-700"
};

export function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.pending}`}>
      {String(status || "pending").replaceAll("_", " ")}
    </span>
  );
}
