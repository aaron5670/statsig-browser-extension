import type { FeatureGate } from "~types/statsig";
import type { ChangeEvent, Key } from "react";

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
import { useLocalStorage } from "@uidotdev/usehooks";
import { ExternalLinkIcon } from "~components/icons/ExternalLinkIcon";
import BottomContent from "~components/tables/BottomContent";
import TopContent from "~components/tables/TopContent";
import { useFeatureGates } from "~hooks/useFeatureGates";
import { useStore } from "~store/useStore";
import Fuse from "fuse.js";
import React, { useCallback, useMemo, useState } from "react";

import { featureGateColumns } from "./data";
import { VerticalDotsIcon } from "./icons/VerticalDotsIcon";

export default function FeatureGates() {
  const { featureGates, isLoading } = useFeatureGates();
  const [visibleColumns, setVisibleColumns] = useLocalStorage("feature-gate-table-visible-columns", ["name", "tags", "status", "actions"]);
  const [rowsPerPage, setRowsPerPage] = useLocalStorage("feature-gate-table-rows-per-page", 5);
  const { setCurrentItemId, setItemSheetOpen } = useStore((state) => state);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "status",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return featureGateColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    const fuse = new Fuse(featureGates, {
      keys: ['name', 'id'],
      findAllMatches: true,
      location: 10,
      distance: 600,
    });

    if (hasSearchFilter) {
      const searchResults = fuse.search(filterValue);
      return searchResults.map((result) => result.item);
    }

    return featureGates;
  }, [featureGates.length, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const setCurrentFeatureGate = (featureGateId: string) => {
    setCurrentItemId(featureGateId);
    setItemSheetOpen(true);
  };

  const renderCell = useCallback((featureGate: FeatureGate, columnKey: Key) => {
    const cellValue = featureGate[columnKey as keyof FeatureGate];

    switch (columnKey) {
      case "name":
        return (
          <p onClick={() => setCurrentFeatureGate(featureGate.id)}>{featureGate.name}</p>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={featureGate.status === "In Progress" ? "success" : "warning"}
            onClick={() => setCurrentFeatureGate(featureGate.id)}
            size="sm"
            variant="dot"
          >
            {featureGate.status}
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
                onClick={() => setCurrentFeatureGate(featureGate.id)}
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
            color={featureGate.isEnabled ? "success" : "danger"}
            onClick={() => setCurrentFeatureGate(featureGate.id)}
            size="sm"
            variant="dot"
          >
            {featureGate.isEnabled ? "Enabled" : "Disabled"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown backdrop="opaque" className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon height={20} width={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view" onClick={() => setCurrentFeatureGate(featureGate.id)}>View</DropdownItem>
                <DropdownItem
                  key="open"
                  as={'a'}
                  endContent={<ExternalLinkIcon />}
                  href={`https://console.statsig.com/gates/${featureGate.id}`}
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
          <p onClick={() => setCurrentFeatureGate(featureGate.id)}>{cellValue}</p>
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
      aria-label="Table with all Statsig Feature Gates"
      bottomContent={<BottomContent
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
        total={featureGates.length}
        type="featureGates"
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
        emptyContent={isLoading ? <Spinner className="h-full" /> : "No feature gates found"}
        isLoading={!isLoading}
        items={items}
      >
        {(item: FeatureGate) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
} 