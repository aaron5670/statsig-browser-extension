import type { Experiment, Group } from "~/types/statsig";
import { ExperimentDisclosure } from "./ExperimentDisclosure";

export function ExperimentTraffic({ experiment }: { experiment: Experiment }) {
  const { allocation, controlGroupID, launchedGroupID } = experiment;
  const isControl = (group: Group) =>
    group.isControl ?? group.id === controlGroupID;
  const groups = (experiment.groups ?? []).toSorted(
    (left, right) => Number(isControl(right)) - Number(isControl(left))
  );
  const parameterGroups = groups.filter(
    (group) => Object.keys(group.parameterValues ?? {}).length > 0
  );

  return (
    <section className="min-w-0 self-start">
      <h3 className="text-sm font-semibold">Traffic split</h3>
      {Number.isFinite(allocation) && (
        <p className="mt-1 text-sm text-foreground-600">
          Experiment allocation{" "}
          <strong className="font-semibold text-foreground tabular-nums">
            {allocation}%
          </strong>{" "}
          of eligible traffic
        </p>
      )}
      {groups.length > 0 && (
        <p className="mt-2 text-xs font-medium text-foreground-600">
          Share of experiment traffic
        </p>
      )}
      {groups.length > 0 ? (
        <ul
          aria-label="Group shares of experiment traffic"
          className="mt-1 divide-y divide-divider border-y border-divider">
          {groups.map((group) => {
            const control = isControl(group);
            const shipped = group.shipped ?? group.id === launchedGroupID;
            const size = group.size;
            const hasShare = Number.isFinite(size) && size >= 0 && size <= 100;

            return (
              <li
                className="grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-1.5 text-sm"
                key={group.id}>
                <div className="min-w-0 wrap-anywhere">
                  <span className="font-medium">{group.name || group.id}</span>
                  <span className="flex flex-wrap items-center gap-x-2 text-xs text-foreground-600">
                    {control && group.name?.toLowerCase() !== "control" && (
                      <span>Control</span>
                    )}
                    {shipped && (
                      <span className="font-medium text-primary-700">
                        Shipped
                      </span>
                    )}
                  </span>
                </div>
                {hasShare ? (
                  <span className="flex items-center gap-2 text-xs font-medium tabular-nums">
                    <span
                      aria-hidden="true"
                      className="h-1 w-10 overflow-hidden rounded-full bg-default-200">
                      <span
                        className={`block h-full rounded-full ${control ? "bg-foreground-400" : "bg-primary"}`}
                        style={{ width: `${size}%` }}
                      />
                    </span>
                    <span className="min-w-9 text-right">{size}%</span>
                  </span>
                ) : (
                  <span className="text-xs text-foreground-600">
                    Unavailable
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-foreground-600">
          No groups are configured.
        </p>
      )}
      {parameterGroups.length > 0 && (
        <ExperimentDisclosure title="Parameters">
          <ul className="grid gap-3">
            {parameterGroups.map((group) => (
              <li className="min-w-0" key={group.id}>
                <h4 className="text-xs font-semibold wrap-anywhere">
                  {group.name || group.id}
                </h4>
                <dl className="mt-1 border-s border-divider ps-2 font-mono text-xs leading-relaxed">
                  {Object.entries(group.parameterValues ?? {}).map(
                    ([name, value]) => (
                      <div className="wrap-anywhere" key={name}>
                        <dt className="inline text-foreground-600">{name} </dt>
                        <dd className="inline whitespace-pre-wrap">
                          {JSON.stringify(value)}
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </li>
            ))}
          </ul>
        </ExperimentDisclosure>
      )}
    </section>
  );
}
