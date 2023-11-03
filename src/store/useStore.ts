import { create } from 'zustand';

interface FieldState {
  currentExperimentId?: string;
  currentLocalStorageValue: string;
  isAuthModalOpen: boolean;
  isExperimentSheetOpen: boolean;
  isManageExperimentModalOpen: boolean;
  isSettingsSheetOpen: boolean;
  setAuthModalOpen: (isAuthModalOpen: boolean) => void;
  setCurrentExperimentId: (currentExperimentId: string) => void;
  setCurrentLocalStorageValue: (currentLocalStorageValue: string) => void;
  setExperimentSheetOpen: (isExperimentModalOpen: boolean) => void;
  setManageExperimentModalOpen: (isManageExperimentModalOpen: boolean) => void;
  setSettingsSheetOpen: (isSettingsModalOpen: boolean) => void;
}

export const useStore = create<FieldState>((set) => ({
  currentExperimentId: null,
  currentLocalStorageValue: null,
  isAuthModalOpen: false,
  isExperimentSheetOpen: false,
  isManageExperimentModalOpen: false,
  isSettingsSheetOpen: false,
  setAuthModalOpen: (isAuthModalOpen) => set(() => ({ isAuthModalOpen })),
  setCurrentExperimentId: (currentExperimentId) => set(() => ({ currentExperimentId })),
  setCurrentLocalStorageValue: (currentLocalStorageValue) => set(() => ({ currentLocalStorageValue })),
  setExperimentSheetOpen: (isExperimentModalOpen) => set(() => ({ isExperimentSheetOpen: isExperimentModalOpen })),
  setManageExperimentModalOpen: (isManageExperimentModalOpen) => set(() => ({ isManageExperimentModalOpen })),
  setSettingsSheetOpen: (isSettingsModalOpen) => set(() => ({ isSettingsSheetOpen: isSettingsModalOpen })),
}));
