interface Props {
  arg: string;
}

export const handleInitialLogin = async (url: string, {arg}: Props) => {
  const response = await fetch(url, {
    headers: {
      'STATSIG-API-KEY': arg,
    },
    method: 'GET'
  });

  const data = await response.json();

  let error: string;
  if (data?.status === 401) {
    error = "Invalid Statsig Console API Key, please try again with a valid key.";
  } else if (data?.status) {
    error = "An unknown error occurred, please try again.";
  }

  return {
    data: data?.data,
    error,
    success: !!data?.data
  };
};
