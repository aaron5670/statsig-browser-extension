import { ExperimentDisclosure } from "~/components/experiment/ExperimentDisclosure";
import { keyListItems } from "~/helpers/keyListItems";
import type { Experiment } from "~/types/statsig";

export function ExperimentMetrics({ experiment }: { experiment: Experiment }) {
  const roles = [
    { label: "Primary", metrics: experiment.primaryMetrics ?? [] },
    { label: "Secondary", metrics: experiment.secondaryMetrics ?? [] },
    { label: "Other", metrics: experiment.otherMetrics ?? [] }
  ].filter(({ metrics }) => metrics.length > 0);

  if (!roles.length) return null;

  return (
    <ExperimentDisclosure
      title="Configured metrics"
      summary={roles
        .map(({ label, metrics }) => `${metrics.length} ${label.toLowerCase()}`)
        .join(" · ")}>
      <div
        className={`grid gap-x-6 gap-y-4 ${roles.length > 1 ? "min-[500px]:grid-cols-2" : ""}`}>
        {roles.map(({ label, metrics }) => (
          <div className="min-w-0" key={label}>
            <h3 className="mb-1 text-xs font-semibold text-foreground-600">
              {label}
            </h3>
            <ul className="space-y-1">
              {keyListItems(metrics, ({ name, type }) =>
                JSON.stringify([name, type])
              ).map(({ item: metric, key }) => (
                <li className="text-sm wrap-anywhere" key={key}>
                  {metric.name}
                  {metrics.some(
                    ({ name, type }) =>
                      name === metric.name && type !== metric.type
                  ) && (
                    <span className="ms-1.5 text-xs text-foreground-600">
                      {metric.type}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ExperimentDisclosure>
  );
}
