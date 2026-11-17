import { Button, Input } from "@heroui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import OverridesTable from "~/components/tables/OverridesTable";
import { createOverride } from "~/handlers/createOverride";
import { useExperiment } from "~/hooks/useExperiment";
import { useStore } from "~/store/useStore";
import { type FormEvent, useState } from "react";
import useSWRMutation from "swr/mutation";

export const OverridesSection = () => {
  const [typeApiKey] = useLocalStorage("statsig-type-api-key", "read-key");
  const [isCreating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const currentItemId = useStore((state) => state.currentItemId);
  const { experiment } = useExperiment(currentItemId);
  const groups = experiment?.groups ?? [];

  const [selectedGroup, setSelectedGroup] = useState("");
  const [overrideId, setOverrideId] = useState("");

  const { isMutating, trigger } = useSWRMutation(
    `/experiments/${currentItemId}/overrides`,
    createOverride
  );

  const addOverride = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedGroup || !overrideId.trim() || isMutating) return;
    setFormError("");

    try {
      const result = await trigger({
        experimentId: currentItemId,
        override: { groupID: selectedGroup, ids: [overrideId.trim()] }
      });
      if (!result.success) throw new Error(result.error);

      setNotice("Override created.");
      setCreating(false);
    } catch {
      setFormError(
        "Couldn’t create the override. Check your permissions and try again."
      );
    }
  };

  if (!isCreating) {
    return (
      <div className="grid gap-3">
        <div
          role="status"
          className={notice ? "text-sm text-default-700" : "sr-only"}>
          {notice}
        </div>
        <OverridesTable />
        {typeApiKey === "write-key" && (
          <div className="justify-self-end">
            <Button
              color="primary"
              isDisabled={!groups.length}
              onPress={() => {
                setSelectedGroup("");
                setOverrideId("");
                setFormError("");
                setNotice("");
                setCreating(true);
              }}
              radius="sm"
              size="sm"
              className="min-h-9">
              Create override
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={addOverride} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        Experiment group
        <select
          className="min-h-10 w-full rounded-small border border-default-300 bg-background px-3 text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-focus"
          onChange={(event) => setSelectedGroup(event.target.value)}
          required
          value={selectedGroup}>
          <option disabled value="">
            Select a group
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>
      </label>
      <Input
        isRequired
        label="Override ID"
        labelPlacement="outside"
        onValueChange={setOverrideId}
        value={overrideId}
        variant="bordered"
      />
      {formError && (
        <p className="text-sm text-danger" role="alert">
          {formError}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          isDisabled={isMutating}
          onPress={() => setCreating(false)}
          radius="sm"
          variant="bordered">
          Cancel
        </Button>
        <Button
          color="primary"
          isDisabled={!selectedGroup || !overrideId.trim()}
          isLoading={isMutating}
          radius="sm"
          type="submit">
          Create override
        </Button>
      </div>
    </form>
  );
};
