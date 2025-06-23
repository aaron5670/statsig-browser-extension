import { create } from 'zustand';

interface FieldState {
  currentItemId?: string;
  currentLocalStorageValue: string;
  isAuthModalOpen: boolean;
  isItemSheetOpen: boolean;
  isManageExperimentModalOpen: boolean;
  isSettingsSheetOpen: boolean;
  isUserDetailsSheetOpen: boolean;
  setAuthModalOpen: (isAuthModalOpen: boolean) => void;
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
  isAuthModalOpen: false,
  isItemSheetOpen: false,
  isManageExperimentModalOpen: false,
  isSettingsSheetOpen: false,
  isUserDetailsSheetOpen: false,
  setAuthModalOpen: (isAuthModalOpen) => set(() => ({ isAuthModalOpen })),
  setCurrentItemId: (currentItemId) => set(() => ({ currentItemId })),
  setCurrentLocalStorageValue: (currentLocalStorageValue) => set(() => ({ currentLocalStorageValue })),
  setItemSheetOpen: (isItemSheetOpen) => set(() => ({ isItemSheetOpen })),
  setManageExperimentModalOpen: (isManageExperimentModalOpen) => set(() => ({ isManageExperimentModalOpen })),
  setSettingsSheetOpen: (isSettingsModalOpen) => set(() => ({ isSettingsSheetOpen: isSettingsModalOpen })),
  setUserDetailsSheetOpen: (isUserDetailsSheetOpen) => set(() => ({ isUserDetailsSheetOpen })),
}));
