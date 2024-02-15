import {Button, ScrollShadow, Spinner} from "@nextui-org/react";
import {HealthCheckSection} from "~components/HealthCheckSection";
import {HypothesisSection} from "~components/HypothesisSection";
import {ExperimentOverrides} from "~components/experiment/ExperimentOverrides";
import {ExternalLinkIcon} from "~components/icons/ExternalLinkIcon";
import {useExperiment} from "~hooks/useExperiment";
import {useOverrides} from "~hooks/useOverrides";
import {useStore} from "~store/useStore";
import React from 'react';
import {AiOutlineSetting} from "react-icons/ai";
import Sheet from 'react-modal-sheet';
import {Tooltip} from "react-tooltip";

const ExperimentSheet = () => {
  const {
    currentExperimentId,
    isExperimentSheetOpen,
    setExperimentSheetOpen,
    setManageExperimentModalOpen
  } = useStore((state) => state);
  const {error, isLoading: isLoadingOverrides, overrides} = useOverrides(currentExperimentId);
  const {experiment, isLoading: isLoadingExperiment} = useExperiment(currentExperimentId);

  const handleCloseSheet = () => {
    setExperimentSheetOpen(false);
  };

  const handleOpenExperimentSettings = () => {
    setExperimentSheetOpen(false);
    setManageExperimentModalOpen(true);
  };

  return (
    <Sheet
      isOpen={isExperimentSheetOpen}
      onClose={handleCloseSheet}
      snapPoints={[300]}
    >
      <Sheet.Container>
        <Sheet.Header>
          <div className="flex justify-between items-center p-3">
            <div className="max-w-[525px]">
              {isLoadingExperiment ? (
                <div className="h-7 bg-gray-200 rounded-xl animate-pulse dark:bg-gray-700 w-[320px]"/>
              ) : (
                <>
                  <h1
                    className="text-xl font-bold cursor-pointer"
                    data-tooltip-id="copy-key-tooltip"
                    onClick={() => navigator.clipboard.writeText(currentExperimentId)}
                  >
                    {experiment?.name}
                  </h1>
                  <Tooltip
                    content="Copy experiment key"
                    id="copy-key-tooltip"
                    opacity={1}
                    place="top"
                    variant="dark"
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                as="a"
                color="primary"
                endContent={<ExternalLinkIcon color="white"/>}
                href={`https://console.statsig.com/experiments/${currentExperimentId}`}
                size="sm"
                target="_blank"
                variant="solid"
              >
                Statsig
              </Button>
              <Button
                color="warning"
                endContent={<AiOutlineSetting size={18}/>}
                onPress={handleOpenExperimentSettings}
                size="sm"
                variant="solid"
              >
                Settings
              </Button>
            </div>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col justify-between" draggableAt="both">
            {isLoadingOverrides || isLoadingExperiment ? (
              <div className="flex justify-center h-full">
                <Spinner size="lg"/>
              </div>
            ) : (
              <>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!error && (
                  <ScrollShadow className="w-full px-3 pb-5">
                    {overrides && <ExperimentOverrides overrides={overrides}/>}
                    <HealthCheckSection healthChecks={experiment?.healthChecks}/>
                    {experiment && <HypothesisSection hypothesis={experiment.hypothesis}/>}
                  </ScrollShadow>
                )}
              </>
            )}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleCloseSheet}/>
    </Sheet>
  );
};

export default ExperimentSheet;
