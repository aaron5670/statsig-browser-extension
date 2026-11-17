import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import {
  getCurrentStorageValue,
  removeStorageValue,
  updateStorageValue
} from "~/handlers/localStorageHandlers";
import { useStore } from "~/store/useStore";

export function usePageOverride(enabled = true) {
  const [storageKey] = useLocalStorage<string>("statsig-local-storage-key");
  const [storageType] = useLocalStorage<"cookie" | "localStorage">(
    "statsig-storage-type",
    "localStorage"
  );
  const [currentOverrides, setCurrentOverrides] = useLocalStorage<
    { name: string }[]
  >("statsig-current-overrides", []);
  const { currentLocalStorageValue: activeId, setCurrentLocalStorageValue } =
    useStore((state) => state);
  const [isPending, setPending] = useState(false);
  const [checkedStorageTarget, setCheckedStorageTarget] = useState<string>();
  const storageTarget =
    enabled && storageKey ? `${storageType}:${storageKey}` : null;
  const [feedback, setFeedback] = useState<{
    message: string;
    failed: boolean;
    target: string;
  }>();

  useEffect(() => {
    if (!storageTarget) {
      setCurrentLocalStorageValue("");
      return;
    }
    let ignore = false;

    const readOverride = async () => {
      try {
        const [tab] = await browser.tabs.query({
          active: true,
          currentWindow: true
        });
        if (tab?.id === undefined) throw new Error();
        const [storage] = await getCurrentStorageValue(
          tab.id,
          storageKey,
          storageType
        );
        if (!ignore) setCurrentLocalStorageValue(storage?.result || "");
      } catch {
        if (!ignore) setCurrentLocalStorageValue("");
      } finally {
        if (!ignore) setCheckedStorageTarget(storageTarget);
      }
    };

    void readOverride();
    return () => {
      ignore = true;
    };
  }, [setCurrentLocalStorageValue, storageKey, storageType, storageTarget]);

  const isReady = !!storageTarget && storageTarget === checkedStorageTarget;
  const disabled = !isReady || isPending;
  const activePreset = currentOverrides?.some(({ name }) => name === activeId);

  const setOverride = async (value: string, options?: string[]) => {
    if (disabled || !storageTarget) return;
    setPending(true);
    setFeedback(undefined);

    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
      });
      if (tab?.id === undefined) throw new Error();
      if (value) {
        await updateStorageValue(tab.id, storageKey, value, storageType);
        if (options) {
          setCurrentOverrides([...new Set(options)].map((name) => ({ name })));
        }
      } else {
        await removeStorageValue(tab.id, storageKey, storageType);
      }
      setCurrentLocalStorageValue(value);
      setFeedback({
        message: value
          ? "Override applied. The tab reloads with this ID."
          : activePreset
            ? "Override cleared."
            : "Stored value removed.",
        failed: false,
        target: storageTarget
      });
    } catch {
      setFeedback({
        message:
          "Couldn’t update the override. Open the target website and try again.",
        failed: true,
        target: storageTarget
      });
    } finally {
      setPending(false);
    }
  };

  return {
    activeId: isReady ? activeId : null,
    clearFeedback: () => setFeedback(undefined),
    disabled,
    feedback: feedback?.target === storageTarget ? feedback : undefined,
    hasStorageKey: Boolean(storageKey),
    setOverride
  };
}
