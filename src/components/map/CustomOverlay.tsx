import React from 'react';
import { cloneElement } from 'react';

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
    this._container.classList.add('maplibregl-ctrl');
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
function CustomOverlay(props: { children: React.ReactElement }) {
  const ctrl = useControl<OverlayControl>(() => new OverlayControl());

  const map = ctrl.getMap();

  return (
    map &&
    createPortal(cloneElement(props.children, { map }), ctrl.getElement())
  );
}

export default React.memo(CustomOverlay);
