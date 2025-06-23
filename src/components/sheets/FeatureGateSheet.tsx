import { Button, ScrollShadow, Spinner } from "@nextui-org/react";
import FeatureGateRules from "~components/FeatureGateRules";
import { ExternalLinkIcon } from "~components/icons/ExternalLinkIcon";
import { useFeatureGate } from "~hooks/useFeatureGate";
import { useStore } from "~store/useStore";
import React from 'react';
import { Sheet } from 'react-modal-sheet';
import { Tooltip } from "react-tooltip";

const FeatureGateSheet = () => {
  const {
    currentItemId,
    isItemSheetOpen,
    setItemSheetOpen,
  } = useStore((state) => state);
  const { featureGate, error, isLoading } = useFeatureGate(currentItemId);

  const handleCloseSheet = () => {
    setItemSheetOpen(false);
  };

  return (
    <Sheet
      isOpen={isItemSheetOpen}
      onClose={handleCloseSheet}
      snapPoints={[300]}
    >
      <Sheet.Container>
        <Sheet.Header>
          <div className="flex justify-between items-center p-3">
            <div className="max-w-[525px]">
              {isLoading ? (
                <div className="h-7 bg-gray-200 rounded-xl animate-pulse dark:bg-gray-700 w-[320px]" />
              ) : (
                <>
                  <h1
                    className="text-xl font-bold cursor-pointer"
                    data-tooltip-id="copy-key-tooltip"
                    onClick={() => navigator.clipboard.writeText(currentItemId)}
                  >
                    {featureGate?.name}
                  </h1>
                  <Tooltip
                    content="Copy feature gate key"
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
                endContent={<ExternalLinkIcon color="white" />}
                href={`https://console.statsig.com/gates/${currentItemId}`}
                size="sm"
                target="_blank"
                variant="solid"
              >
                Statsig
              </Button>
            </div>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col justify-between" draggableAt="both">
            {isLoading ? (
              <div className="flex justify-center h-full">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                {error && <p className="text-sm text-red-600 p-4 text-center">{error}</p>}
                {!error && (
                  <ScrollShadow className="w-full px-3 pb-5">
                    <section>
                      <div className="space-y-2">
                        <div>
                          <h2 className="text-lg font-medium">Details</h2>
                          <p>
                            {featureGate.description || 'No description provided.'}
                          </p>
                        </div>

                        <dl className="grid grid-cols-2 gap-y-1 text-sm">
                          <div className="font-medium col-span-1">Created at</div>
                          <div className="col-span-1 font-medium">Updated at</div>
                          <div className="col-span-1 text-right text-gray-700 text-xs sm:text-left">
                            {new Date(featureGate.createdTime).toLocaleString()} <span
                              className="text-gray-700 text-xs">
                              ({featureGate.creatorName})
                            </span>
                          </div>
                          <div className="col-span-1 text-right text-gray-700 text-xs sm:text-left">
                            {new Date(featureGate.lastModifiedTime).toLocaleString()} <span
                              className="text-gray-700 text-xs">
                              ({featureGate.lastModifierName})
                            </span>
                          </div>
                        </dl>

                        <dl className="grid grid-cols-2 gap-y-1 text-sm mt-4">
                          <div className="font-medium col-span-1">Status</div>
                          <div className="col-span-1 font-medium">Enabled</div>
                          <div className="col-span-1 text-right text-gray-700 text-xs sm:text-left">
                            {featureGate.status}
                          </div>
                          <div className="col-span-1 text-right text-gray-700 text-xs sm:text-left">
                            {featureGate.isEnabled ? 'Yes' : 'No'}
                          </div>
                        </dl>

                        {featureGate.tags && featureGate.tags.length > 0 && (
                          <>
                            <h3 className="text-md font-medium mt-3">Tags</h3>
                            <div className="flex flex-wrap gap-1">
                              {featureGate.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}

                        <div className="mt-4">
                          <FeatureGateRules featureGateId={currentItemId} />
                        </div>
                      </div>
                    </section>
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

export default FeatureGateSheet; 