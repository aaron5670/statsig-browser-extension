import type { FeatureGate } from "~/types/statsig";

import useSWR from "swr";

export const useFeatureGate = (
  featureGateId: string
): {
  featureGate?: FeatureGate;
  error: null | string;
  isLoading: boolean;
  retry: () => void;
} => {
  const key = featureGateId
    ? `https://statsigapi.net/console/v1/gates/${featureGateId}`
    : null;
  const { data, error: requestError, isLoading, mutate } = useSWR(key);

  const error =
    requestError || data?.status || !data?.data
      ? "Couldn’t load feature gate details."
      : null;
  const featureGate = data?.data;

  return {
    featureGate,
    error,
    isLoading,
    retry: () => void mutate()
  };
};
