import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useStore } from "~store/useStore";
import React, { useState } from 'react';
import { Sheet } from 'react-modal-sheet';

const SettingsSheet = () => {
  const { isSettingsSheetOpen, setSettingsSheetOpen } = useStore((state) => state);
  const [localStorageValue, setLocalStorageKey] = useLocalStorage("statsig-local-storage-key", '');
  const [typeApiKey, setTypeApiKey] = useLocalStorage("statsig-type-api-key", 'read-key');
  const [storageType, setStorageType] = useLocalStorage("statsig-storage-type", 'localStorage');
  const [value, setValue] = useState(localStorageValue);
  const [invalid, setInvalid] = useState(false);

  const handleSave = () => {
    if (value === '') {
      setInvalid(true);
      return;
    }

    setLocalStorageKey(value);
    setSettingsSheetOpen(false);
  };

  const handleClose = () => {
    if (localStorageValue === '') {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setSettingsSheetOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setInvalid(false);
  };

  return (
    <Sheet
      disableDrag={localStorageValue === ''}
      isOpen={isSettingsSheetOpen}
      onClose={handleClose}
      snapPoints={[380]}
    >
      <Sheet.Container className="px-5 py-3">
        <Sheet.Header className="border-b pb-2 mb-4">
          <h1 className="text-lg font-bold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500">
            Configure your storage key and identification method.
          </p>
        </Sheet.Header>
        <Sheet.Content className="flex flex-col gap-3" disableDrag>
          <Input
            description={`Example: '${storageType === 'localStorage' ? 'FEATURE_MANAGEMENT_USER_ID' : 'statsig_user_id'}'`}
            errorMessage={invalid && `Enter a ${storageType === 'localStorage' ? 'local storage' : 'cookie'} key`}
            isInvalid={invalid}
            label={`${storageType === 'localStorage' ? 'Local storage' : 'Cookie'} key`}
            onChange={handleInputChange}
            placeholder={`Enter key...`}
            size="sm"
            type="text"
            value={value}
            variant="flat"
            classNames={{
              label: "text-xs font-bold",
              description: "text-[10px]",
              input: "text-sm"
            }}
          />

          <RadioGroup
            label="Storage Type"
            onValueChange={setStorageType}
            orientation="horizontal"
            size="sm"
            value={storageType}
            classNames={{
              label: "text-xs font-bold text-gray-700"
            }}
          >
            <Radio value="localStorage" classNames={{ label: "text-xs" }}>Local Storage</Radio>
            <Radio value="cookie" classNames={{ label: "text-xs" }}>Cookie</Radio>
          </RadioGroup>

          <RadioGroup
            label="Console Key Type"
            onValueChange={setTypeApiKey}
            orientation="horizontal"
            size="sm"
            value={typeApiKey}
            classNames={{
              label: "text-xs font-bold text-gray-700"
            }}
          >
            <Radio value="read-key" classNames={{ label: "text-xs" }}>Read-only</Radio>
            <Radio value="write-key" classNames={{ label: "text-xs" }}>Read/Write</Radio>
          </RadioGroup>

          <div className="flex justify-end gap-2 mt-4">
            {localStorageValue !== '' && (
              <Button color="danger" onPress={handleClose} variant="light" size="sm">
                Close
              </Button>
            )}
            <Button
              color="primary"
              onPress={handleSave}
              size="sm"
              className="font-bold"
            >
              Save Settings
            </Button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
};

export default SettingsSheet;
