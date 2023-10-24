import {NextUIProvider} from "@nextui-org/react";
import {Button, Navbar, NavbarBrand, NavbarItem} from "@nextui-org/react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import Experiments from "~components/Experiments";
import {SettingsIcon} from "~components/icons/SettingsIcon";
import LoginModal from "~components/modals/LoginModal";
import ExperimentSheet from "~components/sheets/ExperimentSheet";
import SettingsSheet from "~components/sheets/SettingsSheet";
import {useStore} from "~store/useStore";
import statsigLogo from "data-base64:./statsig-logo.svg"
import React, {useEffect} from "react";
import {SWRConfig} from "swr";

import './main.css';

function IndexPopup() {
  const {setAuthModalOpen, setExperiments, setLoading, setSettingsModalOpen} = useStore((state) => state)
  const [apiKey, setApiKey]: [string, any] = useLocalStorage("statsig-console-api-key");

  useEffect(() => {
    setLoading(true);
    const getExperiments = async () => {
      const response = await fetch("https://statsigapi.net/console/v1/experiments", {
        headers: {
          'STATSIG-API-KEY': apiKey,
        }
      });

      const data = await response.json();
      if (data?.status) {
        setApiKey("");
        setAuthModalOpen(true);
      }

      if (data?.data) {
        setExperiments(data.data);
      }
    }

    // if there is no api key, open the auth modal
    if (!apiKey || apiKey === "") {
      setAuthModalOpen(true);
    } else {
      setTimeout(() => {
        getExperiments();
      }, 300);
    }
  }, []);

  const handleLogout = () => {
    setApiKey("");
    setAuthModalOpen(true);
    setExperiments([]);
  }

  return (
    <NextUIProvider>
      <SWRConfig>
        <div className="w-[700px] min-h-[455px]">
          <Navbar>
            <NavbarBrand>
              <img alt="Statsig logo" src={statsigLogo} width={125}/>
            </NavbarBrand>
            <NavbarItem>
              <Dropdown backdrop="opaque">
                <DropdownTrigger>
                  <Button variant="flat">
                    <SettingsIcon/>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="Settings" onClick={() => setSettingsModalOpen(true)}>
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
            <LoginModal/>
            <Experiments/>
          </div>
        </div>
      </SWRConfig>
    </NextUIProvider>
  )
}

export default IndexPopup
