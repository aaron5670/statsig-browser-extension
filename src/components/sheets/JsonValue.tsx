import { useState } from "react";
import type { JsonData } from "~/types/statsig";
import { CopyDetailValue } from "./DetailContent";

const arrayPageSize = 100;
const summaryStyle = "min-h-7 cursor-pointer rounded-sm hover:bg-default-100";
const branchStyle = "ms-1 border-s border-divider ps-2";

export function JsonValue({
  name,
  value,
  expanded = false
}: {
  name?: string;
  value: JsonData;
  expanded?: boolean;
}) {
  const [hasOpened, setHasOpened] = useState(expanded);
  const label = name === undefined ? "" : `${JSON.stringify(name)}: `;
  const copy = (copyLabel: string) => (
    <div className="my-1 font-sans">
      <CopyDetailValue
        label={copyLabel}
        value={() => JSON.stringify(value, null, 2)}
      />
    </div>
  );

  if (value === null || typeof value !== "object") {
    return (
      <div>
        {name === undefined && copy("Copy JSON")}
        {label}
        <span className="text-primary">{JSON.stringify(value)}</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const size = isArray ? value.length : Object.keys(value).length;
  const preview = isArray
    ? size
      ? `[${size} ${size === 1 ? "item" : "items"}]`
      : "[]"
    : size
      ? "{…}"
      : "{}";

  if (!size)
    return (
      <div>
        {name === undefined && copy("Copy JSON")}
        {label}
        {preview}
      </div>
    );

  return (
    <div>
      {name === undefined && copy("Copy JSON")}
      <details
        open={expanded || undefined}
        onToggle={(event) => {
          if (event.currentTarget.open) setHasOpened(true);
        }}>
        <summary className={summaryStyle}>
          {label}
          {preview}
        </summary>
        {hasOpened && (
          <div className={branchStyle}>
            {name !== undefined && copy("Copy value")}
            {isArray && size > arrayPageSize
              ? Array.from(
                  { length: Math.ceil(size / arrayPageSize) },
                  (_, page) => {
                    const start = page * arrayPageSize;
                    return (
                      <JsonArrayPage
                        key={start}
                        start={start}
                        values={value.slice(start, start + arrayPageSize)}
                      />
                    );
                  }
                )
              : Object.entries(value).map(([key, item]) => (
                  <JsonValue key={key} name={key} value={item} />
                ))}
          </div>
        )}
      </details>
    </div>
  );
}

function JsonArrayPage({
  start,
  values
}: {
  start: number;
  values: JsonData[];
}) {
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <details
      onToggle={(event) => {
        if (event.currentTarget.open) setHasOpened(true);
      }}>
      <summary className={summaryStyle}>
        {values.length === 1
          ? `Item ${start + 1}`
          : `Items ${start + 1}–${start + values.length}`}
      </summary>
      {hasOpened && (
        <div className={branchStyle}>
          {values.map((value, index) => {
            const position = String(start + index);
            return <JsonValue key={position} name={position} value={value} />;
          })}
        </div>
      )}
    </details>
  );
}
