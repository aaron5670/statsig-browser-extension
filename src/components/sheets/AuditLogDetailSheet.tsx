import { Chip, Tab, Tabs } from "@heroui/react";
import {
  auditActionLabel,
  auditTimestamp
} from "~/helpers/auditLogPresentation";
import { keyListItems } from "~/helpers/keyListItems";
import type { AuditLog, JsonData } from "~/types/statsig";
import DetailDialog from "../DetailDialog";

import { JsonValue } from "./JsonValue";

function RuleSnapshot({ rules }: { rules: unknown[] | undefined }) {
  if (!rules) {
    return (
      <p className="text-sm text-default-600">
        Statsig did not include this rule snapshot.
      </p>
    );
  }

  if (rules.length === 0) {
    return (
      <p className="text-sm text-default-600">No rules in this snapshot.</p>
    );
  }

  return (
    <div className="min-w-0 rounded-xl border border-divider bg-default-50 px-3 py-2 font-mono text-xs leading-6 wrap-anywhere">
      <JsonValue expanded value={rules as JsonData[]} />
    </div>
  );
}

export default function AuditLogDetailSheet({
  log,
  onClose
}: {
  log: AuditLog;
  onClose: () => void;
}) {
  const date = auditTimestamp(log.date, log.time);
  const actor = log.updatedBy || log.modifierEmail;
  const rules = log.changes?.rules;

  return (
    <DetailDialog
      isOpen
      onClose={onClose}
      title={log.name || "Audit log entry"}
      description={auditActionLabel(log.actionType)}>
      <div className="grid gap-5">
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-4 rounded-xl border border-divider bg-default-50 px-4 py-3 text-sm">
          <div className="min-w-0">
            <dt className="text-xs font-medium text-default-600">Changed by</dt>
            <dd className="mt-1 font-medium wrap-anywhere">
              {actor || "Unknown"}
            </dd>
            {log.modifierEmail && log.modifierEmail !== actor && (
              <dd className="mt-0.5 text-xs text-default-600 wrap-anywhere">
                {log.modifierEmail}
              </dd>
            )}
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium text-default-600">
              Date and time
            </dt>
            <dd className="mt-1">
              {date ? (
                <time dateTime={date.toISOString()}>
                  {date.toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    timeZoneName: "short"
                  })}
                </time>
              ) : (
                "Unavailable"
              )}
            </dd>
          </div>
        </dl>

        <section className="grid gap-2">
          <h3 className="text-sm font-semibold">Changes</h3>
          {log.changeLog && (
            <p className="text-sm wrap-anywhere">{log.changeLog}</p>
          )}
          {rules?.old || rules?.new ? (
            <Tabs
              aria-label="Rule snapshots"
              disableAnimation
              radius="sm"
              size="sm"
              classNames={{ panel: "min-w-0 px-0 pb-0" }}>
              <Tab
                key="before"
                title={`Before${rules.old ? ` (${rules.old.length})` : ""}`}>
                <RuleSnapshot rules={rules.old} />
              </Tab>
              <Tab
                key="after"
                title={`After${rules.new ? ` (${rules.new.length})` : ""}`}>
                <RuleSnapshot rules={rules.new} />
              </Tab>
            </Tabs>
          ) : (
            <p className="text-sm text-default-600">
              {log.changeLog
                ? "This entry has no rule snapshots."
                : "This entry has no description or rule snapshots."}
            </p>
          )}
        </section>

        {log.tags?.length > 0 && (
          <section className="grid gap-2">
            <h3 className="text-sm font-semibold">Tags</h3>
            <ul className="flex flex-wrap gap-1.5">
              {keyListItems(log.tags, (tag) => tag).map(({ item, key }) => (
                <li key={key} className="min-w-0">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="h-auto max-w-full whitespace-normal py-0.5 wrap-anywhere">
                    {item}
                  </Chip>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </DetailDialog>
  );
}
