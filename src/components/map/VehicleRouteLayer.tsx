import { useTheme } from '@mui/material';
import GeoJSON from 'geojson';
import { Layer, Source } from 'react-map-gl/maplibre';

type VehicleRouteLayerProps = {
  data:
    | GeoJSON.Feature<GeoJSON.Geometry>
    | GeoJSON.FeatureCollection<GeoJSON.Geometry>
    | GeoJSON.Geometry
    | string;
};

const VehicleRouteLayer = ({ data }: VehicleRouteLayerProps) => {
  const theme = useTheme();

  return (
    <Source type="geojson" data={data}>
      <Layer
        {...{
          id: 'vehicle_route',
          beforeId: 'z6',
          type: 'line',
          source: 'vehicle_route',
          paint: {
            'line-color': theme.palette.secondary.main,
            'line-width': 3,
            'line-opacity': 1,
          },
        }}
      />
    </Source>
  );
};

export default VehicleRouteLayer;
