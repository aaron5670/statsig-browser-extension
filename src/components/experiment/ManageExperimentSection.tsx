import {Button} from "@nextui-org/react";
import {useStore} from "~store/useStore";
import React from "react";

export const ManageExperimentSection = () => {
  const {setExperimentSheetOpen, setManageExperimentModalOpen} = useStore((state) => state);

  const handleModalOpen = () => {
    setExperimentSheetOpen(false);
    setManageExperimentModalOpen(true);
  };

  return (
    <>
      <Button color="primary" onPress={handleModalOpen}>
        Manage Experiment
      </Button>
    </>
  );
};
