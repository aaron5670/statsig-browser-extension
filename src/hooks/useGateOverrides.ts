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

export const useGateOverrides = (gateId: string): {
  error: null | string,
  isLoading: boolean,
  overrides: GateOverrideData | undefined
} => {
  const key = gateId ? `https://statsigapi.net/console/v1/gates/${gateId}/overrides` : null;
  const { data, isLoading } = useSWR(key);

  const error = data?.status || !data?.data ? 'An error occurred while fetching gate overrides.' : null;
  const overrides = data?.data;

  return {
    error,
    isLoading,
    overrides,
  };
};
