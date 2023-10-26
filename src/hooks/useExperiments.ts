import type {Experiment} from "~types/statsig";

import {useLocalStorage} from "@uidotdev/usehooks";
import {api} from "~helpers/fetcher";
import useSWR from "swr";

export const useExperiments = (): {
  error: null | string,
  experiments: Experiment[],
  isLoading: boolean,
} => {
  const [apiKey] = useLocalStorage("statsig-console-api-key");
  const {data, isLoading} = useSWR(apiKey ? '/experiments' : null, () => api.get('/experiments', {
    headers: {
      "STATSIG-API-KEY": apiKey as string,
    }
  }).then(res => res.data)
    .catch(err => err)
  );

  const error = data?.status || !data?.data ? 'An error occurred while fetching experiment data.' : null;
  const experiments = data?.data || [];

  return {
    error,
    experiments,
    isLoading,
  };
};
