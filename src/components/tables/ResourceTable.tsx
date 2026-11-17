import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  type Selection,
  Spinner
} from "@heroui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { isAxiosError } from "axios";
import Fuse from "fuse.js";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ResourceStatus } from "~/components/ResourceStatus";
import { ExternalLinkIcon } from "~/components/icons/ExternalLinkIcon";
import { VerticalDotsIcon } from "~/components/icons/VerticalDotsIcon";
import { experimentStatuses, statusLabel } from "~/helpers/statusLabel";
import { useStatsigList } from "~/hooks/useStatsigList";
import { useStore } from "~/store/useStore";
import type { DynamicConfig, Experiment, FeatureGate } from "~/types/statsig";
import TopContent from "./TopContent";

const columns: Record<
  | "name"
  | "id"
  | "hypothesis"
  | "allocation"
  | "tags"
  | "status"
  | "isEnabled"
  | "actions",
  { label: string; width: number; widthClass?: string }
> = {
  name: { label: "Name", width: 88 },
  id: { label: "ID", width: 144 },
  hypothesis: { label: "Hypothesis", width: 170 },
  allocation: { label: "Allocation", width: 84 },
  tags: { label: "Tags", width: 68, widthClass: "w-[clamp(68px,18vw,122px)]" },
  status: {
    label: "Status",
    width: 96,
    widthClass: "w-[clamp(96px,18vw,126px)]"
  },
  isEnabled: { label: "Enabled", width: 88 },
  actions: {
    label: "Actions",
    width: 38,
    widthClass: "w-[clamp(38px,9.2vw,64px)]"
  }
};

type Column = keyof typeof columns;
type Resource = DynamicConfig | Experiment | FeatureGate;

const lists = {
  experiments: {
    endpoint: "/experiments",
    name: "experiments",
    singular: "experiment",
    storageKey: "table",
    defaultColumns: ["name", "status", "actions"],
    availableColumns: [
      "name",
      "id",
      "hypothesis",
      "allocation",
      "tags",
      "status",
      "actions"
    ]
  },
  dynamicConfigs: {
    endpoint: "/dynamic_configs",
    name: "dynamic configs",
    singular: "dynamic config",
    storageKey: "dynamic-config-table",
    defaultColumns: ["name", "tags", "actions"],
    availableColumns: ["name", "id", "tags", "isEnabled", "actions"]
  },
  featureGates: {
    endpoint: "/gates",
    name: "feature gates",
    singular: "feature gate",
    storageKey: "feature-gate-table",
    defaultColumns: ["name", "tags", "status", "actions"],
    availableColumns: ["name", "id", "tags", "status", "isEnabled", "actions"]
  }
} satisfies Record<
  string,
  {
    endpoint: string;
    name: string;
    singular: string;
    storageKey: string;
    defaultColumns: Column[];
    availableColumns: Column[];
  }
>;

interface CellProps {
  item: Resource;
  column: Column;
  endpoint: string;
  onOpen: (returnFocus?: HTMLButtonElement) => void;
}

