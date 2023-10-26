import type {Group} from "~types/statsig";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip
} from "@nextui-org/react";
import {EditIcon} from "@nextui-org/shared-icons";
import {useLocalStorage} from "@uidotdev/usehooks";
import {useExperiment} from "~hooks/useExperiment";
import {useStore} from "~store/useStore";
import React, {type Key, useCallback} from "react";

interface Props {
  changeView: () => void;
  setCurrentGroup: (group?: Group) => void;
}

export default function GroupsTable({changeView, setCurrentGroup}: Props) {
  const [typeApiKey] = useLocalStorage("statsig-type-api-key", 'read-key');
  const {currentExperimentId} = useStore((state) => state);
  const {experiment} = useExperiment(currentExperimentId);
  const {groups} = experiment;

  const columns = [
    {name: "NAME", uid: "name"},
    {name: "SIZE", uid: "size"},
    ...(typeApiKey === 'read-key' ? [] : [{name: "ACTIONS", uid: "actions"}])
  ];

  const updateGroup = (group: Group) => {
    setCurrentGroup(group);
    changeView();
  };

  const renderCell = useCallback((group: Group, columnKey: Key) => {
    const cellValue = group[columnKey as keyof Group];

    switch (columnKey) {
      case "actions":
        return (
          <div className="flex items-center">
            <Tooltip content="Edit group">
              <div
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => updateGroup(group)}
              >
                <EditIcon />
              </div>
            </Tooltip>
          </div>
        );
      case 'size':
        return (
          <p className="capitalize border-none gap-1 text-default-600">
            {cellValue}%
          </p>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Groups table" classNames={{th: ["w-full"]}}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn align={column.uid === "actions" ? "center" : "start"} key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={groups}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
