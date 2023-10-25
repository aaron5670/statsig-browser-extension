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
import {handleInitialLogin} from "~handlers/handleInitialLogin";
import {useStore} from "~store/useStore";
import React, {useEffect, useState} from "react";
import {mutate} from "swr";
import useSWRMutation from "swr/mutation";

const LoginModal = () => {
  const {isAuthModalOpen, setAuthModalOpen, setSettingsSheetOpen} = useStore((state) => state);
  const [, setApiKey] = useLocalStorage("statsig-console-api-key", "");
  const [value, setValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>(null);

  const {
    data,
    error,
    isMutating,
    trigger
  } = useSWRMutation('https://statsigapi.net/console/v1/experiments', handleInitialLogin);

  useEffect(() => {
    const handleLogin = async () => {
      if (error || data?.error) {
        setErrorMessage(error || data?.error);
        return;
      }

      if (data.success) {
        setApiKey(value);
        await mutate("https://statsigapi.net/console/v1/experiments", data.data);
      }

      setAuthModalOpen(false);
      setSettingsSheetOpen(true);
    };

    if (data || error) {
      handleLogin();
    }
  }, [data, error]);

  const {isOpen: isModalOpen, onOpenChange} = useDisclosure({
    isOpen: isAuthModalOpen,
    onClose() {
      setAuthModalOpen(false);
    }
  });

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
            the <Link href='https://console.statsig.com/api_keys' rel="noreferrer" style={{fontSize: 13}}
                      target="_blank">Keys &
            Environments</Link> tab.
          </p>
        </ModalBody>
        <p className="text-danger text-center">{errorMessage}</p>
        <ModalFooter>
          <Input
            autoFocus
            label="Statsig Console API Key"
            onChange={e => setValue(e.target.value)}
            type="text"
            value={value}
            variant="flat"
          />
          <Button color="primary" isLoading={isMutating} onClick={() => trigger(value)} style={{height: 56}}>
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
