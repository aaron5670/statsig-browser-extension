import { useStatsigList } from "~/hooks/useStatsigList";
import type { Experiment } from "~/types/statsig";

export const useExperiments = () => {
  const { items, error, isLoading } =
    useStatsigList<Experiment>("/experiments");

  return {
    experiments: items,
    error: error ? "An error occurred while fetching experiment data." : null,
    isLoading
  };
};
