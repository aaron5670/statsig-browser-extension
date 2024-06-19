import type {DynamicConfig} from "~types/statsig";
import type {ChangeEvent, Key} from "react";

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  type Selection,
  type SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {useLocalStorage} from "@uidotdev/usehooks";
import {ExternalLinkIcon} from "~components/icons/ExternalLinkIcon";
import BottomContent from "~components/tables/BottomContent";
import TopContent from "~components/tables/TopContent";
import {useDynamicConfigs} from "~hooks/useDynamicConfigs";
import {useStore} from "~store/useStore";
import React, {useCallback, useMemo, useState} from "react";

import {dynamicConfigColumns} from "./data";
import {VerticalDotsIcon} from "./icons/VerticalDotsIcon";

export default function DynamicConfigs() {
  const {dynamicConfigs, isLoading} = useDynamicConfigs();
  const [visibleColumns, setVisibleColumns] = useLocalStorage("dynamic-config-table-visible-columns", ["name", "tags", "actions"]);
  const [rowsPerPage, setRowsPerPage] = useLocalStorage("dynamic-config-table-rows-per-page", 5);
  const {setCurrentItemId, setItemSheetOpen} = useStore((state) => state);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const pages = Math.ceil(dynamicConfigs.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return dynamicConfigColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredExperiments = [...dynamicConfigs];

    if (hasSearchFilter) {
      filteredExperiments = filteredExperiments.filter((experiment) =>
        experiment.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    return filteredExperiments;
  }, [dynamicConfigs.length, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const setCurrentExperiment = (experimentId: string) => {
    setCurrentItemId(experimentId);
    setItemSheetOpen(true);
  };

  const sortedItems = () => {
    return [...items].sort((a: DynamicConfig, b: DynamicConfig) => {
      const first = a[sortDescriptor.column as keyof DynamicConfig] as number;
      const second = b[sortDescriptor.column as keyof DynamicConfig] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  };

  const renderCell = useCallback((experiment: DynamicConfig, columnKey: Key) => {
    const cellValue = experiment[columnKey as keyof DynamicConfig];

    switch (columnKey) {
      case "name":
        return (
          <p onClick={() => setCurrentExperiment(experiment.id)}>{experiment.name}</p>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={experiment.isEnabled ? "success" : "danger"}
            onClick={() => setCurrentExperiment(experiment.id)}
            size="sm"
            variant="dot"
          >
            {experiment.isEnabled ? "Enabled" : "Disabled"}
          </Chip>
        );
      case "tags":
        return (
          <div className="flex flex-wrap gap-1">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore*/}
            {cellValue.map((tag: string) => (
              <Chip
                className="capitalize"
                color="warning"
                key={tag}
                onClick={() => setCurrentExperiment(experiment.id)}
                size="sm"
                variant="dot"
              >
                {tag}
              </Chip>
            ))}
          </div>
        );
      case "isEnabled":
        return (
            <Chip
                className="capitalize border-none gap-1 text-default-600"
                color={experiment.isEnabled ? "success" : "danger"}
                onClick={() => setCurrentExperiment(experiment.id)}
                size="sm"
                variant="dot"
            >
              {experiment.isEnabled ? "Enabled" : "Disabled"}
            </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown backdrop="opaque" className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon height={20} width={20}/>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => setCurrentExperiment(experiment.id)}>View</DropdownItem>
                <DropdownItem
                  as={'a'}
                  endContent={<ExternalLinkIcon/>}
                  href={`https://console.statsig.com/dynamic_configs/${experiment.id}`}
                  target="_blank"
                >
                  Open on Statsig
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <p onClick={() => setCurrentExperiment(experiment.id)}>{cellValue}</p>
        );
    }
  }, []);

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  return (
    <Table
      aria-label="Table with all Statsig Dynamic Configs"
      bottomContent={<BottomContent
        hasSearchFilter={hasSearchFilter}
        page={page}
        setPage={setPage}
        total={pages}
      />}
      bottomContentPlacement="outside"
      classNames={{
        base: ["base-class"],
        emptyWrapper: ["empty-wrapper-class"],
        th: ["bg-transparent", "text-default-500"],
        tr: ["hover:bg-default-50", "cursor-pointer"],
        wrapper: ["max-h-[382px]", "max-w-3xl", "min-h-[242px]"],
      }}
      fullWidth
      isCompact
      isHeaderSticky
      onSortChange={setSortDescriptor}
      removeWrapper
      selectionMode="none"
      sortDescriptor={sortDescriptor}
      topContent={<TopContent
        filterValue={filterValue}
        hasSearchFilter={hasSearchFilter}
        onRowsPerPageChange={onRowsPerPageChange}
        onSearchChange={onSearchChange}
        rowsPerPage={rowsPerPage}
        setFilterValue={setFilterValue}
        setStatusFilter={setStatusFilter}
        setVisibleColumns={setVisibleColumns}
        statusFilter={statusFilter}
        total={dynamicConfigs.length}
        type="dynamicConfigs"
        visibleColumns={visibleColumns}
      />}
      topContentPlacement="outside"
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            key={column.uid}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={isLoading ? <Spinner className="h-full"/> : "No dynamic configs found"}
        isLoading={!isLoading}
        items={sortedItems()}
      >
        {(item: DynamicConfig) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
