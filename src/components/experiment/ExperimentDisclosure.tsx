import type { ReactNode } from "react";
import { FiChevronRight } from "react-icons/fi";

export function ExperimentDisclosure({
  title,
  summary,
  children
}: {
  title: string;
  summary?: ReactNode;
  children: ReactNode;
}) {
  return (
    <details className="group/disclosure border-b border-divider">
      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-x-3 rounded-small py-2 text-sm hover:bg-default-50 focus-visible:outline-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-1.5 font-semibold">
          <FiChevronRight
            aria-hidden="true"
            className="shrink-0 text-foreground-500 group-open/disclosure:rotate-90"
          />
          {title}
        </span>
        {summary && (
          <span className="min-w-0 text-right text-xs text-foreground-600 wrap-anywhere">
            {summary}
          </span>
        )}
      </summary>
      <div className="pb-3 pt-1">{children}</div>
    </details>
  );
}
