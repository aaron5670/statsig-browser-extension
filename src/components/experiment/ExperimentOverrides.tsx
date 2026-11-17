import { useLocalStorage } from "@uidotdev/usehooks";
import { keyListItems } from "~/helpers/keyListItems";
import { useStore } from "~/store/useStore";
import { OverrideButton, OverrideControls } from "./OverrideControls";

export type Override = {
  environment?: string;
  groupID: string;
  ids: string[];
};

export function ExperimentOverrides({ overrides }: { overrides: Override[] }) {
  const experimentId = useStore((state) => state.currentItemId);
  const [keyType] = useLocalStorage("statsig-type-api-key", "read-key");

  if (!overrides.length) {
    return (
      <section className="grid justify-items-start gap-2">
        <h3 className="text-sm font-semibold">Experiment overrides</h3>
        <p className="text-sm text-default-600">
          {keyType === "write-key"
            ? "No overrides are configured. Create one under Manage experiment."
            : "No overrides are configured. "}
          {keyType === "read-key" && (
            <a
              className="font-medium text-primary underline underline-offset-2"
              href={`https://console.statsig.com/experiments/${encodeURIComponent(experimentId)}/setup`}
              rel="noopener noreferrer"
              target="_blank">
              Manage overrides in Statsig
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </p>
      </section>
    );
  }

  const options = overrides.flatMap((override) => override.ids);

  return (
    <OverrideControls options={options} title="Experiment overrides">
      {({ activeId, disabled, setOverride }) => (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,7rem),1fr))] gap-x-3 gap-y-2">
          {keyListItems(overrides, (override) => JSON.stringify(override)).map(
            ({ item, key }) => (
              <li className="grid min-w-0 grid-rows-[1fr_auto] gap-1" key={key}>
                <p className="text-xs leading-4 wrap-anywhere">
                  {item.groupID && (
                    <span className="block font-medium">{item.groupID}</span>
                  )}
                  <span className="block text-foreground-600">
                    {item.environment || "All environments"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(item.ids)].map((id) => (
                    <OverrideButton
                      key={id}
                      identity={id}
                      active={activeId === id}
                      disabled={disabled}
                      onApply={() => setOverride(id, options)}
                    />
                  ))}
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </OverrideControls>
  );
}
