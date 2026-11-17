import { Button, Chip, Input, Skeleton } from "@heroui/react";
import Fuse from "fuse.js";
import { type ReactNode, useMemo, useState } from "react";
import { RxChevronRight, RxReload } from "react-icons/rx";
import TimeAgo from "react-timeago";
import { SearchIcon } from "~/components/icons/SearchIcon";
import {
  auditActionColor,
  auditActionLabel,
  auditTimestamp
} from "~/helpers/auditLogPresentation";
import { useAuditLogs } from "~/hooks/useAuditLogs";
import type { AuditLog } from "~/types/statsig";
import AuditLogDetailSheet from "./sheets/AuditLogDetailSheet";
import { OpenStatsig } from "./sheets/DetailContent";

export default function AuditLogs({
  onReplaceKey,
  reviewPrompt
}: {
  onReplaceKey?: () => void;
  reviewPrompt?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const {
    auditLogs,
    error,
    isAccessDenied,
    isConnected,
    isLoading,
    isLoadingMore,
    isRefreshing,
    isReachingEnd,
    loadMore,
    refresh
  } = useAuditLogs();

  const search = query.trim();
  const fuse = useMemo(
    () =>
      new Fuse(auditLogs, {
        keys: [
          "name",
          {
            name: "actionType",
            getFn: (log) => [
              log.actionType || "",
              auditActionLabel(log.actionType)
            ]
          },
          "changeLog",
          "updatedBy",
          "modifierEmail",
          "tags"
        ],
        threshold: 0.3
      }),
    [auditLogs]
  );
  const filteredItems = search
    ? fuse.search(search).map(({ item }) => item)
    : auditLogs;
  const hasLogs = auditLogs.length > 0;

  return (
    <section aria-label="Audit logs" className="grid min-w-0 gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          aria-label="Search loaded audit logs"
          className="flex-1 basis-44"
          classNames={{
            input: "text-[13px] placeholder:text-foreground-600",
            inputWrapper:
              "min-h-9 border border-divider bg-background shadow-none"
          }}
          isClearable
          onValueChange={setQuery}
          placeholder="Search audit logs"
          radius="sm"
          size="sm"
          startContent={
            <SearchIcon className="size-4 shrink-0 text-foreground-600" />
          }
          value={query}
          variant="bordered"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button
            aria-label="Refresh audit logs"
            className="min-h-9"
            isDisabled={!isConnected || isLoading || isLoadingMore}
            isLoading={isRefreshing}
            onPress={refresh}
            radius="sm"
            size="sm"
            startContent={!isRefreshing && <RxReload aria-hidden="true" />}
            variant="bordered">
            Refresh
          </Button>
          <OpenStatsig path="" />
        </div>
      </div>

      {!isLoading && !error && !selectedLog && reviewPrompt}
      <div
        className="min-w-0 overflow-hidden rounded-xl border border-divider"
        aria-busy={isLoading || isLoadingMore || isRefreshing}>
        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-2 bg-danger-50 px-4 py-3 text-sm text-danger-700">
            <p>{error}</p>
            {isAccessDenied && onReplaceKey && (
              <Button
                className="min-h-9 bg-background"
                onPress={onReplaceKey}
                radius="sm"
                size="sm"
                variant="bordered">
                Sign out to replace key
              </Button>
            )}
          </div>
        )}
        {isLoading ? (
          <>
            <p className="sr-only" role="status">
              Loading audit logs
            </p>
            <div className="divide-y divide-divider" aria-hidden="true">
              {[1, 2, 3].map((row) => (
                <div className="grid gap-2 px-4 py-3" key={row}>
                  <Skeleton className="h-4 w-3/5 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded" />
                </div>
              ))}
            </div>
          </>
        ) : filteredItems.length > 0 ? (
          <ul className="divide-y divide-divider">
            {filteredItems.map((log) => {
              const date = auditTimestamp(log.date, log.time);
              return (
                <li key={log.id}>
                  <button
                    aria-haspopup="dialog"
                    className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left hover:bg-default-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                    onClick={() => setSelectedLog(log)}
                    type="button">
                    <span className="grid min-w-0 gap-1.5">
                      <span className="text-sm font-semibold wrap-anywhere">
                        {log.name || "Unnamed activity"}
                      </span>
                      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-default-600">
                        <Chip
                          as="span"
                          color={auditActionColor(log.actionType)}
                          size="sm"
                          variant="flat"
                          className="h-auto max-w-full whitespace-normal py-0.5 text-xs">
                          {auditActionLabel(log.actionType)}
                        </Chip>
                        {(log.updatedBy || log.modifierEmail) && (
                          <span className="wrap-anywhere">
                            {log.updatedBy || log.modifierEmail}
                          </span>
                        )}
                        {date ? (
                          <time
                            dateTime={date.toISOString()}
                            title={date.toLocaleString()}>
                            <TimeAgo date={date} component="span" />
                          </time>
                        ) : (
                          "Time unavailable"
                        )}
                      </span>
                      {log.changeLog && (
                        <span className="line-clamp-1 text-xs text-foreground-600 wrap-anywhere">
                          {log.changeLog}
                        </span>
                      )}
                      {log.tags?.length > 0 && (
                        <span className="text-xs text-default-600 wrap-anywhere">
                          {log.tags.join(", ")}
                        </span>
                      )}
                    </span>
                    <RxChevronRight
                      aria-hidden="true"
                      className="text-default-600"
                      size={16}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          !error && (
            <div className="grid gap-1.5 px-4 py-7 text-center" role="status">
              <p className="text-sm font-semibold">
                {!isConnected
                  ? "Connect to Statsig to view audit logs"
                  : search && hasLogs
                    ? "No matches in the loaded logs"
                    : "No audit logs yet"}
              </p>
              {search && hasLogs && (
                <p className="text-sm text-default-600">
                  Change your search
                  {!isReachingEnd ? " or load older entries" : ""}.
                </p>
              )}
            </div>
          )
        )}
      </div>

      {hasLogs && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-default-600">
          <p role="status">
            {search
              ? `${filteredItems.length} of ${auditLogs.length} loaded entries`
              : `${auditLogs.length} ${auditLogs.length === 1 ? "entry" : "entries"} loaded`}
          </p>
          {!isReachingEnd && !error && (
            <Button
              className="min-h-9"
              isDisabled={isRefreshing}
              isLoading={isLoadingMore}
              onPress={loadMore}
              radius="sm"
              size="sm"
              variant="bordered">
              {isLoadingMore ? "Loading older entries" : "Load older entries"}
            </Button>
          )}
        </div>
      )}

      {selectedLog && (
        <AuditLogDetailSheet
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </section>
  );
}
