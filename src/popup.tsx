import {type Dispatch, lazy, type SetStateAction, Suspense} from "react";

import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem} from "@nextui-org/react";
import {NextUIProvider} from "@nextui-org/react";
import {Button, Navbar, NavbarBrand, NavbarItem} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import Experiments from "~components/Experiments";
import {SettingsIcon} from "~components/icons/SettingsIcon";
import {
  getCurrentLocalStorageValue,
  removeLocalStorageValue,
} from "~handlers/localStorageHandlers";
import {fetcher} from "~helpers/fetcher";
import {useStore} from "~store/useStore";
import statsigLogo from "data-base64:./statsig-logo.svg";
import React, {useEffect} from "react";
import {RxCross2} from "react-icons/rx";
import {SWRConfig, mutate} from "swr";
import DynamicConfigs from "~components/DynamicConfigs";

const ExperimentSheet = lazy(() => import('~components/sheets/ExperimentSheet'));
const ManageExperimentModal = lazy(() => import('~components/modals/manage-experiment/ManageExperimentModal'));
const DynamicConfigSheet = lazy(() => import('~components/sheets/DynamicConfigSheet'));
const LoginModal = lazy(() => import('~components/modals/LoginModal'));
const SettingsSheet = lazy(() => import('~components/sheets/SettingsSheet'));

import './main.css';

const types = [
  {
    name: "Experiments",
    description: "Search for experiments",
  },
  {
    name: "Dynamic Configs",
    description: "Search for dynamic configs",
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
  const [experimentOrConfig, setExperimentOrConfig]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-experiment-or-config", "Experiments");

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
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      const [localStorage] = await getCurrentLocalStorageValue(tabs[0].id, localStorageValue);
      if (localStorage?.result) {
        setCurrentLocalStorageValue(localStorage.result);
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
      setCurrentLocalStorageValue('LocalStorage cleared...');
      await removeLocalStorageValue(tabs[0].id, localStorageValue);
      setTimeout(() => {
        getLocalStorageValue();
      }, 2000);
    });
  };

  return (
    <NextUIProvider>
      <SWRConfig value={{fetcher}}>
        <div className="w-[700px] min-h-[410px]">
          <Navbar>
            <NavbarBrand>
              <img alt="Statsig logo" src={statsigLogo} width={125}/>
            </NavbarBrand>
            {currentLocalStorageValue && (
              <div>
                <p className="text-sm text-gray-700">Current localStorage</p>
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
              </div>
            )}
            <Select
              items={types}
              placeholder="Select a type..."
              className="max-w-[200px]"
              size="sm"
              value={experimentOrConfig}
              defaultSelectedKeys={[experimentOrConfig]}
              onChange={(value) => setExperimentOrConfig(value.target.value)}
              required
            >
              {({name, description}) => (
                <SelectItem key={name} textValue={name} value={name} className="flex gap-2 items-center">
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
                    <SettingsIcon/>
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
              <SettingsSheet/>
            </Suspense>
            {experimentOrConfig === "Experiments" && (
                <>
                  <Suspense>
                    <ExperimentSheet/>
                  </Suspense>
                  <Suspense>
                    <ManageExperimentModal/>
                  </Suspense>
                  <Experiments/>
                </>
            )}
            {experimentOrConfig === "Dynamic Configs" && (
                <>
                  <Suspense>
                    <DynamicConfigSheet/>
                  </Suspense>
                  <DynamicConfigs/>
                </>
            )}
            <Suspense>
              <LoginModal/>
            </Suspense>
          </div>
        </div>
      </SWRConfig>
    </NextUIProvider>
  );
}

export default IndexPopup;
