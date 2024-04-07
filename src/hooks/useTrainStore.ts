import { create } from 'zustand';

type Train = {
  departureDate: string;
};

interface TrainState {
  trains: Record<number, Train>;
  setTrains: (newVehicles: Record<number, Train>) => void;
  getTrainByVehicleId: (id: number) => Train;
}

/**
 * Holds the identification details of trains that are currently being tracked in real-time.
 */
const useTrainStore = create<TrainState>((set, get) => ({
  trains: {},
  setTrains: (newTrains) => set({ trains: newTrains }),
  getTrainByVehicleId: (id) => get().trains[id],
}));

export default useTrainStore;
