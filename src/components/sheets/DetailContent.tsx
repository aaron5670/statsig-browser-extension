import { Button, Skeleton } from "@heroui/react";
import { type ReactNode, useState } from "react";
import { FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
import TimeAgo from "react-timeago";

export function OpenStatsig({ path }: { path: string }) {
  return (
    <a
      className="inline-flex min-h-9 items-center gap-2 rounded-small border border-default-300 px-3 text-sm font-medium text-foreground hover:bg-default-50 focus-visible:outline-2 focus-visible:outline-focus"
      href={`https://console.statsig.com/${path}`}
      rel="noopener noreferrer"
      target="_blank">
      Open in Statsig
      <FiExternalLink aria-hidden="true" size={14} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function CopyDetailValue({
  label,
  value
}: {
  label: string;
  value: string | (() => string);
}) {
  const [feedback, setFeedback] = useState<"copied" | "failed">();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        typeof value === "function" ? value() : value
      );
      setFeedback("copied");
    } catch {
      setFeedback("failed");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        className="min-h-9 shrink-0"
        onPress={copy}
        radius="sm"
        size="sm"
        startContent={
          feedback === "copied" ? (
            <FiCheck aria-hidden="true" />
          ) : (
            <FiCopy aria-hidden="true" />
          )
        }
        variant="bordered">
        {label}
      </Button>
      <span
        role="status"
        className={
          feedback === "failed"
            ? "text-xs text-danger"
            : "text-xs text-default-600"
        }>
        {feedback === "failed"
          ? "Couldn’t copy to the clipboard."
          : feedback === "copied"
            ? "Copied to the clipboard."
            : ""}
      </span>
    </div>
  );
}

export function DetailState({
  loading,
  error,
  onRetry
}: {
  loading?: string;
  error?: string;
  onRetry?: () => void;
}) {
  if (loading) {
    return (
      <div className="grid gap-2 py-1" role="status">
        <span className="text-sm text-default-600">{loading}</span>
        <Skeleton
          aria-hidden="true"
          className="h-3 w-3/4 rounded-sm motion-reduce:before:animate-none"
        />
        <Skeleton
          aria-hidden="true"
          className="h-3 w-1/2 rounded-sm motion-reduce:before:animate-none"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-divider px-3 py-2">
      <p role="alert" className="text-sm">
        {error}
      </p>
      {onRetry && (
        <Button
          className="min-h-9"
          onPress={(event) => {
            event.target.closest<HTMLElement>('[role="dialog"]')?.focus();
            onRetry();
          }}
          radius="sm"
          size="sm"
          variant="bordered">
          Try again
        </Button>
      )}
    </div>
  );
}

export function DetailMetadata({
  created,
  updated,
  description,
  creator,
  editor,
  children
}: {
  created?: number;
  updated?: number;
  description?: string;
  creator?: string;
  editor?: string;
  children?: ReactNode;
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-divider bg-default-50 px-4 py-3">
      {description && (
        <MetadataField
          label="Description"
          className="col-span-full border-b border-divider pb-3 whitespace-pre-wrap">
          {description}
        </MetadataField>
      )}
      <MetadataField label="Created">
        <MetadataTime timestamp={created} person={creator} />
      </MetadataField>
      <MetadataField label="Updated">
        <MetadataTime timestamp={updated} person={editor} />
      </MetadataField>
      {children}
    </dl>
  );
}

export function MetadataField({
  label,
  children,
  className = ""
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-xs font-medium text-default-600">{label}</dt>
      <dd className="mt-0.5 text-sm leading-relaxed wrap-anywhere">
        {children}
      </dd>
    </div>
  );
}

export function MetadataTime({
  timestamp,
  person
}: {
  timestamp?: number | null;
  person?: string;
}) {
  const date = typeof timestamp === "number" ? new Date(timestamp) : undefined;
  return (
    <>
      {date && Number.isFinite(date.getTime()) ? (
        <TimeAgo date={date} title={date.toLocaleString()} />
      ) : (
        "Unavailable"
      )}
      {person && (
        <span className="block text-xs text-default-600">{person}</span>
      )}
    </>
  );
}
