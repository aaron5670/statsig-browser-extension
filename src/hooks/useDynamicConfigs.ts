import { useStatsigList } from "~/hooks/useStatsigList";
import type { DynamicConfig } from "~/types/statsig";

export const useDynamicConfigs = () => {
  const { items, error, isLoading } =
    useStatsigList<DynamicConfig>("/dynamic_configs");

  return {
    dynamicConfigs: items,
    error: error
      ? "An error occurred while fetching dynamic config data."
      : null,
    isLoading
  };
};
