"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  wrapperClass?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, wrapperClass, id, className = "input", ...props }, ref) => (
    <div className={wrapperClass}>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input ref={ref} id={id} className={className} {...props} />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
);
FormField.displayName = "FormField";

export default FormField;
