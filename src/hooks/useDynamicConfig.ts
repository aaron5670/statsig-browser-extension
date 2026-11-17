import type { DynamicConfig } from "~/types/statsig";

import useSWR from "swr";

export const useDynamicConfig = (
  dynamicConfigId: string
): {
  dynamicConfig?: DynamicConfig;
  error: null | string;
  isLoading: boolean;
  retry: () => void;
} => {
  const key = dynamicConfigId
    ? `https://statsigapi.net/console/v1/dynamic_configs/${dynamicConfigId}`
    : null;
  const { data, error: requestError, isLoading, mutate } = useSWR(key);

  const error =
    requestError || data?.status || !data?.data
      ? "Couldn’t load dynamic config details."
      : null;
  const dynamicConfig = data?.data;

  return {
    dynamicConfig,
    error,
    isLoading,
    retry: () => void mutate()
  };
};
