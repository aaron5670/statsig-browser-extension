import {
  Button,
  Input, Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {useStore} from "~store/useStore";
import React, {useState} from "react";

const LoginModal = () => {
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [isLoading, setLoading] = useState(false);
  const {isAuthModalOpen, setAuthModalOpen, setExperiments, setSettingsModalOpen} = useStore((state) => state)
  const [apiKey, setApiKey] = useLocalStorage("statsig-console-api-key", "");

  const {isOpen: isModalOpen, onOpenChange} = useDisclosure({
    isOpen: isAuthModalOpen,
    onClose() {
      setAuthModalOpen(false);
    }
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://statsigapi.net/console/v1/experiments", {
        headers: {
          'STATSIG-API-KEY': apiKey,
        }
      });

      const data = await response.json();
      if (data?.status === 401) {
        setErrorMessage("Invalid Statsig Console API Key, please try again with a valid key.");
      } else if (data?.status) {
        setErrorMessage("An unknown error occurred, please try again.");
      }

      setLoading(false);
      if (data?.data) {
        setExperiments(data.data);
        setAuthModalOpen(false);
        setSettingsModalOpen(true);
      }
    } catch (e) {
      setLoading(false);
      setErrorMessage("An unknown error occurred, please try again.");
    }
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isModalOpen}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col">Login to Statsig</ModalHeader>
        <ModalBody>
          <p>
            Before you can use this extension, you need to login to your Statsig account. This can be done with
            a <b>Read Only Statsig Console API Key</b>. This key can be created in the <b>Project Settings</b> under
            the <Link href='https://console.statsig.com/api_keys' rel="noreferrer" style={{fontSize: 13}} target="_blank">Keys &
            Environments</Link> tab.
          </p>
        </ModalBody>
        <p className="text-danger text-center">{errorMessage}</p>
        <ModalFooter>
          <Input
            autoFocus
            label="Statsig Console API Key"
            onChange={e => setApiKey(e.target.value)}
            type="text"
            value={apiKey}
            variant="flat"
          />
          <Button color="primary" isLoading={isLoading} onClick={handleLogin} style={{height: 56}}>
            Login
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  )
}

export default LoginModal
