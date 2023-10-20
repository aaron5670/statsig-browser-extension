import { create } from 'zustand'

interface FieldState {
  currentExperimentId: string;
  experiments: [];
  isAuthModalOpen: boolean;
  isExperimentModalOpen: boolean;
  isLoading: boolean;
  isSettingsModalOpen: boolean;
  setAuthModalOpen: (isAuthModalOpen: boolean) => void;
  setCurrentExperimentId: (currentExperimentId: string) => void;
  setExperimentModalOpen: (isExperimentModalOpen: boolean) => void;
  setExperiments: (experiments: []) => void;
  setLoading: (isLoaded: boolean) => void;
  setSettingsModalOpen: (isSettingsModalOpen: boolean) => void;
}

export const useStore = create<FieldState>((set) => ({
  currentExperimentId: null,
  experiments: [],
  isAuthModalOpen: false,
  isExperimentModalOpen: false,
  isLoading: true,
  isSettingsModalOpen: false,
  setAuthModalOpen: (isAuthModalOpen) => set(() => ({ isAuthModalOpen })),
  setCurrentExperimentId: (currentExperimentId) => set(() => ({ currentExperimentId })),
  setExperimentModalOpen: (isExperimentModalOpen) => set(() => ({ isExperimentModalOpen })),
  setExperiments: (experiments) => set(() => ({ experiments })),
  setLoading: (isLoaded) => set(() => ({ isLoading: isLoaded })),
  setSettingsModalOpen: (isSettingsModalOpen) => set(() => ({ isSettingsModalOpen })),
}))
