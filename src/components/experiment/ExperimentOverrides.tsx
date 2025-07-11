import type { Dispatch, SetStateAction } from "react";

import { Button } from "@nextui-org/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { NoOverridesSection } from "~components/experiment/NoOverridesSection";
import { getCurrentStorageValue, updateStorageValue } from "~handlers/localStorageHandlers";
import { useStore } from "~store/useStore";
import React, { Fragment, useEffect } from "react";
import { Tooltip } from "react-tooltip";

export type Override = {
  environment?: string;
  groupID: string;
  ids: string[];
}

interface Props {
  overrides: Override[];
}

export const ExperimentOverrides = ({ overrides }: Props) => {
  const { currentItemId, currentLocalStorageValue, setCurrentLocalStorageValue } = useStore((state) => state);
  const [localStorageValue]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-local-storage-key");
  const [storageType]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-storage-type", "localStorage");
  const [, setCurrentOverrides] = useLocalStorage("statsig-current-overrides");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const [storage] = await getCurrentStorageValue(tabs[0].id, localStorageValue, storageType as 'cookie' | 'localStorage');
      if (storage?.result) {
        setCurrentLocalStorageValue(storage.result);
      }
    });
  }, []);

  if (!overrides.length) {
    return <NoOverridesSection experimentationId={currentItemId} />;
  }

  const saveToLocalStorage = (value: string) => {
    // Store all overrides in local storage, so we can easily toggle between them later
    setCurrentOverrides(overrides.map((override) => ({ name: override.ids[0] })));

    // Save the selected override to storage
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      setCurrentLocalStorageValue(value);
      await updateStorageValue(tabs[0].id, localStorageValue, value, storageType as 'cookie' | 'localStorage');
    });
  };

  return (
    <div>
      <h3 className="text-lg font-bold">Experiment overrides</h3>
      <p className="text-sm text-gray-700">
        Here you can view and inject an override to your local storage.
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {overrides.map((override) => (
          <Fragment key={override.ids[0]}>
            <Button
              color={currentLocalStorageValue === override.ids[0] ? 'success' : 'default'}
              data-tooltip-id={`tooltip-${override.ids[0]}`}
              onPress={() => saveToLocalStorage(override.ids[0])}
              size="sm"
              variant="flat"
            >
              {override.ids[0]}
            </Button>
            <Tooltip
              content={override.environment === null ? 'All environments' : override.environment}
              id={`tooltip-${override.ids[0]}`}
              opacity={1}
              place="top"
              variant="dark"
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
