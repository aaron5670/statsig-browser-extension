import { create } from "zustand";

interface FieldState {
  currentItemId?: string;
  currentLocalStorageValue: string;
  isItemSheetOpen: boolean;
  isManageExperimentModalOpen: boolean;
  isSettingsSheetOpen: boolean;
  isUserDetailsSheetOpen: boolean;
  setCurrentItemId: (currentItemId: string) => void;
  setCurrentLocalStorageValue: (currentLocalStorageValue: string) => void;
  setItemSheetOpen: (isItemSheetOpen: boolean) => void;
  setManageExperimentModalOpen: (isManageExperimentModalOpen: boolean) => void;
  setSettingsSheetOpen: (isSettingsModalOpen: boolean) => void;
  setUserDetailsSheetOpen: (isUserDetailsSheetOpen: boolean) => void;
}

export const useStore = create<FieldState>((set) => ({
  currentItemId: null,
  currentLocalStorageValue: null,
  isItemSheetOpen: false,
  isManageExperimentModalOpen: false,
  isSettingsSheetOpen: false,
  isUserDetailsSheetOpen: false,
  setCurrentItemId: (currentItemId) => set(() => ({ currentItemId })),
  setCurrentLocalStorageValue: (currentLocalStorageValue) =>
    set(() => ({ currentLocalStorageValue })),
  setItemSheetOpen: (isItemSheetOpen) => set(() => ({ isItemSheetOpen })),
  setManageExperimentModalOpen: (isManageExperimentModalOpen) =>
    set(() => ({ isManageExperimentModalOpen })),
  setSettingsSheetOpen: (isSettingsModalOpen) =>
    set(() => ({ isSettingsSheetOpen: isSettingsModalOpen })),
  setUserDetailsSheetOpen: (isUserDetailsSheetOpen) =>
    set(() => ({ isUserDetailsSheetOpen }))
}));
