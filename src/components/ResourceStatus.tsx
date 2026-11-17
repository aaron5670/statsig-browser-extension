import { Chip, type ChipProps } from "@heroui/react";
import { statusLabel } from "~/helpers/statusLabel";

const statusColors: Record<string, ChipProps["color"]> = {
  abandoned: "danger",
  active: "success",
  "in progress": "success",
  decision_made: "primary",
  setup: "warning"
};

export function ResourceStatus({ status }: { status: string }) {
  return (
    <Chip
      as="span"
      classNames={{
        base: "h-auto max-w-full gap-1 border-none px-0",
        content: "whitespace-normal px-0 text-foreground-700"
      }}
      color={statusColors[status.toLowerCase()] ?? "default"}
      size="sm"
      variant="dot">
      {statusLabel(status)}
    </Chip>
  );
}
