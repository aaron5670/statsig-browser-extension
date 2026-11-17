import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useId, useState, type FormEvent } from "react";
import { useStore } from "~/store/useStore";
import DetailDialog from "../DetailDialog";

function SettingsForm({ onClose }: { onClose: () => void }) {
  const [savedKey, setKey] = useLocalStorage("statsig-local-storage-key", "");
  const [savedApiType, setApiType] = useLocalStorage(
    "statsig-type-api-key",
    "read-key"
  );
  const [savedStorage, setStorage] = useLocalStorage(
    "statsig-storage-type",
    "localStorage"
  );
  const [key, setKeyDraft] = useState(savedKey);
  const [storage, setStorageDraft] = useState(savedStorage);
  const [apiType, setApiTypeDraft] = useState(savedApiType);
  const [invalid, setInvalid] = useState(false);
  const formId = useId();
  const storageLabel = storage === "cookie" ? "Cookie" : "Local storage";

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!key.trim()) {
      setInvalid(true);
      event.currentTarget
        .querySelector<HTMLInputElement>("input[name=storageKey]")
        ?.focus();
      return;
    }

    setKey(key);
    setStorage(storage);
    setApiType(apiType);
    onClose();
  }

  return (
    <DetailDialog
      description="Configure override storage and your console key type."
      footer={
        <>
          <Button
            className="min-h-9"
            onPress={onClose}
            radius="sm"
            size="sm"
            variant="bordered">
            {savedKey ? "Cancel" : "Set up later"}
          </Button>
          <Button
            className="min-h-9"
            color="primary"
            form={formId}
            radius="sm"
            size="sm"
            type="submit">
            Save settings
          </Button>
        </>
      }
      isOpen
      onClose={onClose}
      size="compact"
      title="Settings">
      <form
        className="grid gap-4 sm:gap-5"
        id={formId}
        onSubmit={handleSave}
        noValidate>
        <RadioGroup
          classNames={{
            label: "text-sm font-medium text-foreground",
            wrapper: "gap-x-4 gap-y-1"
          }}
          label="Override storage"
          onValueChange={setStorageDraft}
          orientation="horizontal"
          size="sm"
          value={storage}>
          <Radio value="localStorage">Local storage</Radio>
          <Radio value="cookie">Cookie</Radio>
        </RadioGroup>

        <Input
          autoComplete="off"
          classNames={{
            label: "text-sm font-medium text-foreground",
            input: "placeholder:text-foreground-600",
            inputWrapper:
              "min-h-9 border border-divider bg-background shadow-none",
            description: "text-xs text-default-600"
          }}
          description={`Example: ${storage === "cookie" ? "statsig_user_id" : "FEATURE_MANAGEMENT_USER_ID"}`}
          errorMessage={`Enter a ${storageLabel.toLowerCase()} key.`}
          isInvalid={invalid}
          isRequired
          label={`${storageLabel} key`}
          labelPlacement="outside"
          name="storageKey"
          onValueChange={(value) => {
            setKeyDraft(value);
            setInvalid(false);
          }}
          placeholder="Enter the key used by your site"
          radius="sm"
          size="sm"
          value={key}
          variant="bordered"
        />

        <RadioGroup
          classNames={{
            label: "text-sm font-medium text-foreground",
            description: "text-xs text-default-600",
            wrapper: "gap-x-4 gap-y-1"
          }}
          description="Match the permissions of your Statsig console key."
          label="Console key type"
          onValueChange={setApiTypeDraft}
          orientation="horizontal"
          size="sm"
          value={apiType}>
          <Radio value="read-key">Read-only</Radio>
          <Radio value="write-key">Read and write</Radio>
        </RadioGroup>
      </form>
    </DetailDialog>
  );
}

export default function SettingsSheet({
  onDismiss
}: {
  onDismiss?: () => void;
}) {
  const { isSettingsSheetOpen, setSettingsSheetOpen } = useStore(
    (state) => state
  );
  return isSettingsSheetOpen ? (
    <SettingsForm
      onClose={() => {
        setSettingsSheetOpen(false);
        onDismiss?.();
      }}
    />
  ) : null;
}
