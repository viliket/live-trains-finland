import {
  createElementHook,
  createElementObject,
  useLayerLifecycle,
  useLeafletContext,
} from '@react-leaflet/core';
import { LeafletContextInterface } from '@react-leaflet/core/lib/context';
import L from 'leaflet';
import 'leaflet.vectorgrid';

function createVectorGrid(
  props: VectorGridProps,
  context: LeafletContextInterface
) {
  const { data, url, vectorTileLayerStyles, maxZoom, zIndex, ...rest } = props;

  const { map, pane, layerContainer } = context;

  const getMaxZoom = (maxZoom?: number) =>
    Math.min(24, maxZoom || map.getMaxZoom());

  let vectorGrid: L.VectorGrid;
  if (url) {
    vectorGrid = L.vectorGrid.protobuf(url, {
      vectorTileLayerStyles: vectorTileLayerStyles,
      maxZoom: getMaxZoom(maxZoom),
      // pass through other props
      ...rest,
    });
  } else if (data) {
    const defaultStyle = {
      sliced: {
        weight: 0.5,
        opacity: 1,
        color: '#ccc',
        fillColor: '#0000ff',
        fillOpacity: 0.5,
        fill: true,
        stroke: true,
      },
    };

    vectorGrid = L.vectorGrid.slicer(data, {
      vectorTileLayerStyles: vectorTileLayerStyles || defaultStyle,
      maxZoom: getMaxZoom(maxZoom),
      // pass through other props
      ...rest,
    });
  } else {
    throw new Error('Either url or data must be given');
  }

  vectorGrid.setZIndex(
    zIndex || Number(layerContainer && pane && map.getPane(pane)?.style?.zIndex)
  );

  return createElementObject(vectorGrid, context);
}

function updateVectorGrid(
  instance: L.VectorGrid,
  props: VectorGridProps,
  prevProps: VectorGridProps
) {
  if (props.zIndex !== prevProps.zIndex) {
    instance.setZIndex(props.zIndex);
  }
}

const useVectorGridElement = createElementHook(
  createVectorGrid,
  updateVectorGrid
);

type VectorGridProps = (
  | L.VectorGrid.SlicerOptions
  | L.VectorGrid.ProtobufOptions
) & {
  data?: GeoJSON.GeoJSON;
  url?: string;
  zIndex: number;
  attribution?: string;
};

function VectorGrid(props: VectorGridProps) {
  const context = useLeafletContext();
  const elementRef = useVectorGridElement(props, context);
  useLayerLifecycle(elementRef.current, context);

  return null;
}

export default VectorGrid;
