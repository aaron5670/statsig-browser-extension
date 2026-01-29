import { Button, ScrollShadow, Spinner } from "@nextui-org/react";
import { HealthCheckSection } from "~components/HealthCheckSection";
import { HypothesisSection } from "~components/HypothesisSection";
import { ExperimentOverrides } from "~components/experiment/ExperimentOverrides";
import { ExternalLinkIcon } from "~components/icons/ExternalLinkIcon";
import { useExperiment } from "~hooks/useExperiment";
import { useOverrides } from "~hooks/useOverrides";
import { useStore } from "~store/useStore";
import React from 'react';
import { AiOutlineSetting } from "react-icons/ai";
import { Sheet } from 'react-modal-sheet';
import { Tooltip } from "react-tooltip";
import TimeAgo from 'react-timeago';

const ExperimentSheet = () => {
  const {
    currentItemId,
    isItemSheetOpen,
    setItemSheetOpen,
    setManageExperimentModalOpen
  } = useStore((state) => state);
  const { error, isLoading: isLoadingOverrides, overrides } = useOverrides(currentItemId);
  const { experiment, isLoading: isLoadingExperiment } = useExperiment(currentItemId);

  const handleCloseSheet = () => {
    setItemSheetOpen(false);
  };

  const handleOpenExperimentSettings = () => {
    setItemSheetOpen(false);
    setManageExperimentModalOpen(true);
  };

  return (
    <Sheet
      isOpen={isItemSheetOpen}
      onClose={handleCloseSheet}
      snapPoints={[300]}
    >
      <Sheet.Container>
        <Sheet.Header className="px-4 py-2 border-b">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              {isLoadingExperiment ? (
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-48" />
              ) : (
                <>
                  <h1
                    className="text-lg font-bold text-gray-900 truncate cursor-pointer"
                    data-tooltip-id="copy-key-tooltip"
                    onClick={() => navigator.clipboard.writeText(currentItemId)}
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
            <div className="flex items-center gap-1.5 ml-4 shrink-0">
              <Button
                as="a"
                color="primary"
                endContent={<ExternalLinkIcon color="white" />}
                href={`https://console.statsig.com/experiments/${currentItemId}`}
                size="sm"
                target="_blank"
                variant="solid"
                className="h-8"
              >
                Statsig
              </Button>
              <Button
                color="warning"
                endContent={<AiOutlineSetting size={16} />}
                onPress={handleOpenExperimentSettings}
                size="sm"
                variant="solid"
                className="h-8"
              >
                Settings
              </Button>
            </div>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col justify-between" draggableAt="both">
            {isLoadingOverrides || isLoadingExperiment ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                {error && <p className="text-xs text-red-600 p-4 text-center">{error}</p>}
                {!error && (
                  <ScrollShadow className="w-full px-4 py-3">
                    <div className="space-y-4">
                      {overrides && <ExperimentOverrides overrides={overrides} />}

                      <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Metadata</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Created</span>
                            <div className="text-xs text-gray-700 font-medium">
                              <TimeAgo date={new Date(experiment?.createdTime)} />
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Updated</span>
                            <div className="text-xs text-gray-700 font-medium">
                              <TimeAgo date={new Date(experiment?.lastModifiedTime)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <HealthCheckSection healthChecks={experiment?.healthChecks} />
                      {experiment && <HypothesisSection hypothesis={experiment.hypothesis} />}
                    </div>
                  </ScrollShadow>
                )}
              </>
            )}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleCloseSheet} />
    </Sheet>
  );
};

export default ExperimentSheet;
