import type { Override } from "~/components/experiment/ExperimentOverrides";
import useSWR from "swr";

export const useOverrides = (
  experimentId: string
): {
  error: null | string;
  isLoading: boolean;
  overrides: Override[] | undefined;
  retry: () => void;
} => {
  const key = experimentId ? `/experiments/${experimentId}/overrides` : null;
  const { data, error: requestError, isLoading, mutate } = useSWR(key);

  const error =
    requestError || data?.status || !data?.data
      ? "Couldn’t load experiment overrides."
      : null;
  const overrides = (data?.data?.userIDOverrides ?? []).filter(
    (override: Override) => override.ids.length > 0
  );

  return {
    error,
    isLoading,
    overrides,
    retry: () => void mutate()
  };
};
