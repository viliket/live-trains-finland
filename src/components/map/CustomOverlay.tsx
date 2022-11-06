import React from 'react';
import { cloneElement, useState } from 'react';

import { createPortal } from 'react-dom';
import { MapboxMap, IControl, useControl } from 'react-map-gl';

/**
 * Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
 * Adapted from https://github.com/visgl/react-map-gl/blob/master/examples/custom-overlay/src/custom-overlay.tsx
 */
class OverlayControl implements IControl {
  _map: MapboxMap | null = null;
  _container: HTMLElement | null = null;
  _redraw: () => void;

  constructor(redraw: () => void) {
    this._redraw = redraw;
  }

  onAdd(map: MapboxMap) {
    this._map = map;
    map.on('move', this._redraw);
    this._container = document.createElement('div');
    this._container.classList.add('maplibregl-ctrl');
    this._redraw();
    return this._container;
  }

  onRemove() {
    this._container?.remove();
    if (!this._map) return;
    this._map.off('move', this._redraw);
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
 * A custom control that rerenders arbitrary React content whenever the camera changes
 * Adapted from https://github.com/visgl/react-map-gl/blob/master/examples/custom-overlay/src/custom-overlay.tsx
 */
function CustomOverlay(props: { children: React.ReactElement }) {
  const [, setVersion] = useState(0);

  const ctrl = useControl<OverlayControl>(() => {
    const forceUpdate = () => setVersion((v) => v + 1);
    return new OverlayControl(forceUpdate);
  });

  const map = ctrl.getMap();

  return (
    map &&
    createPortal(cloneElement(props.children, { map }), ctrl.getElement())
  );
}

export default React.memo(CustomOverlay);
