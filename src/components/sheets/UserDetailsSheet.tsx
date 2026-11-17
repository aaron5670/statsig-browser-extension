import { ScrollShadow } from "@heroui/react";
import { useStore } from "~/store/useStore";
import UserDetails from "~/components/UserDetails";
import { Sheet } from "react-modal-sheet";

const UserDetailsSheet = () => {
  const { isUserDetailsSheetOpen, setUserDetailsSheetOpen } = useStore(
    (state) => state
  );

  const handleClose = () => {
    setUserDetailsSheetOpen(false);
  };

  return (
    <Sheet isOpen={isUserDetailsSheetOpen} onClose={handleClose}>
      <Sheet.Container style={{ maxHeight: 350 }}>
        <Sheet.Header className="px-4 py-2 border-b">
          <h1 className={"text-lg font-bold text-gray-900"}>User Details</h1>
          <p className="text-xs text-gray-500">
            Current user information from the Statsig SDK on this page.
          </p>
        </Sheet.Header>
        <Sheet.Content scrollClassName="flex flex-col justify-between">
          <ScrollShadow className="w-full px-4 pb-5">
            <UserDetails />
          </ScrollShadow>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
};

export default UserDetailsSheet;
