import type {Group} from "~types/statsig";

import {Button, Input} from "@nextui-org/react";
import {updateGroup} from "~handlers/updateGroup";
import {useExperiment} from "~hooks/useExperiment";
import {useStore} from "~store/useStore";
import {produce} from "immer";
import React, {useState} from "react";
import useSWRMutation from "swr/mutation";

export const UpdateGroupSection = ({changeView, group}: {changeView: () => void, group: Group}) => {
  const {currentExperimentId} = useStore((state) => state);
  const {experiment} = useExperiment(currentExperimentId);
  const groups = experiment?.groups || [];
  const [groupName, setGroupName] = useState(group.name);

  const {isMutating, trigger} = useSWRMutation(`/experiments/${currentExperimentId}`, updateGroup);

  const handleGroupUpdate = async () => {
    const nextState = produce(groups, draft => {
      draft.find((g) => g.id === group.id).name = groupName;
    });

    await trigger({experimentId: currentExperimentId, groups: nextState}, {
      optimisticData: () => ({nextState})
    });

    changeView();
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Override ID"
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter a override ID"
        type="text"
        value={groupName}
      />

      <div className="flex justify-end gap-4">
        <Button
          color="danger"
          onClick={changeView}
          size="md"
          style={{color: '#FFF'}}
        >
          Back
        </Button>
        <Button
          color="success"
          isLoading={isMutating}
          onClick={handleGroupUpdate}
          size="md"
          style={{color: '#FFF'}}
        >
          Update group
        </Button>
      </div>
    </div>
  );
};
