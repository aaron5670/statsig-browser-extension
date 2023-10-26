import {api} from "~helpers/fetcher";
import {mutate} from "swr";

interface Props {
  arg: string;
}

export const initialLogin = async (url: string, {arg}: Props) => {
  const {data, status} = await api.get(url, {
    headers: {
      "STATSIG-API-KEY": arg,
    }
  });

  let error: string;
  if (status === 401) {
    error = "Invalid Statsig Console API Key, please try again with a valid key.";
  } else if (status !== 200) {
    error = "An unknown error occurred, please try again.";
  }

  if (status === 200 && data?.data) {
    await mutate(url, data.data, false);
  }

  return {
    data: data?.data,
    error,
    success: status === 200,
  };
};
