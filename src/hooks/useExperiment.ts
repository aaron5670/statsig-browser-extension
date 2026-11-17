import type { Experiment } from "~/types/statsig";

import useSWR from "swr";

export const useExperiment = (
  experimentId: string
): {
  error: null | string;
  experiment?: Experiment;
  isLoading: boolean;
  retry: () => void;
} => {
  const key = experimentId ? `/experiments/${experimentId}` : null;
  const { data, error: requestError, isLoading, mutate } = useSWR(key);

  const error =
    requestError || data?.status || !data?.data
      ? "Couldn’t load experiment details."
      : null;
  const experiment = data?.data;

  return {
    error,
    experiment,
    isLoading,
    retry: () => void mutate()
  };
};
