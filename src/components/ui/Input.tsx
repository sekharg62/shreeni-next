"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
  /** Optional element rendered inside the field on the left (e.g. a country code). */
  prefix?: string;
};

export default function Input({
  label,
  id,
  error,
  prefix,
  type = "text",
  className = "",
  ...props
}: InputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-dark">
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-md border border-border bg-surface transition-colors focus-within:border-primary">
        {prefix && (
          <span className="flex items-center whitespace-nowrap border-r border-border bg-background px-3 text-sm text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          className={`w-full bg-transparent px-4 py-3 text-dark outline-none placeholder:text-muted/60 ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="flex items-center px-3 text-muted transition-colors hover:text-primary"
          >
            {show ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
