interface DividerProps {
  label?: string;
  className?: string;
}

export default function Divider({ label, className }: DividerProps) {
  return (
    <div className={`relative flex items-center gap-3 ${className ?? ""}`}>
      <div className="h-px flex-1 bg-slate-200" />
      {label && <span className="text-xs text-slate-400">{label}</span>}
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
