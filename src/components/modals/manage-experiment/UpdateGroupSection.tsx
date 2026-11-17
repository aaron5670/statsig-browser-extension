import { Button, Input } from "@heroui/react";
import { updateGroup } from "~/handlers/updateGroup";
import { useExperiment } from "~/hooks/useExperiment";
import { useStore } from "~/store/useStore";
import type { Group } from "~/types/statsig";
import { type FormEvent, useState } from "react";
import useSWRMutation from "swr/mutation";

export const UpdateGroupSection = ({
  group,
  onBack
}: {
  group: Group;
  onBack: () => void;
}) => {
  const currentItemId = useStore((state) => state.currentItemId);
  const { experiment } = useExperiment(currentItemId);
  const [groupName, setGroupName] = useState(group.name);
  const [error, setError] = useState("");

  const { isMutating, trigger } = useSWRMutation(
    `/experiments/${currentItemId}`,
    updateGroup
  );
  const canSave = Boolean(
    groupName.trim() &&
      groupName.trim() !== group.name &&
      experiment?.groups?.some(({ id }) => id === group.id)
  );

  const rename = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave || isMutating) return;
    setError("");

    const groups = experiment.groups.map((item) =>
      item.id === group.id ? { ...item, name: groupName.trim() } : item
    );

    try {
      const result = await trigger({ experimentId: currentItemId, groups });
      if (!result.success) throw new Error(result.error);
      onBack();
    } catch {
      setError(
        "Couldn’t rename the group. Check your permissions and try again."
      );
    }
  };

  return (
    <form onSubmit={rename} className="grid gap-4">
      <Input
        isRequired
        label="Group name"
        labelPlacement="outside"
        onValueChange={setGroupName}
        value={groupName}
        variant="bordered"
      />
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          isDisabled={isMutating}
          onPress={onBack}
          radius="sm"
          variant="bordered">
          Cancel
        </Button>
        <Button
          color="primary"
          isDisabled={!canSave}
          isLoading={isMutating}
          radius="sm"
          type="submit">
          Save group name
        </Button>
      </div>
    </form>
  );
};
