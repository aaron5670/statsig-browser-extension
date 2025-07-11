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
      snapPoints={[350]}
    >
      <Sheet.Container className={'p-5'}>
        <Sheet.Header>
          <h1 className={'text-2xl font-bold'}>Settings</h1>
          <p className="text-sm text-gray-700">
            Here you can set your storage key that will be used on the website to identify the user.
          </p>
        </Sheet.Header>
        <Sheet.Content className="flex flex-col justify-between gap-2 mt-6" disableDrag>
          <Input
            description={`For example: '${storageType === 'localStorage' ? 'FEATURE_MANAGEMENT_USER_ID' : 'statsig_user_id'}'`}
            errorMessage={invalid && `Please enter a ${storageType === 'localStorage' ? 'local storage' : 'cookie'} key, for example: '${storageType === 'localStorage' ? 'FEATURE_MANAGEMENT_USER_ID' : 'statsig_user_id'}'`}
            isInvalid={invalid}
            label={`${storageType === 'localStorage' ? 'Local storage' : 'Cookie'} key`}
            onChange={handleInputChange}
            placeholder={`Enter a ${storageType === 'localStorage' ? 'local storage' : 'cookie'} key`}
            size="sm"
            type="text"
            value={value}
            variant="flat"
          />

          <RadioGroup
            className="mt-3"
            label="Where do you want to store the override?"
            onValueChange={setStorageType}
            orientation="horizontal"
            size="sm"
            value={storageType}
          >
            <Radio value="localStorage">Local Storage</Radio>
            <Radio value="cookie">Cookie</Radio>
          </RadioGroup>

          <RadioGroup
            className="mt-3"
            label="What type of Statsig Console key are you using?"
            onValueChange={setTypeApiKey}
            orientation="horizontal"
            size="sm"
            value={typeApiKey}
          >
            <Radio value="read-key">Read-only</Radio>
            <Radio value="write-key">Read and write</Radio>
          </RadioGroup>

          <div className="flex justify-end space-x-2">
            {localStorageValue !== '' && (
              <Button color="danger" onPress={handleClose} variant="light">
                Close
              </Button>
            )}
            <Button
              color="primary"
              onPress={handleSave}
            >
              Save
            </Button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
};

export default SettingsSheet;
