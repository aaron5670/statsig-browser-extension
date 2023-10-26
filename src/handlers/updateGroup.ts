import type {Group} from "~types/statsig";

import {api} from "~helpers/fetcher";
import {mutate} from "swr";

export const updateGroup = async (url: string, {arg}: { arg: { experimentId: string, groups: Group[] } }) => {
  const {experimentId, groups} = arg;
  const {data, status} = await api.patch(url, {
    groups
  });

  let error: string;
  if (status === 401) {
    error = "Invalid Statsig Console API Key, please try again with a valid key.";
  }

  if (status === 200) {
    await mutate(`/experiments/${experimentId}`, data);
  }

  return {
    data: data.data,
    error,
    success: !!data
  };
};
