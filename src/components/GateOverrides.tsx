import type { Dispatch, SetStateAction } from "react";
import { Button } from "@nextui-org/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { getCurrentStorageValue, removeStorageValue, updateStorageValue } from "~handlers/localStorageHandlers";
import { useStore } from "~store/useStore";
import React, { Fragment, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { GateOverride } from "~types/statsig";

interface Props {
  overrides: GateOverride;
}

export const GateOverrides = ({ overrides }: Props) => {
  const { currentItemId, currentLocalStorageValue, setCurrentLocalStorageValue } = useStore((state) => state);
  const [localStorageValue]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-local-storage-key");
  const [storageType]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-storage-type", "localStorage");
  const [, setCurrentOverrides] = useLocalStorage("statsig-current-overrides");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        const [storage] = await getCurrentStorageValue(tabs[0].id, localStorageValue, storageType as 'cookie' | 'localStorage');
        if (storage?.result) {
          setCurrentLocalStorageValue(storage.result);
        }
      }
    });
  }, []);

  const saveToLocalStorage = (value: string) => {
    // Store all overrides in local storage, so we can easily toggle between them later
    const allOverrideIds = [
      ...overrides.passingUserIDs,
      ...overrides.failingUserIDs,
      ...(overrides.passingCustomIDs || []),
      ...(overrides.failingCustomIDs || [])
    ];
    setCurrentOverrides(allOverrideIds.map((id) => ({ name: id })));

    // Save the selected override to storage
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        setCurrentLocalStorageValue(value);
        await updateStorageValue(tabs[0].id, localStorageValue, value, storageType as 'cookie' | 'localStorage');
      }
    });
  };

  const clearOverride = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        setCurrentLocalStorageValue("");
        await removeStorageValue(tabs[0].id, localStorageValue, storageType as 'cookie' | 'localStorage');
      }
    });
  };

  const hasOverrides = overrides.passingUserIDs.length > 0 ||
    overrides.failingUserIDs.length > 0 ||
    (overrides.passingCustomIDs && overrides.passingCustomIDs.length > 0) ||
    (overrides.failingCustomIDs && overrides.failingCustomIDs.length > 0);

  if (!hasOverrides) {
    return null;
  }

  const hasActiveOverride = Boolean(currentLocalStorageValue);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold">Gate overrides</h3>
        {hasActiveOverride && (
          <>
            <Button
              color="default"
              onPress={clearOverride}
              size="sm"
              variant="light"
              data-tooltip-id="clear-override-tooltip"
            >
              Clear
            </Button>
            <Tooltip
              content="Clear the active override"
              id="clear-override-tooltip"
              opacity={1}
              place="top"
              variant="dark"
            />
          </>
        )}
      </div>
      <p className="text-sm text-gray-700 mb-3">
        Here you can view and inject an override to your local storage.
      </p>

      {overrides.passingUserIDs.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 uppercase mb-1.5">Passing User IDs</p>
          <div className="flex flex-wrap gap-2">
            {overrides.passingUserIDs.map((id) => (
              <Fragment key={id}>
                <Button
                  color={currentLocalStorageValue === id ? 'success' : 'default'}
                  data-tooltip-id={`tooltip-pass-${id}`}
                  onPress={() => saveToLocalStorage(id)}
                  size="sm"
                  variant="flat"
                >
                  {id}
                </Button>
                <Tooltip
                  content="Passing User ID"
                  id={`tooltip-pass-${id}`}
                  opacity={1}
                  place="top"
                  variant="dark"
                />
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {overrides.failingUserIDs.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase mb-1.5">Failing User IDs</p>
          <div className="flex flex-wrap gap-2">
            {overrides.failingUserIDs.map((id) => (
              <Fragment key={id}>
                <Button
                  color={currentLocalStorageValue === id ? 'danger' : 'default'}
                  data-tooltip-id={`tooltip-fail-${id}`}
                  onPress={() => saveToLocalStorage(id)}
                  size="sm"
                  variant="flat"
                >
                  {id}
                </Button>
                <Tooltip
                  content="Failing User ID"
                  id={`tooltip-fail-${id}`}
                  opacity={1}
                  place="top"
                  variant="dark"
                />
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
