export const fetcher = (url: string) => {
  const apiKey = localStorage.getItem('statsig-console-api-key');

  return fetch(url, {
    headers: {
      'STATSIG-API-KEY': apiKey.replaceAll('"', ''),
    }
  }).then((res) => res.json())
};
