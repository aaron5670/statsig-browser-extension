import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { FiEdit2 } from "react-icons/fi";
import { useExperiment } from "~/hooks/useExperiment";
import { useStore } from "~/store/useStore";
import type { Group } from "~/types/statsig";
import { DetailState } from "../sheets/DetailContent";

export default function GroupsTable({
  onEdit
}: {
  onEdit: (group: Group) => void;
}) {
  const [typeApiKey] = useLocalStorage("statsig-type-api-key", "read-key");
  const currentItemId = useStore((state) => state.currentItemId);
  const { error, experiment, isLoading, retry } = useExperiment(currentItemId);
  const groups = experiment?.groups ?? [];

  const columns = [
    { name: "Group", uid: "name" },
    { name: "Group share", uid: "size" },
    ...(typeApiKey === "write-key" ? [{ name: "Actions", uid: "actions" }] : [])
  ];

  if (isLoading) return <DetailState loading="Loading experiment groups…" />;
  if (error) return <DetailState error={error} onRetry={retry} />;

  return (
    <Table aria-label="Experiment groups" removeWrapper>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            align={column.uid === "actions" ? "end" : "start"}
            key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="No groups are configured." items={groups}>
        {(group) => (
          <TableRow key={group.id}>
            {(columnKey) => (
              <TableCell className="wrap-anywhere">
                {columnKey === "actions" ? (
                  <Button
                    aria-label={`Rename ${group.name}`}
                    isIconOnly
                    onPress={() => onEdit(group)}
                    radius="sm"
                    size="sm"
                    variant="light">
                    <FiEdit2 aria-hidden="true" />
                  </Button>
                ) : columnKey === "size" ? (
                  <span className="tabular-nums">{group.size}%</span>
                ) : (
                  group.name
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
