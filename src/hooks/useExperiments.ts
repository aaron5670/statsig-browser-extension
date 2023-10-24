import {fetcher} from "~helpers/fetcher";
import useSWR from "swr";

type Experiment = {
  hypothesis: string,
  id: string,
  name: string,
}

export const useExperiment = (experimentId: string): {
  error: null | string,
  experiment: Experiment | undefined,
  isLoading: boolean,
} => {
  const key = experimentId ? `https://statsigapi.net/console/v1/experiments/${experimentId}` : null;
  const {data, isLoading} = useSWR(key, fetcher)

  const error = data?.status || !data?.data ? 'An error occurred while fetching experiment data.' : null;
  const experiment = data?.data;

  return {
    error,
    experiment,
    isLoading,
  }
}
