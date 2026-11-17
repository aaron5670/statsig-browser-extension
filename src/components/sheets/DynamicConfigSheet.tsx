import DetailDialog from "~/components/DetailDialog";
import { useDynamicConfig } from "~/hooks/useDynamicConfig";
import { useStore } from "~/store/useStore";
import {
  CopyDetailValue,
  DetailMetadata,
  DetailState,
  OpenStatsig
} from "./DetailContent";
import { JsonValue } from "./JsonValue";

const DynamicConfigSheet = () => {
  const { currentItemId, isItemSheetOpen, setItemSheetOpen } = useStore(
    (state) => state
  );
  const { dynamicConfig, error, isLoading, retry } = useDynamicConfig(
    isItemSheetOpen ? currentItemId : undefined
  );

  return (
    <DetailDialog
      isOpen={isItemSheetOpen}
      onClose={() => setItemSheetOpen(false)}
      title={dynamicConfig?.name || currentItemId || "Dynamic config details"}
      actions={
        currentItemId && (
          <OpenStatsig
            path={`dynamic_configs/${encodeURIComponent(currentItemId)}`}
          />
        )
      }>
      <div key={currentItemId} className="grid gap-5">
        {currentItemId && (
          <CopyDetailValue label="Copy key" value={currentItemId} />
        )}

        {dynamicConfig && (
          <>
            <DetailMetadata
              created={dynamicConfig.createdTime}
              creator={dynamicConfig.creatorName}
              description={dynamicConfig.description}
              editor={dynamicConfig.lastModifierName}
              updated={dynamicConfig.lastModifiedTime}
            />
            <section className="grid gap-2">
              <h3 className="text-sm font-semibold">Default value</h3>
              {dynamicConfig.defaultValue === undefined ? (
                <p className="text-sm text-default-600">
                  No default value is configured.
                </p>
              ) : (
                <div className="min-w-0 rounded-xl border border-divider bg-default-50 px-3 py-2 font-mono text-xs leading-6 wrap-anywhere">
                  <JsonValue expanded value={dynamicConfig.defaultValue} />
                </div>
              )}
            </section>
          </>
        )}
        {isLoading ? (
          <DetailState loading="Loading dynamic config details…" />
        ) : (
          error && <DetailState error={error} onRetry={retry} />
        )}
      </div>
    </DetailDialog>
  );
};

export default DynamicConfigSheet;
