[![Netlify Status](https://api.netlify.com/api/v1/badges/62a70830-6ab5-4a0e-9299-ed99b72b67a0/deploy-status)](https://app.netlify.com/sites/junaan/deploys)

# Junaan.fi

A web application made with React that allows checking real-time train schedules, locations, and compositions of trains in Finland. The app uses open APIs provided by Fintraffic / Digitraffic and HSL / Digitransit.

Live version running at [junaan.fi](https://junaan.fi).

## Development

See the instructions below for development.

### Requirements

- Node.js >= 16
- npm >= 8

### Run the app

```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Regenerate GraphQL operations

```
npm run gql-codegen
```

Run the above command whenever you modify the GraphQL queries in the `src/graphql/queries` folder or when the remote GraphQL schema is modified.

Note that the above command is also run as part of the `prestart` script when running `npm start`.

### Run the tests

```
npm test
```

Launches the test runner in the interactive watch mode.

### Create production build

```
npm run build
```

Builds the app for production to the `build` folder.

### Regenerate the map tiles

Extract the map tile files (.pbf) from MBTiles in `data` and output the files to `public/tiles` using `npm run extract-tiles`.

#### Generate MBTiles for railway_tracks

1. Download the railway network map layer data from [Finnish Transport Infrastructure Agency's Download- and viewing service](https://julkinen.vayla.fi/oskari/?lang=en)

   - Choose Map layers -> Rail traffic -> Finnish rail network -> Railway network (multi-track).

2. Unzip the downloaded archive and convert the shape to GeoJSON using [ogr2ogr](https://gdal.org/programs/ogr2ogr.html).

```
ogr2ogr -f GeoJSON ./data/railway_tracks.geojson locationtracks_simplifiedLine.shp -s_srs EPSG:3
067 -t_srs EPSG:4326
```

3. Generate MBTiles using [tippecanoe](https://github.com/mapbox/tippecanoe) by Mapbox.

```
tippecanoe -o ./data/railway_tracks.mbtiles --drop-densest-as-needed ./data/railway_tracks.geojson --no-tile-compression --maximum-zoom=14
```

#### Generate MBTiles for railway_platforms

1. Fetch the OpenStreetMap (OSM) railway platform GeoJSON data through Overpass API for each station. See steps to do this below (CLI tool to be released later).
   - Make the following query for each station:
     ```
     [out:json];
     nwr(around:1000,<station lat>,<station lon>)[railway=platform];
     out geom;
     ```

- Convert the response OSM data to GeoJSON using [osmtogeojson](https://www.npmjs.com/package/osmtogeojson).
- Merge the features from all platforms into single feature collection and save the file to `data/railway_platforms.json`.

2. Generate MBTiles using [tippecanoe](https://github.com/mapbox/tippecanoe) by Mapbox.

```
tippecanoe -o ./data/railway_platforms.mbtiles --drop-densest-as-needed ./data/railway_platforms.json --no-tile-compression --minimum-zoom=14 --maximum-zoom=18
```

## License

Copyright (C) 2022 [Vili Ketonen](https://github.com/viliket)

[GNU General Public License version 3 (GPLv3)](gpl-3.0.txt)
