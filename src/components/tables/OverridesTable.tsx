import type {Override} from "~components/experiment/ExperimentOverrides";
import type {Key} from "react";

import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {deleteOverride} from "~handlers/deleteOverride";
import {useOverrides} from "~hooks/useOverrides";
import {useStore} from "~store/useStore";
import React, {useCallback} from "react";
import useSWRMutation from "swr/mutation";

import {DeleteIcon} from "../icons/DeleteIcon";

export default function OverridesTable() {
  const [typeApiKey] = useLocalStorage("statsig-type-api-key", 'read-key');
  const currentExperimentId = useStore((state) => state.currentItemId);
  const {overrides} = useOverrides(currentExperimentId);

  const {trigger} = useSWRMutation(`/experiments/${currentExperimentId}/overrides`, deleteOverride);

  const columns = [
    {name: "IDs", uid: "ids"},
    {name: "OVERRIDE", uid: "groupID"},
    {name: "ENVIRONMENT", uid: "environment"},
    ...(typeApiKey === 'read-key' ? [] : [{name: "ACTIONS", uid: "actions"}])
  ];

  const renderCell = useCallback((override: Override, columnKey: Key) => {
    const cellValue = override[columnKey as keyof Override];
    switch (columnKey) {
      case 'ids':
        return (
          <p className="capitalize border-none gap-1 text-default-600">
            {typeof cellValue === 'string' ? cellValue : cellValue.join(', ')}
          </p>
        );
      case 'environment':
        return (
          <p className="capitalize border-none gap-1 text-default-600">
            {!cellValue ? "All environments" : cellValue}
          </p>
        );
      case "actions":
        if (typeApiKey === 'read-key') return null;
        return (
          <div className="flex items-center">
            <Tooltip color="danger" content="Delete override">
              <p
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => trigger({experimentId: currentExperimentId, override}, {
                  optimisticData: current => {
                    const userIDOverrides = current?.data?.userIDOverrides || [];

                    return {
                      ...current,
                      data: {
                        ...current?.data,
                        userIDOverrides: [
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          ...userIDOverrides?.filter((item: Override) => item.ids !== override.ids)
                        ]
                      }
                    };
                  },
                })}
              >
                <DeleteIcon/>
              </p>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Groups table" classNames={{emptyWrapper: 'h-full pt-2'}}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn align={column.uid === "actions" ? "center" : "start"} key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={<p>No overrides found...</p>} items={overrides}>
        {(item) => (
          <TableRow key={item.ids[0]}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
