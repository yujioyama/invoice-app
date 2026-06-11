"use client";

import { useState, InputHTMLAttributes } from "react";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  wrapperClass?: string;
  showLabel?: string;
  hideLabel?: string;
}

export default function PasswordInput({
  label,
  error,
  wrapperClass,
  showLabel = "Show password",
  hideLabel = "Hide password",
  id,
  className = "input pr-10",
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className={wrapperClass}>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          id={id}
          className={className}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? hideLabel : showLabel}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.336 1.657-.336 3.234 0 4.675m-2.122-2.122A7.963 7.963 0 0120 15c0 4.418-3.582 8-8 8-1.657 0-3.234-.336-4.675-.938m-2.122-2.122A7.963 7.963 0 014 9c0-4.418 3.582-8 8-8 1.657 0 3.234.336 4.675.938"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.122 2.122A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.234-.336 4.675-.938m2.122-2.122A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.234.336-4.675.938"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
