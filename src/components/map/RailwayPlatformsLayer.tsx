import { useTheme } from '@mui/material';
import { Layer, Source } from 'react-map-gl';

const RailwayPlatformsLayer = () => {
  const theme = useTheme();

  return (
    <Source
      type="vector"
      url={`pmtiles://${window.location.origin}/tiles/railway_platforms.pmtiles`}
    >
      <Layer
        {...{
          id: 'railway_platforms',
          beforeId: 'z5',
          type: 'fill',
          source: 'railway_platforms',
          'source-layer': 'railway_platforms',
          paint: {
            'fill-color': theme.palette.secondary.main,
            'fill-opacity': 0.4,
          },
        }}
      />
    </Source>
  );
};

export default RailwayPlatformsLayer;
