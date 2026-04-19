import { Layer, Source } from 'react-map-gl/maplibre';

import { useResolvedPalette } from '../../hooks/useResolvedPalette';

const RailwayPlatformsLayer = () => {
  const { palette } = useResolvedPalette();

  return (
    <Source
      type="vector"
      tiles={[
        window.location.origin + '/tiles/railway_platforms/{z}/{x}/{y}.pbf',
      ]}
    >
      <Layer
        {...{
          id: 'railway_platforms',
          beforeId: 'z5',
          type: 'fill',
          source: 'railway_platforms',
          'source-layer': 'railway_platforms',
          paint: {
            'fill-color': palette.secondary.main,
            'fill-opacity': 0.4,
          },
        }}
      />
    </Source>
  );
};

export default RailwayPlatformsLayer;
