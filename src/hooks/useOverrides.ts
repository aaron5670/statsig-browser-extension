import {type Override} from "~components/experiment/ExperimentOverrides";
import useSWR from "swr";

export const useOverrides = (experimentId: string): {
  error: null | string,
  isLoading: boolean,
  overrides: Override[] | undefined
} => {
  const key = experimentId ? `/experiments/${experimentId}/overrides` : null;
  const {data, isLoading} = useSWR(key);

  const error = data?.status || !data?.data ? 'An error occurred while fetching experiment overrides.' : null;
  const overrides = data?.data?.userIDOverrides.filter((override) => override.ids.length > 0);

  return {
    error,
    isLoading,
    overrides,
  };
};
