import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { api } from "~/helpers/fetcher";

interface Page<Item> {
  data: Item[];
  pagination?: { totalItems: number };
}

export function useStatsigList<Item>(endpoint: string) {
  const [apiKey] = useLocalStorage<string>("statsig-console-api-key");
  const { data, error, isLoading, isValidating, mutate, setSize, size } =
    useSWRInfinite(
      (index) => (apiKey ? ([endpoint, index + 1, apiKey] as const) : null),
      async ([url, page, key]) => {
        const response = await api.get<Page<Item>>(url, {
          headers: { "STATSIG-API-KEY": key },
          params: { limit: 100, page }
        });
        return response.data;
      },
      { revalidateFirstPage: false }
    );

  const items = useMemo(
    () => data?.flatMap((page) => page?.data ?? []) ?? [],
    [data]
  );
  const lastPage = data?.at(-1);
  const total = data?.[0]?.pagination?.totalItems;
  const hasNextPage =
    data?.length === size &&
    Boolean(lastPage?.data?.length) &&
    items.length < (lastPage?.pagination?.totalItems ?? total ?? 0);

  useEffect(() => {
    if (hasNextPage && !error) {
      void setSize(size + 1);
    }
  }, [error, hasNextPage, setSize, size]);

  return {
    items,
    error,
    isLoading:
      isLoading ||
      (!error && (hasNextPage || Boolean(data && data.length < size))),
    isValidating,
    retry: mutate
  };
}
