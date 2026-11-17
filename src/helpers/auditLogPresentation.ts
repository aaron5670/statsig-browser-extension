export function auditActionLabel(action = "") {
  const label = action?.replace(/_/g, " ").trim();
  return label ? label[0].toUpperCase() + label.slice(1) : "Activity";
}

export function auditActionColor(action = "") {
  if (/delete|(?:^|_)archive|abandon/i.test(action)) return "danger";
  if (/restart|pause|stop/i.test(action)) return "warning";
  if (/create|start/i.test(action)) return "success";
  return "default";
}

export function auditTimestamp(date: string, time: string) {
  const timestamp = new Date(`${date}T${time}`);
  if (Number.isFinite(timestamp.getTime())) return timestamp;

  const fallback = new Date(`${date} ${time}`);
  return Number.isFinite(fallback.getTime()) ? fallback : null;
}
