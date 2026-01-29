import { Button, ScrollShadow, Spinner } from "@nextui-org/react";
import FeatureGateRules from "~components/FeatureGateRules";
import { GateOverrides } from "~components/GateOverrides";
import { ExternalLinkIcon } from "~components/icons/ExternalLinkIcon";
import { useFeatureGate } from "~hooks/useFeatureGate";
import { useGateOverrides } from "~hooks/useGateOverrides";
import { useStore } from "~store/useStore";
import React from 'react';
import { Sheet } from 'react-modal-sheet';
import { Tooltip } from "react-tooltip";
import TimeAgo from 'react-timeago';

const FeatureGateSheet = () => {
  const {
    currentItemId,
    isItemSheetOpen,
    setItemSheetOpen,
  } = useStore((state) => state);
  const { featureGate, error: gateError, isLoading: isLoadingGate } = useFeatureGate(currentItemId);
  const { overrides, error: overridesError, isLoading: isLoadingOverrides } = useGateOverrides(currentItemId);

  const handleCloseSheet = () => {
    setItemSheetOpen(false);
  };

  const isLoading = isLoadingGate || isLoadingOverrides;
  const error = gateError || overridesError;

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
              {isLoading ? (
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-48" />
              ) : (
                <>
                  <h1
                    className="text-lg font-bold text-gray-900 truncate cursor-pointer"
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
            <div className="shrink-0 ml-4">
              <Button
                as="a"
                color="primary"
                endContent={<ExternalLinkIcon color="white" />}
                href={`https://console.statsig.com/gates/${currentItemId}`}
                size="sm"
                target="_blank"
                variant="solid"
                className="h-8"
              >
                Statsig
              </Button>
            </div>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col justify-between" draggableAt="both">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                {error && <p className="text-xs text-red-600 p-4 text-center">{error}</p>}
                {!error && (
                  <ScrollShadow className="w-full px-4 py-3">
                    <div className="space-y-4">
                      {/* Gate Overrides Section */}
                      {overrides && <GateOverrides overrides={overrides} />}

                      {/* Details & Metadata Card */}
                      <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 space-y-3">
                        <div>
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {featureGate?.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Created</span>
                            <div className="text-xs text-gray-700 font-medium">
                              <TimeAgo date={new Date(featureGate.createdTime)} />
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Updated</span>
                            <div className="text-xs text-gray-700 font-medium">
                              <TimeAgo date={new Date(featureGate.lastModifiedTime)} />
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Status</span>
                            <div className="text-xs text-gray-700 font-medium capitalize">
                              {featureGate?.status}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Enabled</span>
                            <div className="text-xs text-gray-700 font-medium">
                              {featureGate?.isEnabled ? 'Yes' : 'No'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {featureGate?.tags && featureGate.tags.length > 0 && (
                        <div>
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Tags</h3>
                          <div className="flex flex-wrap gap-1">
                            {featureGate.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md border border-gray-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <FeatureGateRules featureGateId={currentItemId} />
                      </div>
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

export default FeatureGateSheet; 