import { create } from 'zustand';

import { VehicleDetails } from '../types/vehicles';

interface VehicleState {
  vehicles: Record<number, VehicleDetails>;
  setVehicles: (newVehicles: Record<number, VehicleDetails>) => void;
  getVehicleById: (id: number) => VehicleDetails;
  removeAllVehicles: () => void;
  removeAllExceptVehicleWithTrainNumber: (trainNumber: number) => void;
}

/**
 * Holds the real-time state information of the vehicles.
 */
const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: {},
  setVehicles: (newVehicles) => set({ vehicles: newVehicles }),
  getVehicleById: (id) => get().vehicles[id],
  removeAllVehicles: () => set({ vehicles: {} }),
  removeAllExceptVehicleWithTrainNumber: (trainNumber: number) => {
    const vehicles = get().vehicles;
    Object.keys(vehicles).forEach((v) => {
      const vId = Number.parseInt(v, 10);
      if (vehicles[vId].jrn !== trainNumber) {
        delete vehicles[vId];
      }
    });

    set({ vehicles: vehicles });
  },
}));

export default useVehicleStore;
