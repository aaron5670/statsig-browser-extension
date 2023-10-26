import type {Override} from "~components/experiment/ExperimentOverrides";

import {api} from "~helpers/fetcher";
import {mutate} from "swr";

export const createOverride = async (url: string, {arg}: { arg: { experimentId: string, override: Override } }) => {
  const {experimentId, override} = arg;

  const {data, status} = await api.patch(url, {
    overrides: [],
    userIDOverrides: [override]
  });

  let error: string;
  if (status === 401) {
    error = "Invalid Statsig Console API Key, please try again with a valid key.";
  }

  const overrides = data?.data?.userIDOverrides
    .filter((override) => override.ids.length > 0)
    .map((override) => ({...override, environment: null}));

  if (status === 200) {
    await mutate(`/experiments/${experimentId}/overrides`, data);
  }

  return {
    data: overrides,
    error,
    success: !!data
  };
};
