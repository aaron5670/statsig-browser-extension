import { Button, Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";
import { RxReload } from "react-icons/rx";
import { browser } from "wxt/browser";
import { getUserDetails } from "~/handlers/getUserDetails";
import { useStore } from "~/store/useStore";
import type { StatsigUser } from "~/types/statsig";
import DetailDialog from "../DetailDialog";
import UserDetails from "../UserDetails";

type UserResult =
  | { state: "loading" | "unavailable" | "empty" }
  | { state: "found"; user: StatsigUser };

function ActiveUserDetails({ onClose }: { onClose: () => void }) {
  const [result, setResult] = useState<UserResult>({ state: "loading" });

  useEffect(() => {
    if (result.state !== "loading") return;
    let active = true;
    async function readUser() {
      try {
        const [tab] = await browser.tabs.query({
          active: true,
          currentWindow: true
        });
        if (tab?.id === undefined) throw new Error("No active tab");
        const details = await getUserDetails(tab.id);
        if (!active) return;
        setResult(
          details?.user && Object.keys(details.user).length > 0
            ? { state: "found", user: details.user }
            : { state: "empty" }
        );
      } catch {
        if (active) setResult({ state: "unavailable" });
      }
    }
    void readUser();
    return () => {
      active = false;
    };
  }, [result]);

  const isReading = result.state === "loading";

  return (
    <DetailDialog
      actions={
        <Button
          aria-disabled={isReading}
          aria-label="Refresh user details"
          className="min-h-9"
          onPress={() => {
            if (!isReading) setResult({ state: "loading" });
          }}
          radius="sm"
          size="sm"
          startContent={
            <RxReload
              aria-hidden="true"
              className={isReading ? "motion-safe:animate-spin" : undefined}
            />
          }
          variant="bordered">
          Refresh
        </Button>
      }
      description="Statsig SDK identity on the active tab."
      isOpen
      onClose={onClose}
      size="compact"
      title="User details">
      {result.state === "found" ? (
        <UserDetails user={result.user} />
      ) : result.state === "loading" ? (
        <div className="grid gap-3" role="status">
          <p className="sr-only">Reading user details…</p>
          <Skeleton aria-hidden="true" className="h-5 w-2/5 rounded" />
          <Skeleton aria-hidden="true" className="h-12 rounded-lg" />
        </div>
      ) : (
        <div
          className="grid gap-1.5 rounded-xl border border-divider bg-default-50 px-4 py-4"
          role="status">
          <p className="text-sm font-semibold">
            {result.state === "unavailable"
              ? "Can’t read this tab"
              : "No Statsig user detected"}
          </p>
          <p className="text-sm text-default-600">
            {result.state === "unavailable"
              ? "Open a site the extension can access, then reopen User details."
              : "Wait for the site’s Statsig SDK to initialize, then select Refresh."}
          </p>
        </div>
      )}
    </DetailDialog>
  );
}

export default function UserDetailsSheet({
  onDismiss
}: {
  onDismiss?: () => void;
}) {
  const { isUserDetailsSheetOpen, setUserDetailsSheetOpen } = useStore(
    (state) => state
  );
  return isUserDetailsSheetOpen ? (
    <ActiveUserDetails
      onClose={() => {
        setUserDetailsSheetOpen(false);
        onDismiss?.();
      }}
    />
  ) : null;
}
