import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiHelpCircle,
  FiMinusCircle,
  FiXCircle
} from "react-icons/fi";
import { ExperimentDisclosure } from "~/components/experiment/ExperimentDisclosure";
import { keyListItems } from "~/helpers/keyListItems";
import type { HealthCheck } from "~/types/statsig";

const statuses: Record<
  string,
  { label: string; Icon: IconType; color: string }
> = {
  PASSED: { label: "Passed", Icon: FiCheckCircle, color: "text-success-700" },
  FAILED: { label: "Failed", Icon: FiXCircle, color: "text-danger-700" },
  WARNING: {
    label: "Warning",
    Icon: FiAlertTriangle,
    color: "text-warning-800"
  },
  WAITING: { label: "Waiting", Icon: FiClock, color: "text-foreground-600" },
  NOT_APPLIED: {
    label: "Not applied",
    Icon: FiMinusCircle,
    color: "text-foreground-600"
  },
  UNKNOWN: {
    label: "Unknown",
    Icon: FiHelpCircle,
    color: "text-foreground-600"
  }
};

export const HealthCheckSection = ({
  healthChecks
}: {
  healthChecks?: HealthCheck[];
}) => {
  if (!healthChecks?.length) return null;

  const counts = new Map<string, number>();
  const checks = healthChecks.map((check) => {
    const status = Object.hasOwn(statuses, check.status)
      ? check.status
      : "UNKNOWN";
    counts.set(status, (counts.get(status) ?? 0) + 1);
    return { ...check, status };
  });
  const passed = counts.get("PASSED") ?? 0;
  const total = checks.length - (counts.get("NOT_APPLIED") ?? 0);
  const issue = ["FAILED", "WARNING", "UNKNOWN", "WAITING", "NOT_APPLIED"]
    .map((status) => ({ ...statuses[status], count: counts.get(status) ?? 0 }))
    .find(({ count }) => count > 0);

  return (
    <ExperimentDisclosure
      title="Health checks"
      summary={
        <span className="inline-flex flex-wrap items-center justify-end gap-x-2 tabular-nums">
          {total > 0 && (
            <span>
              {passed} of {total} passed
            </span>
          )}
          {issue && (
            <span className={`font-medium ${issue.color}`}>
              {issue.count}{" "}
              {issue.label === "Warning" && issue.count > 1
                ? "warnings"
                : issue.label.toLowerCase()}
            </span>
          )}
        </span>
      }>
      <ul className="divide-y divide-divider">
        {keyListItems(checks, ({ name, description }) =>
          JSON.stringify([name, description])
        ).map(({ item: check, key }) => {
          const { Icon, label, color } = statuses[check.status];
          const row = (
            <>
              <span className="flex-1 text-sm wrap-anywhere">{check.name}</span>
              <span
                className={`inline-flex shrink-0 items-center gap-1 text-xs font-medium ${color}`}>
                <Icon aria-hidden="true" size={13} />
                {label}
              </span>
            </>
          );

          return (
            <li key={key}>
              {check.description?.trim() ? (
                <details className="group/check">
                  <summary className="flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-small py-1.5 hover:bg-default-50 focus-visible:outline-2 focus-visible:outline-focus focus-visible:-outline-offset-2 [&::-webkit-details-marker]:hidden">
                    <FiChevronRight
                      aria-hidden="true"
                      className="shrink-0 text-foreground-600 group-open/check:rotate-90"
                      size={14}
                    />
                    {row}
                  </summary>
                  <p className="pb-2 ps-5 text-sm leading-relaxed whitespace-pre-wrap text-foreground-600 wrap-anywhere">
                    {check.description}
                  </p>
                </details>
              ) : (
                <div className="flex min-h-9 items-center gap-1.5 py-1.5 ps-5">
                  {row}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </ExperimentDisclosure>
  );
};
