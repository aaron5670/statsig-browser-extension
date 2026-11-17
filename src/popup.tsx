import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  HeroUIProvider,
  Select,
  SelectItem
} from "@heroui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Activity, lazy, Suspense, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { mutate, SWRConfig } from "swr";
import AuditLogs from "~/components/AuditLogs";
import DynamicConfigs from "~/components/DynamicConfigs";
import Experiments from "~/components/Experiments";
import FeatureGates from "~/components/FeatureGates";
import { SettingsIcon } from "~/components/icons/SettingsIcon";
import LoginModal from "~/components/modals/LoginModal";
import { RemoveTabValueButton } from "~/components/RemoveTabValueButton";
import ReviewPrompt, {
  chromeWebStoreReviewsUrl,
  markReviewPromptSeen
} from "~/components/ReviewPrompt";
import SettingsSheet from "~/components/sheets/SettingsSheet";
import { fetcher } from "~/helpers/fetcher";
import { usePageOverride } from "~/hooks/usePageOverride";
import { useStore } from "~/store/useStore";
import statsigLogo from "../assets/statsig-logo.png";
import "./main.css";

const ManageExperimentModal = lazy(
  () => import("~/components/modals/manage-experiment/ManageExperimentModal")
);
const DynamicConfigSheet = lazy(
  () => import("~/components/sheets/DynamicConfigSheet")
);
const ExperimentSheet = lazy(
  () => import("~/components/sheets/ExperimentSheet")
);
const FeatureGateSheet = lazy(
  () => import("~/components/sheets/FeatureGateSheet")
);
const UserDetailsSheet = lazy(
  () => import("~/components/sheets/UserDetailsSheet")
);

const resourceViews = {
  Experiments,
  "Dynamic Configs": DynamicConfigs,
  "Feature Gates": FeatureGates,
  "Audit Logs": AuditLogs
};

