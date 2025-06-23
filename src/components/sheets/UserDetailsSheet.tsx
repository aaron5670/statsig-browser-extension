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
        <Sheet.Header>
          <div className="p-3">
            <h1 className={'text-2xl font-bold'}>User Details</h1>
            <p className="text-sm text-gray-700">
              Current user information from the Statsig SDK on this page.
            </p>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller className="flex flex-col justify-between" draggableAt="both">
            <ScrollShadow className="w-full px-3 pb-5">
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