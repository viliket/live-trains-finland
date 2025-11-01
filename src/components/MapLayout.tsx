import { ComponentType, useMemo } from 'react';

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
  const hasMounted = useHasMounted();

  mapPortalNode = useMemo(() => {
    if (!hasMounted) {
      return null;
    }
    return createHtmlPortalNode<typeof VehicleMapContainer>({
      attributes: { style: 'height: 100%;' },
    });
  }, [hasMounted]);

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
