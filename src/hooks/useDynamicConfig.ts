import type {DynamicConfig} from "~types/statsig";

import useSWR from "swr";

export const useDynamicConfig = (dynamicConfigId: string): {
  dynamicConfig?: DynamicConfig,
  error: null | string,
  isLoading: boolean,
} => {
  const key = dynamicConfigId ? `https://statsigapi.net/console/v1/dynamic_configs/${dynamicConfigId}` : null;
  const {data, isLoading} = useSWR(key);

  const error = data?.status || !data?.data ? 'An error occurred while fetching dynamic config data.' : null;
  const dynamicConfig = data?.data;

  return {
    dynamicConfig,
    error,
    isLoading,
  };
};
