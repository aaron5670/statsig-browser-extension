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

export const useFeatureGateRules = (featureGateId: string): {
  rules: FeatureGateRule[];
  error: null | string;
  isLoading: boolean;
} => {
  const key = featureGateId ? `/gates/${featureGateId}/rules` : null;
  const { data, isLoading } = useSWR(key);

  const error = data?.status || !data?.data ? null : null;
  const rules = data?.data?.[0]?.rules || [];

  return {
    rules,
    error,
    isLoading,
  };
}; 