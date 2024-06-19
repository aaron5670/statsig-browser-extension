import type {DynamicConfig} from "~types/statsig";

import {useLocalStorage} from "@uidotdev/usehooks";
import {api} from "~helpers/fetcher";
import {useEffect, useState} from "react";
import useSWR from "swr";

const limit = 100;

export const useDynamicConfigs = (): {
    dynamicConfigs: DynamicConfig[],
    error: null | string,
    isLoading: boolean,
} => {
    const [page, setPage] = useState(1);
    const [dynamicConfigs, setDynamicConfigs] = useState<DynamicConfig[]>([]);
    const [apiKey] = useLocalStorage("statsig-console-api-key");

    const { data, error, isLoading } = useSWR(apiKey ? ['/dynamic_configs', page] : null, () =>
        api.get('/dynamic_configs', {
            headers: {
                "STATSIG-API-KEY": apiKey as string,
            },
            params: {
                limit,
                page,
            }
        }).then(res => res.data)
            .catch(err => err)
    );

  useEffect(() => {
    if (data?.data && data?.pagination?.totalItems > dynamicConfigs.length) {
      setDynamicConfigs(prev => [...prev, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    if (data?.pagination?.totalItems && dynamicConfigs.length < data.pagination.totalItems) {
      setPage(prev => prev + 1);
    }
  }, [dynamicConfigs]);

  const fetchError = error ? 'An error occurred while fetching experiment data.' : null;

  return {
    dynamicConfigs,
    error: fetchError,
    isLoading,
    };
};
