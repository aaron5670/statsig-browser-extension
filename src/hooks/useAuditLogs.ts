import type { AuditLog } from "~types/statsig";

import { useLocalStorage } from "@uidotdev/usehooks";
import { api } from "~helpers/fetcher";
import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";

const limit = 50;

export const useAuditLogs = (): {
  auditLogs: AuditLog[];
  error: null | string;
  isLoading: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  loadMore: () => void;
  refresh: () => void;
} => {
  const [apiKey] = useLocalStorage("statsig-console-api-key");

  const getKey = (pageIndex: number, previousPageData: any) => {
    // If no API key, don't fetch
    if (!apiKey) return null;
    
    // If we reached the end (empty page), stop fetching
    if (previousPageData && (!previousPageData.data || previousPageData.data.length === 0)) return null;
    
    // First page, we don't have `previousPageData`
    if (pageIndex === 0) return ['/audit_logs', 1];
    
    // Add the page number to the API endpoint
    return ['/audit_logs', pageIndex + 1];
  };

  const fetcher = ([url, page]: [string, number]) => 
    api.get(url, {
      headers: {
        "STATSIG-API-KEY": apiKey as string,
      },
      params: {
        limit,
        page,
      }
    }).then(res => res.data);

  const { 
    data, 
    error, 
    isLoading, 
    size, 
    setSize,
    mutate
  } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateAll: false,
  });

  // Flatten all pages into a single array of audit logs
  const auditLogs = useMemo(() => {
    if (!data) return [];
    return data.flatMap(page => page?.data || []);
  }, [data]);

  // Check if we're loading more data
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  // Check if we've reached the end
  const isReachingEnd = data && data[data.length - 1]?.data?.length < limit;

  // Function to load more data
  const loadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  // Function to refresh data
  const refresh = () => {
    mutate();
  };

  const fetchError = error ? 'An error occurred while fetching audit log data.' : null;

  return {
    auditLogs,
    error: fetchError,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    refresh,
  };
}; 