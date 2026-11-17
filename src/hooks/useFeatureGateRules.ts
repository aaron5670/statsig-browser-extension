import useSWR from "swr";

export interface FeatureGateRule {
  id: string;
  baseID: string;
  name: string;
  passPercentage: number;
  conditions: Array<{
    type: string;
  }>;
  environments: string[];
}

export const useFeatureGateRules = (
  featureGateId: string
): {
  rules: FeatureGateRule[];
  error: null | string;
  isLoading: boolean;
  retry: () => void;
} => {
  const key = featureGateId ? `/gates/${featureGateId}/rules` : null;
  const { data, error: requestError, isLoading, mutate } = useSWR(key);

  const error =
    requestError || data?.status || !data?.data ? "Couldn’t load rules." : null;
  const rules = data?.data?.[0]?.rules || [];

  return {
    rules,
    error,
    isLoading,
    retry: () => void mutate()
  };
};
