import axios from "axios";

export const api = axios.create({
  baseURL: "https://statsigapi.net/console/v1"
});

api.interceptors.request.use((request) => {
  const apiKey = localStorage.getItem("statsig-console-api-key");
  if (apiKey && !request.headers.has("STATSIG-API-KEY")) {
    request.headers.set("STATSIG-API-KEY", apiKey.replaceAll('"', ""));
  }
  return request;
});

export const fetcher = (url: string) => api.get(url).then((res) => res.data);
