import { create } from 'zustand';

interface ServiceWorkerState {
  registration: ServiceWorkerRegistration | null;
  updateAvailable?: boolean;
  setRegistration: (newRegistration: ServiceWorkerRegistration | null) => void;
  setUpdateAvailable: (updateAvailable: boolean) => void;
  setRegistrationAndUpdateAvailable: (
    registration: ServiceWorkerRegistration | null,
    updateAvailable: boolean
  ) => void;
}

const useServiceWorkerStore = create<ServiceWorkerState>((set) => ({
  registration: null,
  updateAvailable: undefined,
  setRegistration: (newRegistration) => set({ registration: newRegistration }),
  setUpdateAvailable: (updateAvailable) => set({ updateAvailable }),
  setRegistrationAndUpdateAvailable: (registration, updateAvailable) =>
    set({
      registration: registration,
      updateAvailable: updateAvailable,
    }),
}));

export default useServiceWorkerStore;
