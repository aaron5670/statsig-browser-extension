import { useStatsigList } from "~/hooks/useStatsigList";
import type { FeatureGate } from "~/types/statsig";

export const useFeatureGates = () => {
  const { items, error, isLoading } = useStatsigList<FeatureGate>("/gates");

  return {
    featureGates: items,
    error: error ? "An error occurred while fetching feature gate data." : null,
    isLoading
  };
};
