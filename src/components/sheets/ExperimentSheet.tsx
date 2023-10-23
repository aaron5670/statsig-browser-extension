import {Button, Spinner} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {ExperimentOverrides, type Override} from "~components/ExperimentOverrides";
import {ExternalLinkIcon} from "~components/icons/ExternalLinkIcon";
import {useStore} from "~store/useStore";
import React, {useEffect, useState} from 'react';
import Sheet from 'react-modal-sheet';

const ExperimentSheet = () => {
  const {
    currentExperimentId,
    isExperimentModalOpen,
    setCurrentExperimentId,
    setExperimentModalOpen
  } = useStore((state) => state);
  const [apiKey] = useLocalStorage("statsig-console-api-key");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(null);
  const [experimentOverrides, setExperimentOverrides] = React.useState<Override[]>([]);

  useEffect(() => {
    const getExperimentOverrides = async () => {
      const response = await fetch(`https://statsigapi.net/console/v1/experiments/${currentExperimentId}/overrides`, {
        headers: {
          'STATSIG-API-KEY': apiKey as string,
        },
      });

      const data = await response.json();

      if (data?.status || !data?.data) {
        console.log("An error occurred while fetching experiment overrides.");
        setError("An error occurred while fetching experiment overrides.");
      }

      setIsLoading(false)
      setExperimentOverrides(data?.data?.userIDOverrides);
    }

    if (currentExperimentId) {
      getExperimentOverrides();
    }
  }, [currentExperimentId]);

  const handleCloseSheet = () => {
    setCurrentExperimentId(null);
    setExperimentOverrides(null);
    setIsLoading(true);
    setError(null);
    setExperimentModalOpen(false);
  }

  return (
    <Sheet
      isOpen={isExperimentModalOpen}
      onClose={handleCloseSheet}
      snapPoints={[250]}
    >
      <Sheet.Container className={'py-3 px-4'}>
        <Sheet.Header>
          <div className="flex justify-between">
            <div className="max-w-[525px]">
              <h1 className={'text-2xl font-bold'}>Experiment</h1>
              <p className="text-sm text-gray-700">
                Here you can view and enable the overrides for experiment: <b>{currentExperimentId}</b>.
              </p>
            </div>
            <Button
              as="a"
              color="primary"
              endContent={<ExternalLinkIcon color={'white'}/>}
              href={`https://console.statsig.com/experiments/${currentExperimentId}`}
              size="sm"
              target="_blank"
              variant="solid"
            >
              Open Statsig
            </Button>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col justify-between" draggableAt="both">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner className="h-full"/>
              </div>
            ) : (
              <>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!error && experimentOverrides && (
                  <>
                    <ExperimentOverrides overrides={experimentOverrides}/>
                    <div className="flex justify-end space-x-2">
                      <Button color="danger" onPress={handleCloseSheet} size="sm" variant="bordered">
                        Close
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleCloseSheet}/>
    </Sheet>
  )
}

export default ExperimentSheet
