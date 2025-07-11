import type {Experiment} from "~types/statsig";
import type {ChangeEvent, Key} from "react";
import React, {useCallback, useMemo, useState} from "react";

import {
  Button,
  Chip,
  type ChipProps,
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
import {useExperiments} from "~hooks/useExperiments";
import {useStore} from "~store/useStore";
import Fuse from 'fuse.js';

import {experimentColumns, experimentStatusOptions} from "./data";
import {VerticalDotsIcon} from "./icons/VerticalDotsIcon";

const statusMap: Record<string, string> = {
  abandoned: "Abandoned",
  active: "In Progress",
  archived: "Archived",
  decision_made: "Decision Made",
  setup: "Setup",
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  abandoned: "danger",
  active: "success",
  decision_made: "primary",
  setup: "warning",
};

export default function Experiments() {
  const {experiments, isLoading} = useExperiments();
  const [visibleColumns, setVisibleColumns] = useLocalStorage("table-visible-columns", ["name", "status", "actions"]);
  const [rowsPerPage, setRowsPerPage] = useLocalStorage("table-rows-per-page", 5);
  const {setCurrentItemId, setItemSheetOpen} = useStore((state) => state);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return experimentColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    const fuse = new Fuse(experiments, {
      keys: ['name', 'id'],
      findAllMatches: true,
      location: 10,
      distance: 600,
    });

    if (hasSearchFilter) {
      const searchResults = fuse.search(filterValue);
      return searchResults.map((result) => result.item);
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== experimentStatusOptions.length) {
      return experiments.filter((experiment) => Array.from(statusFilter).includes(experiment.status));
    }

    return experiments;
  }, [experiments.length, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const setCurrentExperiment = (experimentId: string) => {
    setCurrentItemId(experimentId);
    setItemSheetOpen(true);
  };

  const renderCell = useCallback((experiment: Experiment, columnKey: Key) => {
    const cellValue = experiment[columnKey as keyof Experiment];

    switch (columnKey) {
      case "name":
        return (
          <p onClick={() => setCurrentExperiment(experiment.id)}>{experiment.name}</p>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[experiment.status]}
            onClick={() => setCurrentExperiment(experiment.id)}
            size="sm"
            variant="dot"
          >
            {statusMap[experiment.status]}
          </Chip>
        );
      case 'allocation':
        return (
          <p
            className="capitalize border-none gap-1 text-default-600"
             onClick={() => setCurrentExperiment(experiment.id)}
          >
            {experiment.allocation}%
          </p>
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
                  href={`https://console.statsig.com/experiments/${experiment.id}`}
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
      aria-label="Table with all Statsig experiments"
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
        total={experiments.length}
        type="experiments"
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
        emptyContent={isLoading ? <Spinner className="h-full"/> : "No experiments found"}
        isLoading={!isLoading}
        items={items}
      >
        {(item: Experiment) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
