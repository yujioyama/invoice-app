interface AlertProps {
  message: string;
  variant?: "error" | "success";
}

const variantStyles = {
  error: "bg-red-50 text-red-600",
  success: "bg-green-50 text-green-600",
};

export default function Alert({ message, variant = "error" }: AlertProps) {
  return (
    <div
      className={`mb-4 rounded-lg px-4 py-3 text-sm ${variantStyles[variant]}`}
    >
      {message}
    </div>
  );
}
