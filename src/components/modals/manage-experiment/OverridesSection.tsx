import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import OverridesTable from "~components/tables/OverridesTable";
import {createOverride} from "~handlers/createOverride";
import {useExperiment} from "~hooks/useExperiment";
import {useStore} from "~store/useStore";
import React, {useState} from "react";
import useSWRMutation from "swr/mutation";

type View = 'form' | 'table';

export const OverridesSection = () => {
  const [typeApiKey] = useLocalStorage("statsig-type-api-key", 'read-key');
  const [view, setView] = useState<View>('table');
  const {currentExperimentId} = useStore((state) => state);
  const {experiment} = useExperiment(currentExperimentId);
  const groups = experiment?.groups || [];

  const [selectedGroup, setSelectedGroup] = useState('');
  const [overrideId, setOverrideId] = useState('');

  const {isMutating, trigger} = useSWRMutation(`/experiments/${currentExperimentId}/overrides`, createOverride);

  const addOverride = async () => {
    await trigger({experimentId: currentExperimentId, override: {groupID: selectedGroup, ids: [overrideId]}});

    setView('table');
  };

  return (
    <div className="flex flex-col justify-between gap-4">
      {view === 'table' ? (
        <>
          <OverridesTable/>
          {typeApiKey === 'write-key' && (
            <Button
              color="success"
              fullWidth
              onClick={() => setView((state) => state === 'table' ? 'form' : 'table')}
              size="md"
              style={{color: '#FFF'}}
            >
              Create override
            </Button>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <Select
            className="w-full"
            label="Select a group"
            onChange={(event) => setSelectedGroup(event.target.value)}
            placeholder="Select a group"
          >
            {groups.map((group) => (
              <SelectItem key={group.name} value={group.name}>
                {group.name}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Override ID"
            onChange={(e) => setOverrideId(e.target.value)}
            placeholder="Enter a override ID"
            type="text"
            value={overrideId}
          />

          <div className="flex justify-end gap-4">
            <Button
              color="danger"
              onClick={() => setView('table')}
              size="md"
              style={{color: '#FFF'}}
            >
              Back
            </Button>
            <Button
              color="success"
              isLoading={isMutating}
              onClick={addOverride}
              size="md"
              style={{color: '#FFF'}}
            >
              Add override
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
