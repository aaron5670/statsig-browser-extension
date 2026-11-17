import { Chip } from "@heroui/react";
import DetailDialog from "~/components/DetailDialog";
import FeatureGateRules from "~/components/FeatureGateRules";
import { GateOverrides } from "~/components/GateOverrides";
import { statusLabel } from "~/helpers/statusLabel";
import { useFeatureGate } from "~/hooks/useFeatureGate";
import { useGateOverrides } from "~/hooks/useGateOverrides";
import { useStore } from "~/store/useStore";
import {
  CopyDetailValue,
  DetailMetadata,
  DetailState,
  MetadataField,
  OpenStatsig
} from "./DetailContent";

const FeatureGateSheet = () => {
  const { currentItemId, isItemSheetOpen, setItemSheetOpen } = useStore(
    (state) => state
  );
  const id = isItemSheetOpen ? currentItemId : undefined;
  const gateQuery = useFeatureGate(id);
  const overridesQuery = useGateOverrides(id);
  const { featureGate } = gateQuery;

  return (
    <DetailDialog
      isOpen={isItemSheetOpen}
      onClose={() => setItemSheetOpen(false)}
      title={featureGate?.name || currentItemId || "Feature gate details"}
      actions={
        currentItemId && (
          <OpenStatsig path={`gates/${encodeURIComponent(currentItemId)}`} />
        )
      }>
      <div key={currentItemId} className="grid gap-5">
        {currentItemId && (
          <CopyDetailValue label="Copy key" value={currentItemId} />
        )}

        {featureGate && (
          <DetailMetadata
            created={featureGate.createdTime}
            description={featureGate.description}
            updated={featureGate.lastModifiedTime}>
            <MetadataField label="Status">
              {featureGate.status
                ? statusLabel(featureGate.status)
                : "Unavailable"}
            </MetadataField>
            <MetadataField label="Enabled">
              {typeof featureGate.isEnabled === "boolean"
                ? featureGate.isEnabled
                  ? "Yes"
                  : "No"
                : "Unavailable"}
            </MetadataField>
            {!!featureGate.tags?.length && (
              <MetadataField className="col-span-full" label="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {[...new Set(featureGate.tags)].map((tag) => (
                    <Chip
                      classNames={{
                        content: "whitespace-normal wrap-anywhere"
                      }}
                      key={tag}
                      size="sm"
                      variant="flat">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </MetadataField>
            )}
          </DetailMetadata>
        )}
        {gateQuery.isLoading ? (
          <DetailState loading="Loading feature gate details…" />
        ) : (
          gateQuery.error && (
            <DetailState error={gateQuery.error} onRetry={gateQuery.retry} />
          )
        )}

        {id && <FeatureGateRules featureGateId={id} />}

        {overridesQuery.isLoading ? (
          <DetailState loading="Loading feature gate overrides…" />
        ) : overridesQuery.error ? (
          <DetailState
            error={overridesQuery.error}
            onRetry={overridesQuery.retry}
          />
        ) : (
          overridesQuery.overrides && (
            <GateOverrides overrides={overridesQuery.overrides} />
          )
        )}
      </div>
    </DetailDialog>
  );
};

export default FeatureGateSheet;
