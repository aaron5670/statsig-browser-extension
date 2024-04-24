import {
  Modal,
  ModalBody,
  ModalContent,
  Tab, Tabs,
  useDisclosure
} from "@nextui-org/react";
import {GroupsSection} from "~components/modals/manage-experiment/GroupsSection";
import {OverridesSection} from "~components/modals/manage-experiment/OverridesSection";
import {useStore} from "~store/useStore";
import React, {useState} from "react";

const ManageExperimentModal = () => {
  const {currentItemId, isManageExperimentModalOpen, setItemSheetOpen, setManageExperimentModalOpen} = useStore((state) => state);
  const [selected, setSelected] = useState("login");

  const {isOpen, onOpenChange} = useDisclosure({
    isOpen: isManageExperimentModalOpen,
    onClose() {
      handleCloseModal();
    }
  });

  if (!currentItemId) return null;

  const handleCloseModal = () => {
    setManageExperimentModalOpen(false);
    setItemSheetOpen(true);
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
              <GroupsSection/>
            </Tab>
            <Tab key="overrides" title="Overrides">
              <OverridesSection/>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ManageExperimentModal;