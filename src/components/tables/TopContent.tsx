import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  type Selection
} from "@heroui/react";
import type { ChangeEvent } from "react";
import { ChevronDownIcon } from "~/components/icons/ChevronDownIcon";
import { ExternalLinkIcon } from "~/components/icons/ExternalLinkIcon";
import { SearchIcon } from "~/components/icons/SearchIcon";

interface Option {
  key: string;
  label: string;
}

interface Props {
  columns: Option[];
  filterValue: string;
  onRowsPerPageChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (selection: Selection) => void;
  onVisibleColumnsChange: (selection: Selection) => void;
  resourceName: string;
  rowsPerPage: number;
  selectedStatuses: Iterable<string>;
  statusOptions: Option[];
  summary: string;
  visibleColumns: Iterable<string>;
}

export default function TopContent({
  columns,
  filterValue,
  onRowsPerPageChange,
  onSearchChange,
  onStatusChange,
  onVisibleColumnsChange,
  resourceName,
  rowsPerPage,
  selectedStatuses,
  statusOptions,
  summary,
  visibleColumns
}: Props) {
  const selectedStatusCount = Array.from(selectedStatuses).length;
  const filterIsActive =
    selectedStatusCount > 0 && selectedStatusCount < statusOptions.length;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          aria-label={`Search ${resourceName}`}
          classNames={{
            base: "flex-1 basis-44",
            input: "text-[13px] placeholder:text-foreground-600",
            inputWrapper:
              "min-h-9 border border-default-300 bg-background shadow-none"
          }}
          isClearable
          onValueChange={onSearchChange}
          placeholder={`Search ${resourceName}…`}
          radius="sm"
          size="sm"
          startContent={
            <SearchIcon className="size-4 shrink-0 text-foreground-600" />
          }
          value={filterValue}
          variant="bordered"
        />
        <div className="flex flex-wrap items-center gap-1 min-[420px]:gap-2">
          {statusOptions.length > 0 && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  className="min-h-9 min-w-0 gap-1.5 border px-1.5 text-xs min-[420px]:px-3 min-[420px]:text-[13px]"
                  color={filterIsActive ? "primary" : "default"}
                  endContent={<ChevronDownIcon />}
                  radius="sm"
                  size="sm"
                  variant={filterIsActive ? "flat" : "bordered"}>
                  Status{filterIsActive ? ` (${selectedStatusCount})` : ""}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filter by status"
                closeOnSelect={false}
                items={statusOptions}
                onSelectionChange={onStatusChange}
                selectedKeys={selectedStatuses}
                selectionMode="multiple">
                {(option) => (
                  <DropdownItem key={option.key}>{option.label}</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                className="min-h-9 min-w-0 gap-1.5 border px-1.5 text-xs min-[420px]:px-3 min-[420px]:text-[13px]"
                endContent={<ChevronDownIcon />}
                radius="sm"
                size="sm"
                variant="bordered">
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Visible columns"
              closeOnSelect={false}
              disabledKeys={["name"]}
              items={columns}
              onSelectionChange={onVisibleColumnsChange}
              selectedKeys={visibleColumns}
              selectionMode="multiple">
              {(option) => (
                <DropdownItem key={option.key}>{option.label}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          <Link
            className="min-h-9 gap-1.5 rounded-small border border-default-200 px-1.5 text-xs text-foreground hover:bg-default-100 min-[420px]:px-3 min-[420px]:text-[13px] [&>svg]:size-4"
            href="https://console.statsig.com/"
            rel="noreferrer"
            target="_blank">
            Open in Statsig
            <ExternalLinkIcon color="currentColor" />
          </Link>
        </div>
      </div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[13px] text-foreground-700">
        <p className="tabular-nums" role="status">
          {summary}
        </p>
        <label className="ml-auto inline-flex items-center gap-2">
          Rows per page
          <select
            className="min-h-8 rounded-small border border-default-300 bg-background px-2 text-foreground focus-visible:outline-2 focus-visible:outline-focus"
            onChange={onRowsPerPageChange}
            value={rowsPerPage}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );
}
