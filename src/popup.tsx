import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";
import { Button, Navbar, NavbarBrand, NavbarItem } from "@nextui-org/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import DynamicConfigs from "~components/DynamicConfigs";
import Experiments from "~components/Experiments";
import { SettingsIcon } from "~components/icons/SettingsIcon";
import {
  getCurrentStorageValue,
  removeStorageValue,
  updateStorageValue,
} from "~handlers/localStorageHandlers";
import { fetcher } from "~helpers/fetcher";
import { useStore } from "~store/useStore";
import { type Dispatch, type SetStateAction, Suspense, lazy } from "react";
import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { SWRConfig, mutate } from "swr";
import statsigLogo from "url:../assets/statsig-logo.png";

const ExperimentSheet = lazy(() => import('~components/sheets/ExperimentSheet'));
const ManageExperimentModal = lazy(() => import('~components/modals/manage-experiment/ManageExperimentModal'));
const DynamicConfigSheet = lazy(() => import('~components/sheets/DynamicConfigSheet'));
const LoginModal = lazy(() => import('~components/modals/LoginModal'));
const SettingsSheet = lazy(() => import('~components/sheets/SettingsSheet'));

import './main.css';

const types = [
  {
    description: "Search for experiments",
    name: "Experiments",
  },
  {
    description: "Search for dynamic configs",
    name: "Dynamic Configs",
  }
];

function IndexPopup() {
  const {
    currentLocalStorageValue,
    setAuthModalOpen,
    setCurrentLocalStorageValue,
    setSettingsSheetOpen
  } = useStore((state) => state);
  const [apiKey, setApiKey]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-console-api-key");
  const [localStorageValue]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-local-storage-key");
  const [storageType]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-storage-type", "localStorage");
  const [experimentOrConfig, setExperimentOrConfig]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-experiment-or-config", "Experiments");
  const [currentOverrides] = useLocalStorage("statsig-current-overrides", []);
  const hasCustomOverride = currentOverrides?.find((override) => override.name === currentLocalStorageValue);

  useEffect(() => {
    // if there is no api key, open the auth modal
    if (!apiKey || apiKey === "") {
      setAuthModalOpen(true);
      return;
    }

    // if there is no local storage key, open the settings sheet
    if (!localStorageValue || localStorageValue === "") {
      setSettingsSheetOpen(true);
      return;
    }

    getLocalStorageValue();
  }, []);

  const getLocalStorageValue = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const [storage] = await getCurrentStorageValue(tabs[0].id, localStorageValue, storageType as 'cookie' | 'localStorage');
      if (storage?.result) {
        setCurrentLocalStorageValue(storage.result);
      }
    });
  };

  const handleLogout = () => {
    setApiKey("");
    setAuthModalOpen(true);
    return mutate("https://statsigapi.net/console/v1/experiments", []);
  };

  const handleRemoveLocalStorageValue = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      setCurrentLocalStorageValue(`${storageType === 'localStorage' ? 'LocalStorage' : 'Cookie'} cleared...`);
      await removeStorageValue(tabs[0].id, localStorageValue, storageType as 'cookie' | 'localStorage');
      setTimeout(() => {
        getLocalStorageValue();
      }, 2000);
    });
  };

  const handleOverrides = (value: string) => {
    // Save the selected override to local storage
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      // if the value is empty, remove the local storage value
      if (value === '') {
        handleRemoveLocalStorageValue();
      }

      setCurrentLocalStorageValue(value);
      await updateStorageValue(tabs[0].id, localStorageValue, value, storageType as 'cookie' | 'localStorage');
    });
  };

  return (
    <NextUIProvider>
      <SWRConfig value={{ fetcher }}>
        <div className="w-[700px] min-h-[410px]">
          <Navbar>
            <NavbarBrand>
              <img alt="Statsig logo" className="ml-1" src={statsigLogo} width={140} />
            </NavbarBrand>
            <div>
              {hasCustomOverride && (
                <Select
                  className="min-w-[175px]"
                  defaultSelectedKeys={[currentLocalStorageValue]}
                  items={currentOverrides as { name: string }[]}
                  onChange={(value) => handleOverrides(value.target.value)}
                  placeholder="No override enabled"
                  required
                  selectedKeys={[currentLocalStorageValue]}
                  size="sm"
                >
                  {({ name }) => (
                    <SelectItem className="flex gap-2 items-center" key={name} textValue={name} value={name}>
                      <div className="flex flex-col">
                        <span className="text-small">{name}</span>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              )}
              {currentLocalStorageValue && !hasCustomOverride && (
                <>
                  <p className="text-sm text-gray-700">Current {storageType === 'localStorage' ? 'localStorage' : 'cookie'}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-tiny text-foreground-400">
                      {currentLocalStorageValue}
                    </p>
                    <RxCross2
                      className="text-red-500 cursor-pointer hover:text-red-800"
                      onClick={handleRemoveLocalStorageValue}
                      size={15}
                    />
                  </div>
                </>
              )}
            </div>
            <Select
              className="max-w-[200px]"
              defaultSelectedKeys={[experimentOrConfig]}
              items={types}
              onChange={(value) => setExperimentOrConfig(value.target.value)}
              placeholder="Select a type..."
              required
              size="sm"
              value={experimentOrConfig}
            >
              {({ description, name }) => (
                <SelectItem className="flex gap-2 items-center" key={name} textValue={name} value={name}>
                  <div className="flex flex-col">
                    <span className="text-small">{name}</span>
                    <span className="text-tiny text-default-400">{description}</span>
                  </div>
                </SelectItem>
              )}
            </Select>
            <NavbarItem>
              <Dropdown backdrop="opaque">
                <DropdownTrigger>
                  <Button variant="flat">
                    <SettingsIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="Settings" onClick={() => setSettingsSheetOpen(true)}>
                    Settings
                  </DropdownItem>
                  <DropdownItem className="text-danger" color="danger" key="delete" onClick={handleLogout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </Navbar>

          <div className="container mx-auto">
            <Suspense>
              <SettingsSheet />
            </Suspense>
            {experimentOrConfig === "Experiments" && (
              <>
                <Suspense>
                  <ExperimentSheet />
                </Suspense>
                <Suspense>
                  <ManageExperimentModal />
                </Suspense>
                <Experiments />
              </>
            )}
            {experimentOrConfig === "Dynamic Configs" && (
              <>
                <Suspense>
                  <DynamicConfigSheet />
                </Suspense>
                <DynamicConfigs />
              </>
            )}
            <Suspense>
              <LoginModal />
            </Suspense>
          </div>
        </div>
      </SWRConfig>
    </NextUIProvider>
  );
}

export default IndexPopup;
