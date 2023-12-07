import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox';
import { useControl } from 'react-map-gl';

const DeckGLOverlay = (
  props: MapboxOverlayProps & {
    interleaved?: boolean;
  }
) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};

export default DeckGLOverlay;
