import {type Override} from "~components/experiment/ExperimentOverrides";
import {fetcher} from "~helpers/fetcher";
import useSWR from "swr";

export const useOverrides = (experimentId: string): {
  error: null | string,
  isLoading: boolean,
  overrides: Override[] | undefined
} => {
  const key = experimentId ? `https://statsigapi.net/console/v1/experiments/${experimentId}/overrides` : null;
  const {data, isLoading} = useSWR(key, fetcher);

  const error = data?.status || !data?.data ? 'An error occurred while fetching experiment overrides.' : null;
  const overrides = data?.data?.userIDOverrides.filter((override) => override.ids.length > 0);

  return {
    error,
    isLoading,
    overrides,
  };
};
