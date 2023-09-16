#!/usr/bin/env node

import fs from 'fs';

/**
 * Response type for GET /0.7/rautatieliikennepaikat.{format} - Rautatieliikennepaikat - Stations
 * @see https://rata.digitraffic.fi/infra-api/0.7/swagger-ui.html#/Rautatieliikennepaikat%20-%20Stations/rautatieliikennepaikatUsingGET
 */
type StationsData = Record<string, [Station]>;

/**
 * Station (rautatieliikennepaikka)
 * @see https://rata.digitraffic.fi/infra-api/0.7/swagger-ui.html#model-RautatieliikennepaikkaVersioDto
 */
type Station = {
  lyhenne: string;
  nimi: string;
  virallinenRatakmsijainti?: Ratakmsijainti;
  muutRatakmsijainnit?: Ratakmsijainti[];
};

/**
 * Line kilometer location (Ratakilometrisijainti)
 */
type Ratakmsijainti = {
  ratanumero: string;
  ratakm: number;
  etaisyys: number;
};

/**
 * Response type for GET /0.7/liikennepaikanosat.{format} - Liikennepaikan osat - Parts of station
 * @see https://rata.digitraffic.fi/infra-api/0.7/swagger-ui.html#/Rautatieliikennepaikat%20-%20Stations/rautatieliikennepaikatUsingGET
 */
type PartsOfStationData = Record<string, [PartOfStation]>;

/**
 * Part of station (liikennepaikan osa)
 * @see https://rata.digitraffic.fi/infra-api/0.7/swagger-ui.html#model-LiikennepaikanOsaVersioDto
 */
type PartOfStation = {
  lyhenne: string;
  nimi: string;
  virallinenRatakmsijainti: Ratakmsijainti;
  muutRatakmsijainnit: Ratakmsijainti[];
};

type LineKmLocation = {
  trackNumber: string | null;
  linekm: number | null;
  distance: number | null;
};

type LineKmLocationByStationCode = Record<
  string,
  LineKmLocation & { otherLinekmLocations: LineKmLocation[] }
>;

const digiTrafficInfraApiBaseUrl = 'http://rata.digitraffic.fi/infra-api/0.7';
const timeQueryParamValue =
  '2023-05-05T06%3A48%3A43Z%2F2023-05-05T06%3A48%3A43Z';

function convertStationDataToLineKmByStationCode(
  stationData: Record<string, [Station | PartOfStation]>
): LineKmLocationByStationCode {
  return Object.values(stationData)
    .map(([v]) => v)
    .reduce(
      (result, { lyhenne, virallinenRatakmsijainti, muutRatakmsijainnit }) => ({
        ...result,
        [lyhenne.toUpperCase().trim()]: {
          trackNumber: virallinenRatakmsijainti?.ratanumero ?? null,
          linekm: virallinenRatakmsijainti?.ratakm ?? null,
          distance: virallinenRatakmsijainti?.etaisyys ?? null,
          otherLinekmLocations:
            muutRatakmsijainnit?.map((r) => ({
              trackNumber: r.ratanumero,
              linekm: r.ratakm,
              distance: r.etaisyys,
            })) ?? [],
        },
      }),
      {} as LineKmLocationByStationCode
    );
}

async function fetchAndSaveData() {
  console.log('Fetching and saving data');

  const stationsResponse = await fetch(
    `${digiTrafficInfraApiBaseUrl}/rautatieliikennepaikat.json?propertyName=nimi,lyhenne,virallinenRatakmsijainti,muutRatakmsijainnit&time=${timeQueryParamValue}`
  );
  const stations = (await stationsResponse.json()) as StationsData;
  const lineKmByStationCode = convertStationDataToLineKmByStationCode(stations);

  const partsOfStationResponse = await fetch(
    `${digiTrafficInfraApiBaseUrl}/liikennepaikanosat.json?propertyName=lyhenne,nimi,virallinenRatakmsijainti,muutRatakmsijainnit&time=${timeQueryParamValue}`
  );
  const partsOfStation =
    (await partsOfStationResponse.json()) as PartsOfStationData;
  const lineKmByStationPartCode =
    convertStationDataToLineKmByStationCode(partsOfStation);

  // Merge lineKmByStationPartCode entries with lineKmByStationCode entries
  Object.entries(lineKmByStationPartCode).forEach(([stationCode, value]) => {
    if (!(stationCode in lineKmByStationCode)) {
      lineKmByStationCode[stationCode] = value;
    } else if (lineKmByStationCode[stationCode].linekm == null) {
      lineKmByStationCode[stationCode] = value;
    }
  });

  fs.writeFile(
    'src/utils/generated/line-km-location-by-station-code.json',
    JSON.stringify(lineKmByStationCode, undefined, 2),
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log('File written succesfully');
    }
  );
}

fetchAndSaveData();
