import type {Experiment} from "~types/statsig";

import {fetcher} from "~helpers/fetcher";
import useSWR from "swr";

export const useExperiment = (experimentId: string): {
  error: null | string,
  experiment?: Experiment,
  isLoading: boolean,
} => {
  const key = experimentId ? `https://statsigapi.net/console/v1/experiments/${experimentId}` : null;
  const {data, isLoading} = useSWR(key, fetcher);

  const error = data?.status || !data?.data ? 'An error occurred while fetching experiment data.' : null;
  const experiment = data?.data;

  return {
    error,
    experiment,
    isLoading,
  };
};
