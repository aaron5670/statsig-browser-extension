import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Tab, Tabs,
  useDisclosure
} from "@nextui-org/react";
import GroupsTable from "~components/tables/GroupsTable";
import OverridesTable from "~components/tables/OverridesTable";
import {useExperiment} from "~hooks/useExperiment";
import {useStore} from "~store/useStore";
import React, {useState} from "react";

export const ManageExperimentModal = () => {
  const {currentExperimentId, isManageExperimentModalOpen, setExperimentSheetOpen, setManageExperimentModalOpen} = useStore((state) => state);
  const {experiment} = useExperiment(currentExperimentId);
  const [selected, setSelected] = useState("login");

  const {isOpen, onOpenChange} = useDisclosure({
    isOpen: isManageExperimentModalOpen,
    onClose() {
      handleCloseModal();
    }
  });

  if (!currentExperimentId) return null;

  const handleCloseModal = () => {
    setManageExperimentModalOpen(false);
    setExperimentSheetOpen(true);
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      scrollBehavior="inside"
      size="lg"
    >
      <ModalContent>
        <ModalBody className="p-3 gap-0">
          <Tabs
            classNames={{
              panel: "pb-0",
            }}
            aria-label="Experiment tabs"
            fullWidth
            onSelectionChange={(value: string) => setSelected(value)}
            selectedKey={selected}
          >
            <Tab key="groups" title="Groups">
              <div className="flex flex-col justify-between gap-4">
                <GroupsTable groups={experiment?.groups}/>
                <Button color="primary" fullWidth onPress={handleCloseModal} size="md">
                  Close modal
                </Button>
              </div>
            </Tab>
            <Tab key="overrides" title="Overrides">
              <div className="flex flex-col justify-between gap-4">
                <OverridesTable/>
                <Button color="primary" fullWidth onPress={handleCloseModal} size="md">
                  Close modal
                </Button>
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
