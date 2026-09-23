import React from "react";

export const Field = ({ label, id, error, hint, className = "", ...props }) => (
  <div className={className}>
    <label htmlFor={id} className="field-label">
      {label}
    </label>
    <input
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      className={`field-input ${error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}`}
      {...props}
    />
    {hint && !error && (
      <p id={`${id}-hint`} className="helper-text">
        {hint}
      </p>
    )}
    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        className="mt-2 text-sm font-semibold text-rose-700"
      >
        {error}
      </p>
    )}
  </div>
);

export const Textarea = ({
  label,
  id,
  error,
  hint,
  className = "",
  ...props
}) => (
  <div className={className}>
    <label htmlFor={id} className="field-label">
      {label}
    </label>
    <textarea
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      className={`field-input min-h-32 resize-y ${error ? "border-rose-400" : ""}`}
      {...props}
    />
    {hint && !error && (
      <p id={`${id}-hint`} className="helper-text">
        {hint}
      </p>
    )}
    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        className="mt-2 text-sm font-semibold text-rose-700"
      >
        {error}
      </p>
    )}
  </div>
);
