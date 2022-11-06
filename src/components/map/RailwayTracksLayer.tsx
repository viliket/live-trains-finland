import { Layer, Source } from 'react-map-gl';

const RailwayTracksLayer = () => {
  return (
    <Source
      type="vector"
      tiles={[window.location.origin + '/tiles/railway_tracks/{z}/{x}/{y}.pbf']}
      attribution='<a href="https://vayla.fi/" target="_blank">&copy; Väylävirasto</a>'
    >
      <Layer
        {...{
          id: 'railway_tracks',
          beforeId: 'z5',
          type: 'line',
          source: 'railway_tracks',
          'source-layer': 'railway_tracks',
          maxzoom: 14,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#666',
            'line-width': 1,
            'line-opacity': 0.6,
          },
        }}
      />
    </Source>
  );
};

export default RailwayTracksLayer;
