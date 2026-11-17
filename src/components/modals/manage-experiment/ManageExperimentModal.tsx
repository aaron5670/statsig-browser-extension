import { Tab, Tabs } from "@heroui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import DetailDialog from "~/components/DetailDialog";
import { useExperiment } from "~/hooks/useExperiment";
import { useStore } from "~/store/useStore";
import { GroupsSection } from "./GroupsSection";
import { OverridesSection } from "./OverridesSection";

const ManageExperimentModal = () => {
  const {
    currentItemId,
    isManageExperimentModalOpen,
    setManageExperimentModalOpen
  } = useStore((state) => state);
  const [keyType] = useLocalStorage("statsig-type-api-key", "read-key");
  const { experiment } = useExperiment(
    isManageExperimentModalOpen ? currentItemId : undefined
  );

  return (
    <DetailDialog
      description={experiment?.name || currentItemId}
      isOpen={isManageExperimentModalOpen}
      onClose={() => setManageExperimentModalOpen(false)}
      title={
        keyType === "write-key" ? "Manage experiment" : "Groups and overrides"
      }>
      <Tabs
        aria-label="Manage experiment"
        classNames={{ panel: "px-0 pb-0" }}
        defaultSelectedKey="groups"
        radius="sm">
        <Tab key="groups" title="Groups">
          <GroupsSection />
        </Tab>
        <Tab key="overrides" title="Overrides">
          <OverridesSection />
        </Tab>
      </Tabs>
    </DetailDialog>
  );
};

export default ManageExperimentModal;
