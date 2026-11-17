import {
  DetailMetadata,
  MetadataField,
  MetadataTime
} from "~/components/sheets/DetailContent";
import type { Experiment } from "~/types/statsig";
import { ExperimentDisclosure } from "./ExperimentDisclosure";

export function ExperimentDetails({ experiment }: { experiment: Experiment }) {
  const owner = experiment.owner?.ownerName?.trim();
  let unitType = experiment.idType;
  if (unitType === "userID") unitType = "User ID";
  if (unitType === "stableID") unitType = "Stable ID";
  const ruleCount = experiment.inlineTargetingRules?.length ?? 0;
  const timeline = [
    { label: "Started", timestamp: experiment.startTime },
    { label: "Ended", timestamp: experiment.endTime },
    { label: "Decision made", timestamp: experiment.decisionTime }
  ];

  return (
    <ExperimentDisclosure
      title="Experiment details"
      summary={owner && `Owner · ${owner}`}>
      <DetailMetadata
        created={experiment.createdTime}
        updated={experiment.lastModifiedTime}
        description={experiment.description?.trim()}>
        {owner && <MetadataField label="Owner">{owner}</MetadataField>}
        {experiment.team && (
          <MetadataField label="Team">{experiment.team}</MetadataField>
        )}
        {unitType && (
          <MetadataField label="Unit type">{unitType}</MetadataField>
        )}
        {experiment.targetingGateID && (
          <MetadataField label="Targeting gate">
            <a
              className="font-medium text-primary underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-focus"
              href={`https://console.statsig.com/gates/${encodeURIComponent(experiment.targetingGateID)}`}
              rel="noopener noreferrer"
              target="_blank">
              {experiment.targetingGateID}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </MetadataField>
        )}
        {ruleCount > 0 && (
          <MetadataField label="Inline targeting rules">
            <a
              className="font-medium text-primary underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-focus"
              href={`https://console.statsig.com/experiments/${encodeURIComponent(experiment.id)}/setup`}
              rel="noopener noreferrer"
              target="_blank">
              {ruleCount} in Statsig
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </MetadataField>
        )}
        {timeline.map(
          ({ label, timestamp }) =>
            Number.isFinite(timestamp) && (
              <MetadataField key={label} label={label}>
                <MetadataTime timestamp={timestamp} />
              </MetadataField>
            )
        )}
      </DetailMetadata>
    </ExperimentDisclosure>
  );
}
