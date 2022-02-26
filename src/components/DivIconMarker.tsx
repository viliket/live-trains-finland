import { useMemo, useState } from 'react';

import { divIcon, PointTuple } from 'leaflet';
import { createPortal } from 'react-dom';
import { Marker, MarkerProps } from 'react-leaflet';

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

type DivIconOptions = {
  element: JSX.Element;
  className?: string;
  iconSize?: PointTuple;
  iconAnchor?: PointTuple;
};

type DivIconMarkerProps = Override<MarkerProps, { icon: DivIconOptions }>;

const DivIconMarker = ({
  position,
  zIndexOffset,
  icon,
  eventHandlers,
  children,
}: DivIconMarkerProps) => {
  const [divElement] = useState(() => document.createElement('div'));
  const [iconWidth, iconHeight] = icon.iconSize ?? [undefined, undefined];
  const [iconAnchorX, iconAnchorY] = icon.iconAnchor ?? [undefined, undefined];
  const lDivIcon = useMemo(
    () =>
      divIcon({
        iconSize: iconWidth && iconHeight ? [iconWidth, iconHeight] : undefined,
        iconAnchor:
          iconAnchorX && iconAnchorY ? [iconAnchorX, iconAnchorY] : undefined,
        className: icon.className,
        html: divElement,
      }),
    [
      divElement,
      icon.className,
      iconWidth,
      iconHeight,
      iconAnchorX,
      iconAnchorY,
    ]
  );

  return (
    <>
      {createPortal(icon.element, divElement, 'icon')}
      <Marker
        icon={lDivIcon}
        position={position}
        zIndexOffset={zIndexOffset}
        children={children}
        eventHandlers={eventHandlers}
      />
    </>
  );
};

export default DivIconMarker;
