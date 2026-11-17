import { Button, Chip } from "@heroui/react";
import { useState } from "react";
import { RxCopy } from "react-icons/rx";
import type { JsonData, StatsigUser } from "~/types/statsig";
import { JsonValue } from "./sheets/JsonValue";

const identityFields = [
  ["userID", "User ID"],
  ["email", "Email"],
  ["ip", "IP address"],
  ["userAgent", "User agent"],
  ["country", "Country"],
  ["locale", "Locale"]
] as const;

function UserProperty({ label, value }: { label: string; value: unknown }) {
  const [copyMessage, setCopyMessage] = useState("");
  const isStructured = value !== null && typeof value === "object";
  const scalar = isStructured ? "" : String(value ?? null);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(scalar);
      setCopyMessage("Copied");
    } catch {
      setCopyMessage("Couldn’t copy");
    }
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-1 px-3 py-2.5 min-[460px]:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] min-[460px]:items-start min-[460px]:gap-3">
      <dt className="pt-1 text-xs font-medium text-default-600 wrap-anywhere">
        {label}
      </dt>
      <dd className="min-w-0">
        {isStructured ? (
          <div className="rounded-md border border-divider bg-background p-2 font-mono text-xs leading-6 wrap-anywhere">
            <JsonValue value={value as JsonData} />
          </div>
        ) : (
          <span className="flex min-w-0 flex-wrap items-center gap-1">
            <span className="select-text py-1 text-sm wrap-anywhere">
              {scalar === "" ? '""' : scalar}
            </span>
            {value != null && (
              <Button
                aria-label={`Copy ${label}`}
                className="h-8 w-8 min-w-8 text-default-600"
                isIconOnly
                onPress={copyValue}
                radius="sm"
                size="sm"
                variant="light">
                <RxCopy aria-hidden="true" size={14} />
              </Button>
            )}
            <span className="text-xs text-default-600" role="status">
              {copyMessage}
            </span>
          </span>
        )}
      </dd>
    </div>
  );
}

export default function UserDetails({ user }: { user: StatsigUser }) {
  const groups = [
    {
      title: "Identity",
      entries: identityFields.flatMap(([key, label]) =>
        user[key] == null || user[key] === ""
          ? []
          : [[label, user[key]] as const]
      )
    },
    { title: "Custom properties", entries: Object.entries(user.custom ?? {}) },
    {
      title: "Private attributes",
      entries: Object.entries(user.privateAttributes ?? {})
    }
  ];

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold wrap-anywhere">
          {user.name || "Anonymous user"}
        </h3>
        {user.statsigEnvironment?.tier && (
          <Chip
            size="sm"
            variant="flat"
            className="h-auto max-w-full whitespace-normal py-0.5 wrap-anywhere">
            {user.statsigEnvironment.tier}
          </Chip>
        )}
      </div>
      {groups.map(
        ({ title, entries }) =>
          entries.length > 0 && (
            <section key={title} className="grid min-w-0 gap-2">
              <h4 className="text-sm font-semibold">{title}</h4>
              <dl className="divide-y divide-divider rounded-xl border border-divider bg-default-50">
                {entries.map(([label, value]) => (
                  <UserProperty key={label} label={label} value={value} />
                ))}
              </dl>
            </section>
          )
      )}
    </div>
  );
}