function IndexPopup() {
  const {
    isItemSheetOpen,
    isManageExperimentModalOpen,
    isSettingsSheetOpen,
    isUserDetailsSheetOpen,
    setSettingsSheetOpen,
    setUserDetailsSheetOpen
  } = useStore();
  const settingsMenu = useRef<HTMLButtonElement>(null);
  const activeViewButton = useRef<HTMLButtonElement>(null);
  const [reviewPromptDismissed, setReviewPromptDismissed] = useState(false);
  const [apiKey, setApiKey] = useLocalStorage("statsig-console-api-key", "");
  const [resource, setResource] = useLocalStorage(
    "statsig-experiment-or-config",
    "Experiments"
  );
  const [currentOverrides] = useLocalStorage<{ name: string }[]>(
    "statsig-current-overrides",
    []
  );
  const {
    activeId,
    clearFeedback,
    disabled,
    feedback,
    hasStorageKey,
    setOverride
  } = usePageOverride(Boolean(apiKey));
  const currentView = Object.hasOwn(resourceViews, resource)
    ? resource
    : "Experiments";
  const activePreset = currentOverrides?.some(
    (override) => override.name === activeId
  );

  const handleConnect = (key: string) => {
    setApiKey(key);
    if (!hasStorageKey) setSettingsSheetOpen(true);
  };

  const handleLogout = () => {
    setApiKey("");
    void mutate(() => true, undefined, { revalidate: false });
  };

  const restoreSettingsFocus = () => {
    requestAnimationFrame(() => settingsMenu.current?.focus());
  };

  return (
    <HeroUIProvider reducedMotion="user">
      <SWRConfig value={{ fetcher }}>
        <div className="popup-shell">
          <header className="popup-header">
            <div className="popup-header-inner popup-gutter">
              <img alt="Statsig" src={statsigLogo} width={116} height={22} />
              {apiKey && (
                <>
                  <nav className="resource-nav" aria-label="Statsig resources">
                    {Object.keys(resourceViews).map((view) => (
                      <button
                        aria-current={currentView === view ? "page" : undefined}
                        key={view}
                        ref={
                          currentView === view ? activeViewButton : undefined
                        }
                        onClick={() => {
                          clearFeedback();
                          setResource(view);
                          window.scrollTo(0, 0);
                        }}
                        type="button">
                        {view}
                      </button>
                    ))}
                  </nav>
                  <Dropdown disableAnimation placement="bottom-end">
                    <DropdownTrigger>
                      <Button
                        aria-label="Settings menu"
                        className="size-9"
                        isIconOnly
                        radius="sm"
                        ref={settingsMenu}
                        size="sm"
                        variant="bordered">
                        <SettingsIcon />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Extension settings"
                      onAction={(key) => {
                        if (key === "user") setUserDetailsSheetOpen(true);
                        if (key === "settings") setSettingsSheetOpen(true);
                        if (import.meta.env.CHROME && key === "review") {
                          markReviewPromptSeen();
                          setReviewPromptDismissed(true);
                        }
                        if (key === "logout") handleLogout();
                      }}>
                      <DropdownItem key="user">User details</DropdownItem>
                      <DropdownItem key="settings">Settings</DropdownItem>
                      {import.meta.env.CHROME && (
                        <DropdownItem
                          endContent={
                            <FiExternalLink aria-hidden="true" size={14} />
                          }
                          href={chromeWebStoreReviewsUrl}
                          key="review"
                          rel="noopener noreferrer"
                          target="_blank"
                          textValue="Leave a review">
                          Leave a review
                          <span className="sr-only"> (opens in a new tab)</span>
                        </DropdownItem>
                      )}
                      <DropdownItem key="logout" color="danger">
                        Sign out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </>
              )}
            </div>
          </header>

          {apiKey ? (
            <main className="popup-main popup-gutter" aria-label={currentView}>
              {(activeId || feedback) && (
                <div className="override-bar">
                  {activeId && (
                    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="text-sm font-medium">
                        {activePreset
                          ? "Active tab override"
                          : "Stored tab value"}
                      </span>
                      {activePreset ? (
                        <Select
                          aria-label="Active tab override"
                          className="w-48 max-w-full"
                          classNames={{ trigger: "min-h-9" }}
                          isDisabled={disabled}
                          items={currentOverrides}
                          onChange={(event) => {
                            if (event.target.value) {
                              void setOverride(event.target.value);
                            }
                          }}
                          radius="sm"
                          selectedKeys={[activeId]}
                          size="sm"
                          variant="bordered">
                          {({ name }) => (
                            <SelectItem key={name} textValue={name}>
                              {name}
                            </SelectItem>
                          )}
                        </Select>
                      ) : (
                        <code className="min-w-0 text-sm wrap-anywhere">
                          {activeId}
                        </code>
                      )}
                      <RemoveTabValueButton
                        disabled={disabled}
                        label={
                          activePreset
                            ? "Clear override"
                            : "Remove stored value"
                        }
                        onRemovalFocus={() => activeViewButton.current?.focus()}
                        onRemove={() => setOverride("")}
                      />
                    </div>
                  )}
                  <p
                    className={
                      feedback?.failed
                        ? "text-sm text-danger-700"
                        : "text-sm text-foreground-600"
                    }
                    role="status">
                    {feedback?.message}
                  </p>
                </div>
              )}
              {Object.entries(resourceViews).map(([view, ResourceView]) => (
                <Activity
                  key={view}
                  mode={view === currentView ? "visible" : "hidden"}>
                  <ResourceView
                    onReplaceKey={handleLogout}
                    reviewPrompt={
                      view === currentView &&
                      import.meta.env.CHROME &&
                      !reviewPromptDismissed && (
                        <ReviewPrompt
                          onDismiss={() => {
                            setReviewPromptDismissed(true);
                            restoreSettingsFocus();
                          }}
                          paused={
                            isItemSheetOpen ||
                            isManageExperimentModalOpen ||
                            isSettingsSheetOpen ||
                            isUserDetailsSheetOpen
                          }
                        />
                      )
                    }
                  />
                </Activity>
              ))}
              <SettingsSheet onDismiss={restoreSettingsFocus} />
              <Suspense>
                <UserDetailsSheet onDismiss={restoreSettingsFocus} />
              </Suspense>
              <Suspense>
                {currentView === "Experiments" && <ExperimentSheet />}
                {currentView === "Dynamic Configs" && <DynamicConfigSheet />}
                {currentView === "Feature Gates" && <FeatureGateSheet />}
              </Suspense>
              {currentView === "Experiments" && (
                <Suspense>
                  <ManageExperimentModal />
                </Suspense>
              )}
            </main>
          ) : (
            <LoginModal onConnect={handleConnect} />
          )}
        </div>
      </SWRConfig>
    </HeroUIProvider>
  );
}

export default IndexPopup;
