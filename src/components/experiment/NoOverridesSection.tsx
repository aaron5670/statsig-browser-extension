import {Button} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {ManageExperimentSection} from "~components/experiment/ManageExperimentSection";
import {ExternalLinkIcon} from "~components/icons/ExternalLinkIcon";
import React from "react";

interface Props {
  experimentationId: string;
}

export const NoOverridesSection = ({experimentationId}: Props) => {
  const [typeApiKey] = useLocalStorage("statsig-type-api-key", 'read-key');

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-sm text-gray-700 text-center mb-1">
        <span className="font-semibold">No overrides found.</span><br/>
        {typeApiKey === 'read-key' ? (
          <i>You can create overrides for this experiment in the Statsig Console.</i>
        ) : (
          <i>Click the button below to create experiment overrides.</i>
        )}
      </p>

      {typeApiKey === 'read-key' && (
        <Button
          as="a"
          color="primary"
          endContent={<ExternalLinkIcon color={'white'}/>}
          href={`https://console.statsig.com/experiments/${experimentationId}/setup`}
          size="sm"
          target="_blank"
          variant="solid"
        >
          Manage overrides
        </Button>
      )}

      {typeApiKey === 'write-key' && (
        <ManageExperimentSection/>
      )}
    </div>
  );
};
