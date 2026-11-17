import { useLocalStorage } from "@uidotdev/usehooks";
import { api } from "~/helpers/fetcher";
import type { AuditLog } from "~/types/statsig";
import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";

const limit = 50;

interface AuditPage {
  data: AuditLog[];
  pagination?: { nextPage: string | null };
}

function hasMore(page: AuditPage) {
  return page.pagination
    ? Boolean(page.pagination.nextPage)
    : page.data.length >= limit;
}

export function useAuditLogs() {
  const [apiKey] = useLocalStorage("statsig-console-api-key", "");
  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite(
      (pageIndex: number, previousPage: AuditPage | null) =>
        apiKey && (!pageIndex || (previousPage && hasMore(previousPage)))
          ? (["/audit_logs", pageIndex + 1, apiKey] as const)
          : null,
      ([url, page, key]) =>
        api
          .get<AuditPage>(url, {
            headers: { "STATSIG-API-KEY": key },
            params: { limit, page }
          })
          .then((response) => response.data),
      { revalidateFirstPage: false, shouldRetryOnError: false }
    );

  const auditLogs = useMemo(
    () =>
      Array.from(
        new Map(
          data?.flatMap((page) =>
            page.data.map((log) => [log.id, log] as const)
          )
        ).values()
      ),
    [data]
  );
  const lastPage = data?.at(-1);
  const isLoadingMore = Boolean(
    isValidating && lastPage && size > data.length && hasMore(lastPage)
  );
  const isReachingEnd = Boolean(lastPage && !hasMore(lastPage));
  const isAccessDenied = [401, 403].includes(error?.response?.status);

  return {
    auditLogs,
    error: isAccessDenied
      ? "This console key cannot access audit logs. Check its permissions in Statsig."
      : error
        ? "Audit logs could not be loaded. Check your connection and try again."
        : null,
    isAccessDenied,
    isConnected: Boolean(apiKey),
    isLoading,
    isLoadingMore,
    isRefreshing: isValidating && !isLoading && !isLoadingMore,
    isReachingEnd,
    loadMore: () => {
      if (!isValidating && !isReachingEnd && !error)
        void setSize(size + 1).catch(() => {});
    },
    refresh: () => {
      void mutate().catch(() => {});
    }
  };
}
