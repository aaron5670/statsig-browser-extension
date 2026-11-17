import { ScrollShadow } from "@heroui/react";
import { useStore } from "~/store/useStore";
import AuditLogs from "~/components/AuditLogs";
import { Sheet } from "react-modal-sheet";

const AuditLogSheet = () => {
  const { isAuditLogSheetOpen, setAuditLogSheetOpen } = useStore(
    (state) => state
  );

  const handleClose = () => {
    setAuditLogSheetOpen(false);
  };

  return (
    <Sheet
      isOpen={isAuditLogSheetOpen}
      onClose={handleClose}
      initialSnap={2}
      snapPoints={[0, 0.7, 1]}>
      <Sheet.Container style={{ maxHeight: 650, zIndex: 1000 }}>
        <Sheet.Header>
          <div className="px-4 py-2 border-b">
            <h1 className={"text-lg font-bold text-gray-900"}>Audit Logs</h1>
            <p className="text-xs text-gray-500">
              View and track all changes made to your Statsig configurations.
            </p>
          </div>
        </Sheet.Header>
        <Sheet.Content scrollClassName="flex flex-col justify-between">
          <ScrollShadow className="w-full px-4 pb-5">
            <AuditLogs />
          </ScrollShadow>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
};

export default AuditLogSheet;
