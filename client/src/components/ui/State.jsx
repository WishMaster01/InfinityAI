import React from "react";
import { AlertCircle, Inbox, LoaderCircle, WifiOff } from "lucide-react";
import Button from "./Button.jsx";

export const LoadingState = ({ label = "Loading" }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600"
  >
    <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600" />
    <span className="font-semibold">{label}</span>
  </div>
);

export const EmptyState = ({
  title = "Nothing here yet",
  description,
  action,
  onAction,
}) => (
  <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
    <Inbox className="h-8 w-8 text-indigo-400" />
    <h2 className="text-lg font-black text-slate-950">{title}</h2>
    {description && (
      <p className="max-w-md text-sm text-slate-500">{description}</p>
    )}
    {action && <Button onClick={onAction}>{action}</Button>}
  </div>
);

export const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div
    role="alert"
    className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center"
  >
    <AlertCircle className="h-7 w-7 text-rose-600" />
    <p className="font-semibold text-rose-800">{message}</p>
    {onRetry && (
      <Button variant="danger" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export const OfflineState = ({ onRetry }) => (
  <div
    role="status"
    className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900"
  >
    <span className="flex items-center gap-2">
      <WifiOff className="h-5 w-5" />
      You're offline. Some data may be stale.
    </span>
    {onRetry && (
      <Button variant="secondary" className="py-2" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);
