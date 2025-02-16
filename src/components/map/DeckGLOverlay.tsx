import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox';
import { useControl } from 'react-map-gl/maplibre';

const DeckGLOverlay = (
  props: MapboxOverlayProps & {
    interleaved?: boolean;
  }
) => {
  // @ts-expect-error
  // MapboxOverlay implements mapbox-gl.IControl but useControl expects maplibre-gl.IControl
  // See https://github.com/visgl/deck.gl/issues/9389
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};

export default DeckGLOverlay;
