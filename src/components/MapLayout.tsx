import { ComponentType, createContext, useContext, useMemo } from 'react';

import dynamic from 'next/dynamic';
import {
  createHtmlPortalNode,
  HtmlPortalNode,
  InPortal,
  OutPortal,
} from 'react-reverse-portal';

import { useHasMounted } from '../hooks/useHasMounted';

import type { VehicleMapContainerProps } from './map/VehicleMapContainer';

const VehicleMapContainer = dynamic(() => import('./map/VehicleMapContainer'), {
  ssr: false,
});

type MapPortalNode = HtmlPortalNode<ComponentType<VehicleMapContainerProps>>;

const MapPortalContext = createContext<MapPortalNode | null>(null);

export const VehicleMapContainerPortal = ({
  selectedVehicleId,
  station,
  route,
  train,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
  const mapPortalNode = useContext(MapPortalContext);

  return (
    mapPortalNode && (
      <OutPortal<typeof VehicleMapContainer>
        node={mapPortalNode}
        selectedVehicleId={selectedVehicleId}
        station={station}
        route={route}
        train={train}
        onVehicleSelected={onVehicleSelected}
      />
    )
  );
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  const hasMounted = useHasMounted();

  const mapPortalNode = useMemo<MapPortalNode | null>(() => {
    if (!hasMounted) {
      return null;
    }
    return createHtmlPortalNode<typeof VehicleMapContainer>({
      attributes: { style: 'height: 100%;' },
    });
  }, [hasMounted]);

  return (
    <MapPortalContext.Provider value={mapPortalNode}>
      {mapPortalNode && (
        <InPortal node={mapPortalNode}>
          <VehicleMapContainer
            selectedVehicleId={null}
            onVehicleSelected={() => {}}
          />
        </InPortal>
      )}
      {children}
    </MapPortalContext.Provider>
  );
}
