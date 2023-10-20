import {Button, Input} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {useStore} from "~store/useStore";
import React from 'react';
import Sheet from 'react-modal-sheet';

const SettingsSheet = () => {
  const {isSettingsModalOpen, setSettingsModalOpen} = useStore((state) => state);
  const [localStorageValue, setLocalStorageKey] = useLocalStorage("statsig-local-storage-key", null);
  const [value, setValue] = React.useState(localStorageValue);

  const handleSave = () => {
    setLocalStorageKey(value);
    setSettingsModalOpen(false);
  }

  return (
    <Sheet
      isOpen={isSettingsModalOpen}
      onClose={() => setSettingsModalOpen(false)}
      snapPoints={[250]}
    >
      <Sheet.Container className={'p-5'}>
        <Sheet.Header>
          <h1 className={'text-2xl font-bold'}>Settings</h1>
          <p className="text-sm text-gray-700">
            Here you can set your local storage key that will be used on the website to identify the user.
          </p>
        </Sheet.Header>
        <Sheet.Content className="flex flex-col justify-between mt-7" disableDrag>
          <Input
            description="For example: 'FEATURE_MANAGEMENT_USER_ID'"
            label="Local storage key"
            onChange={(event => setValue(event.target.value))}
            placeholder="Enter a local storage key"
            type="text"
            value={value}
            variant="flat"
          />

          <div className="flex justify-end space-x-2">
            <Button color="danger" onPress={() => setSettingsModalOpen(false)} variant="light">
              Close
            </Button>
            <Button color="primary" onPress={handleSave}>
              Save
            </Button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setSettingsModalOpen(false)}/>
    </Sheet>
  )
}

export default SettingsSheet
