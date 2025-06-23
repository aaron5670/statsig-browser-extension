import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import {
  dynamicConfigColumns,
  experimentColumns,
  experimentStatusOptions,
  featureGateColumns
} from "~components/data";
import { ChevronDownIcon } from "~components/icons/ChevronDownIcon";
import { ExternalLinkIcon } from "~components/icons/ExternalLinkIcon";
import { SearchIcon } from "~components/icons/SearchIcon";
import React, { useMemo } from "react";

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const TopContent = ({
  filterValue,
  hasSearchFilter,
  onRowsPerPageChange,
  onSearchChange,
  rowsPerPage,
  setFilterValue,
  setStatusFilter,
  setVisibleColumns,
  statusFilter,
  total,
  type,
  visibleColumns,
}) => useMemo(() => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Input
          autoFocus={true}
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          isClearable
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
          placeholder={`Search ${type === 'experiments' ? 'experiment' : type === 'dynamicConfigs' ? 'dynamic config' : 'feature gate'} by name...`}
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={filterValue}
          variant="bordered"
        />
        <div className="flex gap-3">
          {type === 'experiments' && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                disallowEmptySelection
                onSelectionChange={(item) => {
                  setStatusFilter(item);
                }}
                selectedKeys={statusFilter}
                selectionMode="multiple"
              >
                {experimentStatusOptions.map((status) => (
                  <DropdownItem className="capitalize" key={status.uid}>
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {type === 'experiments' && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                disallowEmptySelection
                onSelectionChange={(item) => {
                  setVisibleColumns(Array.from(item));
                }}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
              >
                {experimentColumns.map((column) => (
                  <DropdownItem className="capitalize" key={column.uid}>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {type === 'dynamicConfigs' && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                disallowEmptySelection
                onSelectionChange={(item) => {
                  setVisibleColumns(Array.from(item));
                }}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
              >
                {dynamicConfigColumns.map((column) => (
                  <DropdownItem className="capitalize" key={column.uid}>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {type === 'featureGates' && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                disallowEmptySelection
                onSelectionChange={(item) => {
                  setVisibleColumns(Array.from(item));
                }}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
              >
                {featureGateColumns.map((column) => (
                  <DropdownItem className="capitalize" key={column.uid}>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          <Button
            as={'a'}
            className="bg-foreground text-background"
            endContent={<ExternalLinkIcon color={'white'} />}
            href={"https://console.statsig.com/"}
            size="sm"
            target="_blank"
          >
            Open Statsig
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {total} {type === 'experiments' ? 'experiments' : type === 'dynamicConfigs' ? 'dynamic configs' : 'feature gates'}
        </span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
            value={rowsPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );
}, [
  filterValue,
  statusFilter,
  visibleColumns,
  onSearchChange,
  onRowsPerPageChange,
  rowsPerPage,
  total,
  hasSearchFilter,
]);

export default TopContent;
