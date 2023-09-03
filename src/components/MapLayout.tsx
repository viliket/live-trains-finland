import { ComponentType, useEffect, useMemo, useState } from 'react';

import dynamic from 'next/dynamic';
import {
  createHtmlPortalNode,
  HtmlPortalNode,
  InPortal,
  OutPortal,
} from 'react-reverse-portal';

import type { VehicleMapContainerProps } from './map/VehicleMapContainer';

const VehicleMapContainer = dynamic(() => import('./map/VehicleMapContainer'), {
  ssr: false,
});

let mapPortalNode: HtmlPortalNode<
  ComponentType<VehicleMapContainerProps>
> | null = null;

export const VehicleMapContainerPortal = ({
  selectedVehicleId,
  station,
  route,
  train,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  mapPortalNode = useMemo(() => {
    if (!isMounted) {
      return null;
    }
    return createHtmlPortalNode<typeof VehicleMapContainer>({
      attributes: { style: 'height: 100%;' },
    });
  }, [isMounted]);

  return (
    <>
      {mapPortalNode && (
        <InPortal node={mapPortalNode}>
          <VehicleMapContainer
            selectedVehicleId={null}
            onVehicleSelected={() => {}}
          />
        </InPortal>
      )}
      {children}
    </>
  );
}
