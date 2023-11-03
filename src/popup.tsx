import type {Dispatch, SetStateAction} from "react";

import {NextUIProvider} from "@nextui-org/react";
import {Button, Navbar, NavbarBrand, NavbarItem} from "@nextui-org/react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import Experiments from "~components/Experiments";
import {SettingsIcon} from "~components/icons/SettingsIcon";
import LoginModal from "~components/modals/LoginModal";
import {ManageExperimentModal} from "~components/modals/manage-experiment/ManageExperimentModal";
import ExperimentSheet from "~components/sheets/ExperimentSheet";
import SettingsSheet from "~components/sheets/SettingsSheet";
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

import './main.css';

function IndexPopup() {
  const {
    currentLocalStorageValue,
    setAuthModalOpen,
    setCurrentLocalStorageValue,
    setSettingsSheetOpen
  } = useStore((state) => state);
  const [apiKey, setApiKey]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-console-api-key");
  const [localStorageValue]: [string, Dispatch<SetStateAction<string>>] = useLocalStorage("statsig-local-storage-key");

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
                <p className="text-sm text-gray-700">Current localStorage value</p>
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
            <SettingsSheet/>
            <ExperimentSheet/>
            <ManageExperimentModal/>
            <LoginModal/>
            <Experiments/>
          </div>
        </div>
      </SWRConfig>
    </NextUIProvider>
  );
}

export default IndexPopup;
