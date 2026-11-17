import { Button } from "@heroui/react";
import { type ReactNode, useRef } from "react";
import { FiCheck } from "react-icons/fi";
import { RemoveTabValueButton } from "~/components/RemoveTabValueButton";
import { usePageOverride } from "~/hooks/usePageOverride";

export function OverrideControls({
  children,
  options,
  title
}: {
  children: (control: ReturnType<typeof usePageOverride>) => ReactNode;
  options: string[];
  title: string;
}) {
  const control = usePageOverride();
  const heading = useRef<HTMLHeadingElement>(null);
  const { activeId, disabled, feedback, hasStorageKey, setOverride } = control;

  return (
    <section className="grid gap-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold" ref={heading} tabIndex={-1}>
          {title}
        </h3>
        {options.includes(activeId) && (
          <RemoveTabValueButton
            disabled={disabled}
            label="Clear active override"
            onRemovalFocus={() => heading.current?.focus()}
            onRemove={() => setOverride("")}
          />
        )}
      </div>
      <p className="text-sm text-default-600">
        {hasStorageKey
          ? "Apply an ID to reload the tab with that override."
          : "Set a storage key in Settings to apply overrides."}
      </p>
      {children(control)}
      <div
        className={
          feedback
            ? feedback.failed
              ? "text-sm text-danger"
              : "text-sm text-default-700"
            : "sr-only"
        }
        role="status">
        {feedback?.message}
      </div>
    </section>
  );
}

export function OverrideButton({
  active,
  disabled,
  identity,
  onApply
}: {
  active: boolean;
  disabled: boolean;
  identity: string;
  onApply: () => void;
}) {
  return (
    <Button
      aria-pressed={active}
      className="h-auto min-h-9 max-w-full whitespace-normal px-3 py-1 text-start wrap-anywhere"
      color={active ? "primary" : "default"}
      isDisabled={disabled}
      onPress={onApply}
      radius="sm"
      size="sm"
      startContent={
        active ? <FiCheck aria-hidden="true" className="shrink-0" /> : undefined
      }
      variant={active ? "flat" : "bordered"}>
      {identity}
    </Button>
  );
}
