# Junaan.fi

![Test workflow](https://github.com/viliket/live-trains-finland/actions/workflows/test.yml/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/viliket/live-trains-finland/branch/main/graph/badge.svg?token=X4IG4JLOK9)](https://codecov.io/gh/viliket/live-trains-finland)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/464c726470b649b18f7b4fad710db235)](https://www.codacy.com/gh/viliket/live-trains-finland/dashboard?utm_source=github.com&utm_medium=referral&utm_content=viliket/live-trains-finland&utm_campaign=Badge_Grade)
![GitHub top language](https://img.shields.io/github/languages/top/viliket/live-trains-finland)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fjunaan.fi)](https://junaan.fi)

A web application made with React that allows checking real-time train
schedules, locations, and compositions of trains in Finland.
The app uses data from open APIs provided by
[Fintraffic](https://tmfg.fi/) /
[Digitraffic](https://www.digitraffic.fi/)
and [Helsinki regional traffic](https://hsl.fi/) /
[Digitransit](https://digitransit.fi/), licensed by
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Live version running at [junaan.fi](https://junaan.fi).

## Development

See the instructions below for development.

### Prerequisites

You need the following tools:

- Node.js `>= 16`
- npm `>= 8`

Register to the [Digitransit API Portal](https://portal-api.digitransit.fi/)
and create yourself a new API subscription key.

Copy the example configuration values from the `.env` file to a new file named
`.env.local` and replace the values with your own.

### Run the app

```bash
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Regenerate GraphQL operations

```bash
npm run gql-codegen
```

Run the above command whenever you modify the GraphQL queries in the
`src/graphql/queries` folder or when the remote GraphQL schema is modified.

Note that the above command is also run as part of the `prestart` script when
running `npm start`.

### Run the tests

```bash
npm test
```

Launches the test runner in the interactive watch mode.

### Create production build

```bash
npm run build
```

Builds the app for production to the `build` folder.

### Regenerate the map tiles

Extract the map tile files (.pbf) from MBTiles in `data` and output the files
to `public/tiles` using `npm run extract-tiles-public`.

#### Generate MBTiles for railway_tracks

1. Download the railway network map layer data from
   [Finnish Transport Infrastructure Agency's Download- and viewing service](https://julkinen.vayla.fi/oskari/?lang=en)

   - Choose Map layers -> Rail traffic -> Finnish rail network
     -> Railway network (multi-track).

2. Unzip the downloaded archive and convert the shape to GeoJSON using
   [ogr2ogr](https://gdal.org/programs/ogr2ogr.html).

   ```bash
   ogr2ogr -f GeoJSON ./data/railway_tracks.geojson locationtracks_simplifiedLine.shp -s_srs EPSG:3
   067 -t_srs EPSG:4326
   ```

3. Generate MBTiles using [tippecanoe](https://github.com/mapbox/tippecanoe)
   by Mapbox.

   ```bash
   tippecanoe -o ./data/railway_tracks.mbtiles --drop-densest-as-needed ./data/railway_tracks.geojson --no-tile-compression --maximum-zoom=14
   ```

#### Generate MBTiles for railway_platforms

1. Fetch the OpenStreetMap (OSM) railway platform GeoJSON data through Overpass
   API for each station. See steps to do this below (CLI tool to be released later).

   - Perform the following query for each station:

     ```overpassql
     [out:json];
     nwr(around:1000,<station lat>,<station lon>)[railway=platform];
     out geom;
     ```

   - Convert the response OSM data to GeoJSON using [osmtogeojson](https://www.npmjs.com/package/osmtogeojson).
   - Merge the features from all platforms into single feature collection and
     save the file to `data/railway_platforms.json`.

2. Generate MBTiles using [tippecanoe](https://github.com/mapbox/tippecanoe)
   by Mapbox.

   ```bash
   tippecanoe -o ./data/railway_platforms.mbtiles --drop-densest-as-needed ./data/railway_platforms.json --no-tile-compression --minimum-zoom=14 --maximum-zoom=18
   ```

### Regenerate train station line km location data

```bash
npm run generate-station-line-km-location-data
```

Fetches the line kilometer (ratakilometri) location data for all train stations in
Finland from [Digitraffic Infra API](https://rata.digitraffic.fi/infra-api/)
and outputs it to [`src/utils/generated/line-km-location-by-station-code.json`](./src/utils/generated/line-km-location-by-station-code.json).
This data is used to determine [train direction](./src/utils/getTrainDirection.ts)
at each station based on the increasing or decreasing line kilometers.

### Regenerate train station platform data

```bash
npm run generate-station-platform-data
```

Fetches the station platform (laituri) data for all train stations in Finland
from [Finnish Transport Infrastructure Agency's Open API](https://vayla.fi/en/transport-network/data/open-data/api)
and outputs it to [`src/utils/generated/station-platform-by-station-platform-id.json`](./src/utils/generated/station-platform-by-station-platform-id.json).
This data is used to determine which side the station platform is (left or
right) according to the train direction.
See [getStationPlatformSide.ts](./src/utils/getStationPlatformSide.ts) for the logic.

## License

Copyright (C) 2023 [Vili Ketonen](https://github.com/viliket)

[GNU General Public License version 3 (GPLv3)](gpl-3.0.txt)
