import useSWR from "swr";

export interface GateOverrideData {
  passingUserIDs: string[];
  failingUserIDs: string[];
  passingCustomIDs?: string[];
  failingCustomIDs?: string[];
  environmentOverrides: {
    environment: string | null;
    unitID: string | null;
    passingIDs: string[];
    failingIDs: string[];
  }[];
}

export const useGateOverrides = (
  gateId: string
): {
  error: null | string;
  isLoading: boolean;
  overrides: GateOverrideData | undefined;
  retry: () => void;
} => {
  const key = gateId
    ? `https://statsigapi.net/console/v1/gates/${gateId}/overrides`
    : null;
  const { data, error: requestError, isLoading, mutate } = useSWR(key);

  const error =
    requestError || data?.status || !data?.data
      ? "Couldn’t load feature gate overrides."
      : null;
  const overrides = data?.data;

  return {
    error,
    isLoading,
    overrides,
    retry: () => void mutate()
  };
};
