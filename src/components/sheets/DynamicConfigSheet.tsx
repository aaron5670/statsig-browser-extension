import { Button, ScrollShadow, Spinner } from "@nextui-org/react";
import { ExternalLinkIcon } from "~components/icons/ExternalLinkIcon";
import { useDynamicConfig } from "~hooks/useDynamicConfig";
import { useStore } from "~store/useStore";
import React, { Suspense, lazy } from 'react';
import { Sheet } from 'react-modal-sheet';
import { Tooltip } from "react-tooltip";
import TimeAgo from 'react-timeago';
// import ReactJson from "@vahagn13/react-json-view";

const ReactJson = lazy(() => import('@vahagn13/react-json-view'));

const DynamicConfigSheet = () => {
  const {
    currentItemId,
    isItemSheetOpen,
    setItemSheetOpen,
  } = useStore((state) => state);
  const { dynamicConfig, error, isLoading } = useDynamicConfig(currentItemId);

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
                    {dynamicConfig?.name}
                  </h1>
                  <Tooltip
                    content="Copy dynamic config key"
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
                href={`https://console.statsig.com/dynamic_configs/${currentItemId}`}
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
                      {/* Details & Metadata Card */}
                      <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 space-y-3">
                        <div>
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {dynamicConfig.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Created</span>
                            <div className="text-xs text-gray-700 font-medium truncate">
                              <TimeAgo date={new Date(dynamicConfig.createdTime)} />
                              <span className="text-[10px] text-gray-400 ml-1 font-normal">({dynamicConfig.creatorName})</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Updated</span>
                            <div className="text-xs text-gray-700 font-medium truncate">
                              <TimeAgo date={new Date(dynamicConfig.lastModifiedTime)} />
                              <span className="text-[10px] text-gray-400 ml-1 font-normal">({dynamicConfig.lastModifierName})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Default Value Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Default Value</h3>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {dynamicConfig.defaultValue ? 'JSON Object' : 'Empty'}
                          </span>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-lg p-2 overflow-hidden shadow-sm">
                          <Suspense fallback={
                            <div className="flex justify-center p-4">
                              <Spinner size="sm" />
                            </div>
                          }>
                            <ReactJson
                              displayDataTypes={false}
                              displayObjectSize={false}
                              enableClipboard={true}
                              iconStyle="triangle"
                              indentWidth={2}
                              name={false}
                              onAdd={false}
                              onDelete={false}
                              onEdit={false}
                              src={dynamicConfig.defaultValue}
                              theme="bright:inverted"
                              collapsed={1}
                              style={{
                                fontSize: '11px',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                backgroundColor: 'transparent'
                              }}
                            />
                          </Suspense>
                        </div>
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

export default DynamicConfigSheet;
