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
                    {dynamicConfig?.name}
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
                endContent={<ExternalLinkIcon color="white" />}
                href={`https://console.statsig.com/dynamic_configs/${currentItemId}`}
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
                            {dynamicConfig.description || 'No description provided.'}
                          </p>
                        </div>

                        <dl className="grid grid-cols-2 gap-y-1 text-sm">
                          <div className="font-medium col-span-1">Created at</div>
                          <div className="col-span-1 font-medium">Updated at</div>
                          <div className="col-span-1 text-right text-gray-700 text-xs sm:text-left">
                            <TimeAgo date={new Date(dynamicConfig.createdTime)} /> <span
                              className="text-gray-700 text-xs">
                              ({dynamicConfig.creatorName})
                            </span>
                          </div>
                          <div className="col-span-1 text-right text-gray-700 text-xs sm:text-left">
                            <TimeAgo date={new Date(dynamicConfig.lastModifiedTime)} /> <span
                              className="text-gray-700 text-xs">
                              ({dynamicConfig.lastModifierName})
                            </span>
                          </div>
                        </dl>

                      </div>
                    </section>

                    <h2 className="text-lg font-medium mt-3">Default Value</h2>
                    <p className="text-sm mb-2">
                      {dynamicConfig.defaultValue ? 'The default value for this dynamic config is:' : 'Default value not set.'}
                    </p>
                    <Suspense fallback={<Spinner size="lg" />}>
                      <ReactJson
                        displayDataTypes={false}
                        displayObjectSize={true}
                        enableClipboard={false}
                        iconStyle="triangle"
                        indentWidth={4}
                        name={false}
                        onAdd={false}
                        onDelete={false}
                        onEdit={false}
                        src={dynamicConfig.defaultValue}
                        theme="bright:inverted"
                      />
                    </Suspense>
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
