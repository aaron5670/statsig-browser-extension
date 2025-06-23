import type {FeatureGate} from "~types/statsig";

import useSWR from "swr";

export const useFeatureGate = (featureGateId: string): {
  featureGate?: FeatureGate,
  error: null | string,
  isLoading: boolean,
} => {
  const key = featureGateId ? `https://statsigapi.net/console/v1/gates/${featureGateId}` : null;
  const {data, isLoading} = useSWR(key);

  const error = data?.status || !data?.data ? 'An error occurred while fetching feature gate data.' : null;
  const featureGate = data?.data;

  return {
    featureGate,
    error,
    isLoading,
  };
}; 