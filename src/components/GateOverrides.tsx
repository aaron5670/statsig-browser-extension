import { keyListItems } from "~/helpers/keyListItems";
import type { GateOverride } from "~/types/statsig";
import {
  OverrideButton,
  OverrideControls
} from "./experiment/OverrideControls";

export function GateOverrides({ overrides }: { overrides: GateOverride }) {
  const groups = [
    { label: "Passing user IDs", ids: overrides.passingUserIDs },
    { label: "Failing user IDs", ids: overrides.failingUserIDs },
    { label: "Passing custom IDs", ids: overrides.passingCustomIDs },
    { label: "Failing custom IDs", ids: overrides.failingCustomIDs },
    ...(overrides.environmentOverrides ?? []).flatMap(
      ({ environment, unitID, passingIDs, failingIDs }) => {
        const scope = [environment || "All environments", unitID]
          .filter(Boolean)
          .join(" · ");
        return [
          { label: `Passing IDs · ${scope}`, ids: passingIDs },
          { label: `Failing IDs · ${scope}`, ids: failingIDs }
        ];
      }
    )
  ].filter(({ ids }) => ids?.length);
  const options = groups.flatMap(({ ids }) => ids);
  if (!options.length) {
    return (
      <section className="grid gap-1">
        <h3 className="text-sm font-semibold">Gate overrides</h3>
        <p className="text-sm text-default-600">
          No overrides are configured for this feature gate.
        </p>
      </section>
    );
  }

  return (
    <OverrideControls options={options} title="Gate overrides">
      {({ activeId, disabled, setOverride }) => (
        <ul className="grid gap-3">
          {keyListItems(groups, ({ label, ids }) =>
            JSON.stringify([label, ids])
          ).map(({ item, key }) => (
            <li className="grid gap-1" key={key}>
              <p className="text-xs font-medium text-default-600 wrap-anywhere">
                {item.label}
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
          ))}
        </ul>
      )}
    </OverrideControls>
  );
}
