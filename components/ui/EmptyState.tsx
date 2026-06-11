interface EmptyStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export default function EmptyState({
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-10 text-center">
      <p className="mb-4 text-slate-700">{message}</p>
      <button onClick={onAction} className="btn btn-primary">
        {actionLabel}
      </button>
    </div>
  );
}