function ResourceCell({ item, column, endpoint, onOpen }: CellProps) {
  switch (column) {
    case "name":
      return (
        <button
          className="flex min-h-8 w-full cursor-pointer items-center rounded-sm text-left font-medium wrap-anywhere hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-focus"
          onClick={() => onOpen()}
          type="button">
          {item.name || item.id}
        </button>
      );
    case "status":
      return "status" in item && item.status ? (
        <ResourceStatus status={item.status} />
      ) : (
        "—"
      );
    case "tags":
      return item.tags?.length ? (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              className="rounded-small bg-default-100 px-1.5 py-0.5 text-xs leading-4 text-foreground-700 wrap-anywhere"
              key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : (
        "—"
      );
    case "isEnabled":
      return "isEnabled" in item && typeof item.isEnabled === "boolean"
        ? item.isEnabled
          ? "Enabled"
          : "Disabled"
        : "—";
    case "allocation":
      return "allocation" in item && typeof item.allocation === "number"
        ? `${item.allocation}%`
        : "—";
    case "hypothesis":
      return "hypothesis" in item && item.hypothesis ? item.hypothesis : "—";
    case "id":
      return item.id;
    case "actions":
      return (
        <ResourceActions endpoint={endpoint} item={item} onOpen={onOpen} />
      );
  }
}

function ResourceActions({
  endpoint,
  item,
  onOpen
}: Omit<CellProps, "column">) {
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          aria-label={`Actions for ${item.name || item.id}`}
          className="size-8 min-w-8 text-foreground-700"
          isIconOnly
          radius="sm"
          ref={trigger}
          size="sm"
          variant="light">
          <VerticalDotsIcon size={16} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Resource actions"
        onAction={(key) => {
          if (key === "view") onOpen(trigger.current);
        }}>
        <DropdownItem key="view">View details</DropdownItem>
        <DropdownItem
          className="[&>svg]:size-4"
          endContent={<ExternalLinkIcon color="currentColor" />}
          href={`https://console.statsig.com${endpoint}/${encodeURIComponent(item.id)}`}
          key="open"
          rel="noreferrer"
          target="_blank">
          Open in Statsig
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export interface ResourceListProps {
  onReplaceKey: () => void;
  reviewPrompt?: ReactNode;
}

export default function ResourceTable({
  onReplaceKey,
  reviewPrompt,
  type
}: ResourceListProps & { type: keyof typeof lists }) {
  const {
    availableColumns,
    defaultColumns,
    endpoint,
    name,
    singular,
    storageKey
  } = lists[type];
  const { items, error, isLoading, isValidating, retry } =
    useStatsigList<Resource>(endpoint);
  const [storedColumns, setStoredColumns] = useLocalStorage<Column[]>(
    `${storageKey}-visible-columns`,
    defaultColumns
  );
  const [storedRowsPerPage, setRowsPerPage] = useLocalStorage(
    `${storageKey}-rows-per-page`,
    5
  );
  const rowsPerPage = [5, 10, 15].includes(storedRowsPerPage)
    ? storedRowsPerPage
    : 5;
  const [filterValue, setFilterValue] = useState("");
  const [statuses, setStatuses] = useState(new Set<string>());
  const [page, setPage] = useState(1);
  const [overflow, setOverflow] = useState(false);
  const viewport = useRef<HTMLElement>(null);
  const dialogOpener = useRef<HTMLButtonElement>(null);
  const dialogOpen = useStore(
    (state) => state.isItemSheetOpen || state.isManageExperimentModalOpen
  );
  const setCurrentItemId = useStore((state) => state.setCurrentItemId);
  const setItemSheetOpen = useStore((state) => state.setItemSheetOpen);

  useEffect(() => {
    const container = viewport.current;
    if (!container?.firstElementChild) return;
    const observer = new ResizeObserver(() => {
      setOverflow(container.scrollWidth > container.clientWidth);
    });
    observer.observe(container);
    observer.observe(container.firstElementChild);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dialogOpen || !dialogOpener.current) return;
    const opener = dialogOpener.current;
    dialogOpener.current = null;
    requestAnimationFrame(() => opener.focus());
  }, [dialogOpen]);

  const visibleColumns = availableColumns.filter(
    (column) => column === "name" || storedColumns?.includes(column)
  );
  const headerColumns = visibleColumns.map((key) => ({ key, ...columns[key] }));
  const statusOptions = useMemo(() => {
    if (type !== "experiments") return [];
    const keys = new Set(Object.keys(experimentStatuses));
    for (const item of items) {
      if ("status" in item && item.status) keys.add(item.status);
    }
    return Array.from(keys, (key) => ({ key, label: statusLabel(key) }));
  }, [items, type]);
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["name", "id"],
        findAllMatches: true,
        location: 10,
        distance: 600
      }),
    [items]
  );
  const query = filterValue.trim();
  const filterByStatus =
    statuses.size > 0 && statuses.size < statusOptions.length;
  const hasFilters = Boolean(query || filterByStatus);
  const filteredItems = useMemo(() => {
    const matches = query ? fuse.search(query).map(({ item }) => item) : items;
    return filterByStatus
      ? matches.filter((item) => "status" in item && statuses.has(item.status))
      : matches;
  }, [filterByStatus, fuse, items, query, statuses]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const currentPage = Math.min(page, Math.max(1, pages));
  const start = (currentPage - 1) * rowsPerPage;
  const pageItems = useMemo(
    () => filteredItems.slice(start, start + rowsPerPage),
    [filteredItems, rowsPerPage, start]
  );

  const updateStatuses = (selection: Selection) => {
    setStatuses(
      selection === "all"
        ? new Set<string>()
        : new Set(Array.from(selection, String))
    );
    setPage(1);
  };

  const resetFilters = () => {
    setFilterValue("");
    setStatuses(new Set<string>());
    setPage(1);
  };

  const updateColumns = (selection: Selection) => {
    setStoredColumns(
      selection === "all"
        ? availableColumns
        : availableColumns.filter(
            (column) => column === "name" || selection.has(column)
          )
    );
  };

  const total = items.length.toLocaleString();
  const count = filteredItems.length.toLocaleString();
  const summary =
    isLoading && items.length === 0
      ? `Loading ${name}…`
      : items.length === 0
        ? ""
        : `${hasFilters ? `${count} of ` : ""}${total} ${items.length === 1 ? singular : name}${isLoading ? " loaded…" : ""}`;

  const authorizationError =
    isAxiosError(error) && [401, 403].includes(error.response?.status);
  const recoveryButton = (
    <Button
      className="min-h-9 border"
      isLoading={isValidating && !authorizationError}
      onPress={authorizationError ? onReplaceKey : () => void retry()}
      radius="sm"
      size="sm"
      variant="bordered">
      {authorizationError ? "Sign out to replace key" : "Try again"}
    </Button>
  );
  const isWaiting = isLoading && pageItems.length === 0;
  const minWidth = headerColumns.reduce(
    (width, column) => width + column.width,
    0
  );

  return (
    <div className="grid min-w-0 gap-3">
      <TopContent
        columns={availableColumns.map((key) => ({
          key,
          label: columns[key].label
        }))}
        filterValue={filterValue}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(1);
        }}
        onSearchChange={(value) => {
          setFilterValue(value);
          setPage(1);
        }}
        onStatusChange={updateStatuses}
        onVisibleColumnsChange={updateColumns}
        resourceName={name}
        rowsPerPage={rowsPerPage}
        selectedStatuses={statuses}
        statusOptions={statusOptions}
        summary={summary}
        visibleColumns={visibleColumns}
      />
      {!isLoading && !error && reviewPrompt}
      {error && items.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
          <p role="alert">Some {name} couldn't load.</p>
          {recoveryButton}
        </div>
      )}
      <section
        aria-label={
          overflow ? `Scroll to view more ${singular} columns` : `${name} table`
        }
        className="min-w-0 overflow-x-auto rounded-lg border border-default-200 focus-visible:outline-2 focus-visible:outline-focus"
        ref={viewport}
        tabIndex={overflow ? 0 : undefined}>
        <table
          aria-busy={isLoading}
          aria-label={name}
          className="w-full min-w-[var(--resource-table-min)] table-fixed border-collapse"
          style={{ "--resource-table-min": `${minWidth}px` } as CSSProperties}>
          <thead className="border-b border-default-200 bg-default-100 text-left text-xs text-foreground-700">
            <tr>
              {headerColumns.map((column) => (
                <th
                  className={`h-9 px-2 font-semibold min-[420px]:px-3 ${column.widthClass ?? ""}${column.key === "actions" ? " text-center" : ""}`}
                  key={column.key}
                  scope="col"
                  style={{
                    width:
                      column.key === "name" || column.widthClass
                        ? undefined
                        : column.width
                  }}>
                  {column.key === "actions" ? (
                    <span className="sr-only min-[500px]:not-sr-only">
                      {column.label}
                    </span>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-default-100">
            {pageItems.map((item) => (
              <tr
                className="hover:bg-default-50 focus-within:bg-default-50"
                key={item.id}>
                {visibleColumns.map((column) => {
                  const Cell = column === "name" ? "th" : "td";
                  return (
                    <Cell
                      className={`py-1 text-[13px] leading-5 wrap-anywhere ${column === "actions" ? "px-0 text-center" : "px-2 text-left min-[420px]:px-3"}`}
                      key={column}
                      scope={column === "name" ? "row" : undefined}>
                      <ResourceCell
                        column={column}
                        endpoint={endpoint}
                        item={item}
                        onOpen={(returnFocus) => {
                          dialogOpener.current = returnFocus ?? null;
                          setCurrentItemId(item.id);
                          setItemSheetOpen(true);
                        }}
                      />
                    </Cell>
                  );
                })}
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={visibleColumns.length}>
                  <div className="flex min-h-36 flex-col items-center justify-center gap-2 p-4 text-center text-[13px] text-foreground-700">
                    {isWaiting ? (
                      <Spinner aria-label={`Loading ${name}`} size="sm" />
                    ) : error && !items.length ? (
                      <>
                        <p className="font-medium text-foreground" role="alert">
                          Couldn't load {name}.
                        </p>
                        <p>
                          {authorizationError
                            ? `This Console API key can’t access ${name}.`
                            : "Check your connection and try again."}
                        </p>
                        {recoveryButton}
                      </>
                    ) : hasFilters ? (
                      <>
                        <p className="font-medium text-foreground">
                          No matching {name}.
                        </p>
                        <Button
                          className="min-h-9 border"
                          onPress={resetFilters}
                          radius="sm"
                          size="sm"
                          variant="bordered">
                          Clear filters
                        </Button>
                      </>
                    ) : (
                      <p>No {name} to show.</p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      {pages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-foreground-700 tabular-nums">
          <span>
            Page {currentPage} of {pages}
          </span>
          <Pagination
            aria-label={`${name} pages`}
            onChange={setPage}
            page={currentPage}
            radius="sm"
            showControls
            siblings={0}
            size="sm"
            total={pages}
            variant="light"
          />
        </div>
      )}
    </div>
  );
}
