export const experimentStatuses: Record<string, string> = {
  abandoned: "Abandoned",
  active: "In progress",
  archived: "Archived",
  decision_made: "Decision made",
  setup: "Setup"
};

export function statusLabel(status: string) {
  const key = status.toLowerCase();
  const label = key.replaceAll("_", " ");
  return (
    experimentStatuses[key] ?? label.charAt(0).toUpperCase() + label.slice(1)
  );
}
