import { useState, useEffect } from 'react';

import L from 'leaflet';
import { createPortal } from 'react-dom';

type ControlProps = {
  position: L.ControlPosition;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

const Control = ({ position, children, style }: ControlProps): JSX.Element => {
  const [container, setContainer] = useState<HTMLElement>(
    document.createElement('div')
  );
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  useEffect(() => {
    const targetDiv = document.getElementsByClassName(positionClass);
    setContainer(targetDiv[0] as HTMLElement);
  }, [positionClass]);

  const controlContainer = (
    <div className="leaflet-control leaflet-bar" style={style}>
      {children}
    </div>
  );

  L.DomEvent.disableClickPropagation(container);

  return createPortal(controlContainer, container);
};

export default Control;
