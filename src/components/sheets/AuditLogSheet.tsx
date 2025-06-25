import { ScrollShadow } from "@nextui-org/react";
import { useStore } from "~store/useStore";
import AuditLogs from "~components/AuditLogs";
import React from 'react';
import { Sheet } from 'react-modal-sheet';

const AuditLogSheet = () => {
  const { isAuditLogSheetOpen, setAuditLogSheetOpen } = useStore((state) => state);

  const handleClose = () => {
    setAuditLogSheetOpen(false);
  };

  return (
    <Sheet
      isOpen={isAuditLogSheetOpen}
      onClose={handleClose}
      snapPoints={[650, 450]}
    >
      <Sheet.Container style={{ zIndex: 1000 }}>
        <Sheet.Header>
          <div className="p-3">
            <h1 className={'text-2xl font-bold'}>Audit Logs</h1>
            <p className="text-sm text-gray-700">
              View and track all changes made to your Statsig configurations.
            </p>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col justify-between" draggableAt="both">
            <ScrollShadow className="w-full px-3 pb-5">
              <AuditLogs />
            </ScrollShadow>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
};

export default AuditLogSheet; 