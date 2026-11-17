import { Button } from "@heroui/react";
import { useStore } from "~/store/useStore";

export const ManageExperimentSection = () => {
  const { setItemSheetOpen, setManageExperimentModalOpen } = useStore(
    (state) => state
  );

  const handleModalOpen = () => {
    setItemSheetOpen(false);
    setManageExperimentModalOpen(true);
  };

  return (
    <Button color="primary" onPress={handleModalOpen}>
      Manage Experiment
    </Button>
  );
};
