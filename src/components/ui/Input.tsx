"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  label: string;
  id: string;
  error?: string;
  /** Helper text under the field (hidden while an error shows). */
  hint?: string;
  /** Optional element rendered inside the field on the left (e.g. a country code). */
  prefix?: ReactNode;
  /** Optional element inside the field on the right (e.g. a status icon). */
  suffix?: ReactNode;
};

export default function Input({
  label,
  id,
  error,
  hint,
  prefix,
  suffix,
  type = "text",
  className = "",
  ...props
}: InputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-dark">
        {label}
      </label>
      <div
        className={`flex items-stretch overflow-hidden rounded-md border bg-surface transition-colors ${
          error ? "border-red-500 focus-within:border-red-600" : "border-border focus-within:border-primary"
        }`}
      >
        {prefix && (
          <span className="flex items-center whitespace-nowrap border-r border-border bg-background px-3 text-sm text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full bg-transparent px-4 py-3 text-dark outline-none placeholder:text-muted/60 ${className}`}
          {...props}
        />
        {suffix && <span className="flex items-center pr-3">{suffix}</span>}
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
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
