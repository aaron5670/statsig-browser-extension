import { Button } from "@heroui/react";
import { useRef, useState } from "react";
import DetailDialog from "./DetailDialog";

export function RemoveTabValueButton({
  label,
  disabled,
  onRemove,
  onRemovalFocus
}: {
  label: string;
  disabled: boolean;
  onRemove: () => Promise<void>;
  onRemovalFocus: () => void;
}) {
  const [isOpen, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        className="min-h-9"
        isDisabled={disabled}
        onPress={() => setOpen(true)}
        radius="sm"
        ref={trigger}
        size="sm"
        variant="light">
        {label}…
      </Button>
      <DetailDialog
        footer={
          <>
            <Button
              onPress={() => setOpen(false)}
              radius="sm"
              size="sm"
              variant="bordered">
              Cancel
            </Button>
            <Button
              color="danger"
              isDisabled={disabled}
              onPress={async () => {
                setOpen(false);
                await onRemove();
                requestAnimationFrame(() => {
                  if (trigger.current) trigger.current.focus();
                  else onRemovalFocus();
                });
              }}
              radius="sm"
              size="sm">
              Remove and reload
            </Button>
          </>
        }
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        size="compact"
        title={label}>
        <p className="text-sm">
          This removes the stored value and reloads the active tab.
        </p>
      </DetailDialog>
    </>
  );
}
