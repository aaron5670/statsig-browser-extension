import type {FeatureGate} from "~types/statsig";

import {useLocalStorage} from "@uidotdev/usehooks";
import {api} from "~helpers/fetcher";
import {useEffect, useState} from "react";
import useSWR from "swr";

const limit = 100;

export const useFeatureGates = (): {
    featureGates: FeatureGate[],
    error: null | string,
    isLoading: boolean,
} => {
    const [page, setPage] = useState(1);
    const [featureGates, setFeatureGates] = useState<FeatureGate[]>([]);
    const [apiKey] = useLocalStorage("statsig-console-api-key");

    const { data, error, isLoading } = useSWR(apiKey ? ['/gates', page] : null, () =>
        api.get('/gates', {
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
    if (data?.data && data?.pagination?.totalItems > featureGates.length) {
      setFeatureGates(prev => [...prev, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    if (data?.pagination?.totalItems && featureGates.length < data.pagination.totalItems) {
      setPage(prev => prev + 1);
    }
  }, [featureGates]);

  const fetchError = error ? 'An error occurred while fetching feature gate data.' : null;

  return {
    featureGates,
    error: fetchError,
    isLoading,
    };
}; 