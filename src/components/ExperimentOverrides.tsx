import {Button} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {updateLocalStorageValue} from "~handlers/localStorageHandlers";
import React, {Fragment} from "react";
import {Tooltip} from "react-tooltip";

export type Override = {
  environment?: string;
  groupID: string;
  ids: string[];
}

interface Props {
  overrides: Override[];
}

export const ExperimentOverrides = ({overrides}: Props) => {
  const [localStorageValue] = useLocalStorage("statsig-local-storage-key");

  if (!overrides.length) {
    return (
      <div className="flex justify-center my-5">
        <p className="text-sm text-gray-700">
          No overrides found. You can create overrides for this experiment in the Statsig Console.
        </p>
      </div>
    )
  }

  const saveToLocalStorage = (value: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateLocalStorageValue(tabs[0].id, localStorageValue, value);
    });
  };

  return (
    <div>
      <h3 className="text-lg font-bold mt-5">Experiment overrides</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {overrides?.map((override) => (
          <Fragment key={override.ids[0]}>
            <Button
              color={override.groupID === 'Control' ? 'default' : 'success'}
              data-tooltip-id={`tooltip-${override.ids[0]}`}
              onPress={() => saveToLocalStorage(override.ids[0])}
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
}
