import { api } from "~/helpers/fetcher";

interface Props {
  arg: string;
}

export const initialLogin = async (url: string, { arg }: Props) => {
  const { status } = await api.get(url, {
    headers: { "STATSIG-API-KEY": arg },
    validateStatus: (status) =>
      status === 200 || status === 401 || status === 403
  });

  if (status === 200) {
    return { success: true };
  }

  return {
    success: false,
    error: "Statsig rejected this key. Check that it’s a valid Console API key."
  };
};
