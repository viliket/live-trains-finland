import React, { useState, cloneElement } from 'react';

import { createPortal } from 'react-dom';
import { MapboxMap, IControl, useControl } from 'react-map-gl';

/**
 * Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
 * Adapted from https://github.com/visgl/react-map-gl/blob/master/examples/custom-overlay/src/custom-overlay.tsx
 */
class OverlayControl implements IControl {
  _map: MapboxMap | null = null;
  _container: HTMLElement | null = null;

  onAdd(map: MapboxMap) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
    return this._container;
  }

  onRemove() {
    this._container?.remove();
    if (!this._map) return;
    this._map = null;
  }

  getMap() {
    return this._map;
  }

  getElement() {
    return this._container;
  }
}

/**
 * A custom control that renders React element
 * Adapted from https://github.com/visgl/react-map-gl/blob/master/examples/custom-overlay/src/custom-overlay.tsx
 */
function CustomOverlay(props: {
  children: React.ReactElement<{ map: MapboxMap }>;
}) {
  const [, setIsAdded] = useState(false);

  const ctrl = useControl<OverlayControl>(
    () => new OverlayControl(),
    () => setIsAdded(true),
    () => {}
  );

  const map = ctrl.getMap();
  const element = ctrl.getElement();

  return (
    map &&
    element &&
    createPortal(cloneElement(props.children, { map }), element)
  );
}

export default React.memo(CustomOverlay);
