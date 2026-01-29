import { ScrollShadow } from "@nextui-org/react";
import { useStore } from "~store/useStore";
import UserDetails from "~components/UserDetails";
import React from 'react';
import { Sheet } from 'react-modal-sheet';

const UserDetailsSheet = () => {
  const { isUserDetailsSheetOpen, setUserDetailsSheetOpen } = useStore((state) => state);

  const handleClose = () => {
    setUserDetailsSheetOpen(false);
  };

  return (
    <Sheet
      isOpen={isUserDetailsSheetOpen}
      onClose={handleClose}
      snapPoints={[350]}
    >
      <Sheet.Container>
        <Sheet.Header className="px-4 py-2 border-b">
          <h1 className={'text-lg font-bold text-gray-900'}>User Details</h1>
          <p className="text-xs text-gray-500">
            Current user information from the Statsig SDK on this page.
          </p>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col justify-between" draggableAt="both">
            <ScrollShadow className="w-full px-4 pb-5">
              <UserDetails />
            </ScrollShadow>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
};

export default UserDetailsSheet; 