interface FormActionsProps {
  primaryLabel: string;
  primaryDisabled?: boolean;
  secondaryLabel: string;
  onSecondary: () => void;
}

export default function FormActions({
  primaryLabel,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
}: FormActionsProps) {
  return (
    <div className="flex gap-4 pb-9">
      <button
        type="submit"
        disabled={primaryDisabled}
        className="btn btn-primary"
      >
        {primaryLabel}
      </button>
      <button type="button" onClick={onSecondary} className="btn btn-ghost">
        {secondaryLabel}
      </button>
    </div>
  );
}
