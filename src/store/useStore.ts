import { create } from 'zustand';

interface FieldState {
  currentItemId?: string;
  currentLocalStorageValue: string;
  currentAuditLogId?: string;
  isAuthModalOpen: boolean;
  isItemSheetOpen: boolean;
  isManageExperimentModalOpen: boolean;
  isSettingsSheetOpen: boolean;
  isUserDetailsSheetOpen: boolean;
  isAuditLogSheetOpen: boolean;
  isAuditLogDetailSheetOpen: boolean;
  setAuthModalOpen: (isAuthModalOpen: boolean) => void;
  setCurrentItemId: (currentItemId: string) => void;
  setCurrentLocalStorageValue: (currentLocalStorageValue: string) => void;
  setCurrentAuditLogId: (currentAuditLogId: string) => void;
  setItemSheetOpen: (isItemSheetOpen: boolean) => void;
  setManageExperimentModalOpen: (isManageExperimentModalOpen: boolean) => void;
  setSettingsSheetOpen: (isSettingsModalOpen: boolean) => void;
  setUserDetailsSheetOpen: (isUserDetailsSheetOpen: boolean) => void;
  setAuditLogSheetOpen: (isAuditLogSheetOpen: boolean) => void;
  setAuditLogDetailSheetOpen: (isAuditLogDetailSheetOpen: boolean) => void;
}

export const useStore = create<FieldState>((set) => ({
  currentItemId: null,
  currentLocalStorageValue: null,
  currentAuditLogId: null,
  isAuthModalOpen: false,
  isItemSheetOpen: false,
  isManageExperimentModalOpen: false,
  isSettingsSheetOpen: false,
  isUserDetailsSheetOpen: false,
  isAuditLogSheetOpen: false,
  isAuditLogDetailSheetOpen: false,
  setAuthModalOpen: (isAuthModalOpen) => set(() => ({ isAuthModalOpen })),
  setCurrentItemId: (currentItemId) => set(() => ({ currentItemId })),
  setCurrentLocalStorageValue: (currentLocalStorageValue) => set(() => ({ currentLocalStorageValue })),
  setCurrentAuditLogId: (currentAuditLogId) => set(() => ({ currentAuditLogId })),
  setItemSheetOpen: (isItemSheetOpen) => set(() => ({ isItemSheetOpen })),
  setManageExperimentModalOpen: (isManageExperimentModalOpen) => set(() => ({ isManageExperimentModalOpen })),
  setSettingsSheetOpen: (isSettingsModalOpen) => set(() => ({ isSettingsSheetOpen: isSettingsModalOpen })),
  setUserDetailsSheetOpen: (isUserDetailsSheetOpen) => set(() => ({ isUserDetailsSheetOpen })),
  setAuditLogSheetOpen: (isAuditLogSheetOpen) => set(() => ({ isAuditLogSheetOpen })),
  setAuditLogDetailSheetOpen: (isAuditLogDetailSheetOpen) => set(() => ({ isAuditLogDetailSheetOpen })),
}));
