export function Label({ children, ...props }) {
  return (
    <label className="mb-1 block text-sm font-semibold text-slate-700" {...props}>
      {children}
    </label>
  );
}
