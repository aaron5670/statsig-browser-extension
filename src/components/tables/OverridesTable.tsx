import type {Override} from "~components/experiment/ExperimentOverrides";
import type {Key} from "react";

import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {useOverrides} from "~hooks/useOverrides";
import {useStore} from "~store/useStore";
import React, {useCallback} from "react";

import {DeleteIcon} from "../icons/DeleteIcon";
import {EditIcon} from "../icons/EditIcon";

/**
 * TODO: Add edit and delete functionality
 */
export default function OverridesTable() {
  const {currentExperimentId} = useStore((state) => state);
  const {overrides} = useOverrides(currentExperimentId);
  const [typeApiKey] = useLocalStorage("statsig-type-api-key", 'read-key');

  const columns = [
    {name: "ID", uid: "ids"},
    {name: "OVERRIDE", uid: "groupID"},
    {name: "ENVIRONMENT", uid: "environment"},
    ...(typeApiKey === 'read-key' ? [] : [{name: "ACTIONS", uid: "actions"}])
  ];

  const renderCell = useCallback((override: Override, columnKey: Key) => {
    const cellValue = override[columnKey as keyof Override];

    switch (columnKey) {
      case "actions":
        if (typeApiKey === 'read-key') return null;
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip
              closeDelay={0}
              // content="Edit override"
              content="Comming soon"
            >
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon/>
              </span>
            </Tooltip>
            <Tooltip
              color="danger"
              // content="Delete group"
              content="Comming soon"
            >
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon/>
              </span>
            </Tooltip>
          </div>
        );
      case 'environment':
        return (
          <p className="capitalize border-none gap-1 text-default-600">
            {cellValue === null ? "All environments" : cellValue}
          </p>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Groups table" classNames={{th: [""]}}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn align={column.uid === "actions" ? "center" : "start"} key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={overrides}>
        {(item) => (
          <TableRow key={item.ids[0]}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
