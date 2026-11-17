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
import type { Override } from "~/components/experiment/ExperimentOverrides";
import { deleteOverride } from "~/handlers/deleteOverride";
import { keyListItems } from "~/helpers/keyListItems";
import { useOverrides } from "~/hooks/useOverrides";
import { useStore } from "~/store/useStore";
import { useEffect, useId, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import useSWRMutation from "swr/mutation";
import { DetailState } from "../sheets/DetailContent";

export default function OverridesTable() {
  const [typeApiKey] = useLocalStorage("statsig-type-api-key", "read-key");
  const currentExperimentId = useStore((state) => state.currentItemId);
  const { error, isLoading, overrides, retry } =
    useOverrides(currentExperimentId);
  const [selected, setSelected] = useState<Override>();
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const confirmationId = useId();
  const deleteTrigger = useRef<Element>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected) cancelButton.current?.focus();
  }, [selected]);

  const { isMutating, trigger } = useSWRMutation(
    `/experiments/${currentExperimentId}/overrides`,
    deleteOverride
  );

  const remove = async () => {
    if (!selected || isMutating) return;
    setDeleteError("");

    try {
      const result = await trigger({
        experimentId: currentExperimentId,
        override: selected
      });
      if (!result.success) throw new Error(result.error);
      setSelected(undefined);
      setNotice("Override deleted.");
    } catch {
      setDeleteError(
        "Couldn’t delete the override. Check your permissions and try again."
      );
    }
  };

  const columns = [
    { name: "IDs", uid: "ids" },
    { name: "Group", uid: "groupID" },
    { name: "Environment", uid: "environment" },
    ...(typeApiKey === "write-key" ? [{ name: "Actions", uid: "actions" }] : [])
  ];

  if (isLoading) return <DetailState loading="Loading experiment overrides…" />;
  if (error) return <DetailState error={error} onRetry={retry} />;

  return (
    <div className="grid gap-3">
      <div
        role="status"
        className={notice ? "text-sm text-default-700" : "sr-only"}>
        {notice}
      </div>
      {selected && (
        <div className="grid gap-2 rounded-xl border border-divider px-4 py-3">
          <p className="text-sm wrap-anywhere" id={confirmationId}>
            Delete the override for <strong>{selected.ids.join(", ")}</strong>?
          </p>
          {deleteError && (
            <p className="text-sm text-danger" role="alert">
              {deleteError}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              aria-describedby={confirmationId}
              isDisabled={isMutating}
              onPress={() => {
                setSelected(undefined);
                if (deleteTrigger.current instanceof HTMLElement)
                  deleteTrigger.current.focus();
              }}
              radius="sm"
              ref={cancelButton}
              size="sm"
              variant="bordered">
              Cancel
            </Button>
            <Button
              aria-describedby={confirmationId}
              color="danger"
              isLoading={isMutating}
              onPress={remove}
              radius="sm"
              size="sm">
              Delete override
            </Button>
          </div>
        </div>
      )}
      <Table aria-label="Experiment overrides" removeWrapper>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              align={column.uid === "actions" ? "end" : "start"}
              key={column.uid}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No overrides are configured."
          items={keyListItems(overrides, JSON.stringify)}>
          {({ item, key }) => (
            <TableRow key={key}>
              {(columnKey) => (
                <TableCell className="wrap-anywhere">
                  {columnKey === "actions" ? (
                    <Button
                      aria-label={`Delete override for ${item.ids.join(", ")}`}
                      color="danger"
                      isDisabled={isMutating}
                      isIconOnly
                      onPress={(event) => {
                        deleteTrigger.current = event.target;
                        setSelected(item);
                        setDeleteError("");
                        setNotice("");
                      }}
                      radius="sm"
                      size="sm"
                      variant="light">
                      <FiTrash2 aria-hidden="true" />
                    </Button>
                  ) : columnKey === "ids" ? (
                    item.ids.join(", ")
                  ) : columnKey === "environment" ? (
                    item.environment || "All environments"
                  ) : (
                    item.groupID
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
