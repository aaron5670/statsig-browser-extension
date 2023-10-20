import type {ChangeEvent, Key} from "react";

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
import {ExternalLinkIcon} from "~components/icons/ExternalLinkIcon";
import BottomContent from "~components/table/BottomContent";
import TopContent from "~components/table/TopContent";
import {useStore} from "~store/useStore";
import React, {useCallback, useMemo, useState} from "react";

import {columns, statusOptions} from "./data";
import {VerticalDotsIcon} from "./icons/VerticalDotsIcon";

const statusColorMap: Record<string, ChipProps["color"]> = {
  abandoned: "danger",
  active: "success",
  setup: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "status", "actions"];

type Experiment = {
  createdTime: number;
  creatorName: string;
  description: string;
  endTime: number;
  hypothesis: string;
  id: string;
  name: string;
  startTime: number;
  status: string;
  tags: string[];
}

export default function Experiments() {
  const {experiments, isLoading, setCurrentExperimentId, setExperimentModalOpen} = useStore((state) => state);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const pages = Math.ceil(experiments.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredExperiments: Experiment[] = [...experiments];

    if (hasSearchFilter) {
      filteredExperiments = filteredExperiments.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredExperiments = filteredExperiments.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }
    return filteredExperiments;
  }, [experiments.length, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const setCurrentExperiment = (experimentId: string) => {
    setCurrentExperimentId(experimentId);
    setExperimentModalOpen(true);
  };

  const sortedItems = () => {
    return [...items].sort((a: Experiment, b: Experiment) => {
      const first = a[sortDescriptor.column as keyof Experiment] as number;
      const second = b[sortDescriptor.column as keyof Experiment] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  };

  const renderCell = useCallback((experiment: Experiment, columnKey: Key) => {
    const cellValue = experiment[columnKey as keyof Experiment];

    switch (columnKey) {
      case "name":
        return (
          <p onClick={() => setCurrentExperiment(experiment.id)}>{cellValue}</p>
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
            {cellValue}
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
      bottomContent={<BottomContent
        hasSearchFilter={hasSearchFilter}
        page={page}
        setPage={setPage}
        total={pages}
      />}
      classNames={{
        base: ["base-class"],
        emptyWrapper: ["empty-wrapper-class"],
        th: ["bg-transparent", "text-default-500"],
        tr: ["hover:bg-default-50", "cursor-pointer"],
        wrapper: ["max-h-[382px]", "max-w-3xl", "min-h-[242px]"],
      }}
      topContent={<TopContent
        experiments={experiments}
        filterValue={filterValue}
        hasSearchFilter={hasSearchFilter}
        onRowsPerPageChange={onRowsPerPageChange}
        onSearchChange={onSearchChange}
        setFilterValue={setFilterValue}
        setStatusFilter={setStatusFilter}
        setVisibleColumns={setVisibleColumns}
        statusFilter={statusFilter}
        visibleColumns={visibleColumns}
      />}
      aria-label="Table with all Statzig experiments"
      bottomContentPlacement="outside"
      fullWidth
      isCompact
      isHeaderSticky
      onSortChange={setSortDescriptor}
      removeWrapper
      selectionMode="none"
      sortDescriptor={sortDescriptor}
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
        isLoading={isLoading}
        items={sortedItems()}
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