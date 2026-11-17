import { Modal, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import type { ReactNode } from "react";
import { RxCross2 } from "react-icons/rx";

interface DetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: "compact" | "wide";
  dismissable?: boolean;
}

export default function DetailDialog({
  isOpen,
  onClose,
  title,
  description,
  actions,
  footer,
  children,
  size = "wide",
  dismissable = true
}: DetailDialogProps) {
  return (
    <Modal
      aria-description={
        typeof description === "string" ? description : undefined
      }
      isOpen={isOpen}
      onClose={dismissable ? onClose : undefined}
      isDismissable={dismissable}
      isKeyboardDismissDisabled={!dismissable}
      hideCloseButton={!dismissable}
      disableAnimation
      closeButton={
        <button aria-label="Close dialog" type="button">
          <RxCross2 aria-hidden="true" size={18} />
        </button>
      }
      placement="center"
      scrollBehavior="inside"
      shadow="md"
      size={size === "compact" ? "md" : "2xl"}
      classNames={{
        wrapper: "p-3 overflow-hidden",
        backdrop: "bg-overlay/40",
        base: "m-0 sm:m-0 max-h-full rounded-large",
        header: "block p-0",
        footer: "flex-wrap border-t border-divider px-4 py-3 sm:px-5",
        closeButton:
          "detail-dialog-close end-3 top-3 grid size-9 place-items-center rounded-small p-0 text-foreground-600"
      }}>
      <ModalContent>
        <div className="detail-dialog-content">
          <div
            className={`shrink-0 border-b border-divider px-4 py-3 sm:px-5 ${dismissable ? "pr-14 sm:pr-14" : ""}`}>
            <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <div className="min-w-0 flex-1 basis-48">
                <ModalHeader>
                  <h2 className="py-1 text-base font-semibold leading-snug tracking-tight wrap-anywhere">
                    {title}
                  </h2>
                </ModalHeader>
                {description && (
                  <p className="pb-0.5 text-sm font-normal leading-snug text-foreground-600 wrap-anywhere">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex flex-wrap items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
          <div className="detail-dialog-body flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
            {children}
          </div>
        </div>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
}
