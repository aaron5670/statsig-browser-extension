import axios from 'axios';

const apiKey = localStorage.getItem('statsig-console-api-key');

export const api = axios.create({
  baseURL: 'https://statsigapi.net/console/v1',
  headers: {
    'STATSIG-API-KEY': apiKey?.replaceAll('"', ''),
  }
});

export const fetcher = (url: string) => api.get(url).then((res) => res.data);
