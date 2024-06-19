import type { Experiment } from "~types/statsig";

import { useLocalStorage } from "@uidotdev/usehooks";
import { api } from "~helpers/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";

const limit = 100;

export const useExperiments = (): {
  error: null | string,
  experiments: Experiment[],
  isLoading: boolean,
} => {
  const [page, setPage] = useState(1);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [apiKey] = useLocalStorage("statsig-console-api-key");

  const { data, error, isLoading } = useSWR(apiKey ? ['/experiments', page] : null, ([url, page]) =>
      api.get(url, {
        headers: {
          "STATSIG-API-KEY": apiKey as string,
        },
        params: {
          limit,
          page,
        }
      }).then(res => res.data)
          .catch(err => err)
  );

  useEffect(() => {
    if (data?.data && data?.pagination?.totalItems > experiments.length) {
      setExperiments(prev => [...prev, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    if (data?.pagination?.totalItems && experiments.length < data.pagination.totalItems) {
      setPage(prev => prev + 1);
    }
  }, [experiments]);

  const fetchError = error ? 'An error occurred while fetching experiment data.' : null;

  return {
    error: fetchError,
    experiments,
    isLoading,
  };
};
