import { Button } from "@heroui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import DetailDialog from "~/components/DetailDialog";
import { ExperimentDetails } from "~/components/experiment/ExperimentDetails";
import { ExperimentMetrics } from "~/components/experiment/ExperimentMetrics";
import { ExperimentOverrides } from "~/components/experiment/ExperimentOverrides";
import { ExperimentTraffic } from "~/components/experiment/ExperimentTraffic";
import { HealthCheckSection } from "~/components/HealthCheckSection";
import { HypothesisSection } from "~/components/HypothesisSection";
import { ResourceStatus } from "~/components/ResourceStatus";
import { useExperiment } from "~/hooks/useExperiment";
import { useOverrides } from "~/hooks/useOverrides";
import { useStore } from "~/store/useStore";
import { CopyDetailValue, DetailState, OpenStatsig } from "./DetailContent";

const ExperimentSheet = () => {
  const {
    currentItemId,
    isItemSheetOpen,
    setItemSheetOpen,
    setManageExperimentModalOpen
  } = useStore((state) => state);
  const [keyType] = useLocalStorage("statsig-type-api-key", "read-key");
  const id = isItemSheetOpen ? currentItemId : undefined;
  const experimentQuery = useExperiment(id);
  const overridesQuery = useOverrides(id);
  const { experiment } = experimentQuery;

  return (
    <DetailDialog
      isOpen={isItemSheetOpen}
      onClose={() => setItemSheetOpen(false)}
      title={experiment?.name || currentItemId || "Experiment details"}
      description={
        experiment?.status && <ResourceStatus status={experiment.status} />
      }
      actions={
        currentItemId && (
          <OpenStatsig
            path={`experiments/${encodeURIComponent(currentItemId)}`}
          />
        )
      }
      footer={
        currentItemId && (
          <div
            key={currentItemId}
            className="flex w-full flex-wrap items-center justify-between gap-2">
            <CopyDetailValue label="Copy key" value={currentItemId} />
            <Button
              className="min-h-9"
              onPress={() => setManageExperimentModalOpen(true)}
              radius="sm"
              size="sm"
              variant="bordered">
              {keyType === "write-key"
                ? "Manage experiment"
                : "Groups and overrides"}
            </Button>
          </div>
        )
      }>
      <div key={currentItemId} className="grid min-w-0 gap-4">
        <div className="grid items-start gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="min-w-0">
            {overridesQuery.isLoading ? (
              <DetailState loading="Loading experiment overrides…" />
            ) : overridesQuery.error ? (
              <DetailState
                error={overridesQuery.error}
                onRetry={overridesQuery.retry}
              />
            ) : (
              <ExperimentOverrides overrides={overridesQuery.overrides} />
            )}
          </div>
          <div className="min-w-0 border-t border-divider pt-3 sm:border-s sm:border-t-0 sm:ps-5 sm:pt-0">
            {experiment ? (
              <ExperimentTraffic experiment={experiment} />
            ) : experimentQuery.isLoading ? (
              <DetailState loading="Loading experiment details…" />
            ) : (
              experimentQuery.error && (
                <DetailState
                  error={experimentQuery.error}
                  onRetry={experimentQuery.retry}
                />
              )
            )}
          </div>
        </div>
        {experiment && (
          <>
            <div className="border-t border-divider">
              <HealthCheckSection healthChecks={experiment.healthChecks} />
              <ExperimentMetrics experiment={experiment} />
              <ExperimentDetails experiment={experiment} />
            </div>
            <HypothesisSection hypothesis={experiment.hypothesis} />
          </>
        )}
      </div>
    </DetailDialog>
  );
};

export default ExperimentSheet;
