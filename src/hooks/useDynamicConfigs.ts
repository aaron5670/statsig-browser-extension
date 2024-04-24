import type {DynamicConfig} from "~types/statsig";

import {useLocalStorage} from "@uidotdev/usehooks";
import {api} from "~helpers/fetcher";
import useSWR from "swr";

export const useDynamicConfigs = (): {
  error: null | string,
  dynamicConfigs: DynamicConfig[],
  isLoading: boolean,
} => {
  const [apiKey] = useLocalStorage("statsig-console-api-key");
  const {data, isLoading} = useSWR(apiKey ? '/dynamic_configs' : null, () => api.get('/dynamic_configs', {
    headers: {
      "STATSIG-API-KEY": apiKey as string,
    }
  }).then(res => res.data)
    .catch(err => err)
  );

  const error = data?.status || !data?.data ? 'An error occurred while fetching dynamic configs data.' : null;
  const dynamicConfigs = data?.data || [];

  return {
    error,
    dynamicConfigs,
    isLoading,
  };
};
