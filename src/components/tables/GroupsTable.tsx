import type {Group} from "~types/statsig";

import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import React, {type Key, useCallback} from "react";

const columns = [
  {name: "NAME", uid: "name"},
  {name: "SIZE", uid: "size"},
  // {name: "ACTIONS", uid: "actions"},
];

/**
 * TODO: Add edit and delete functionality
 */
export default function GroupsTable({groups}: { groups: Group[] }) {
  const renderCell = useCallback((group: Group, columnKey: Key) => {
    const cellValue = group[columnKey as keyof Group];

    switch (columnKey) {
      // case "actions":
      //   return (
      //     <div className="relative flex items-center gap-2">
      //       <Tooltip content="Edit group">
      //         <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      //           <EditIcon />
      //         </span>
      //       </Tooltip>
      //       <Tooltip color="danger" content="Delete group">
      //         <span className="text-lg text-danger cursor-pointer active:opacity-50">
      //           <DeleteIcon />
      //         </span>
      //       </Tooltip>
      //     </div>
      //   );
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
