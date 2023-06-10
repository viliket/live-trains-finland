#!/usr/bin/env node

import fs from 'fs';

import GeoJSON from 'geojson';

/**
 * Response type for GET https://julkinen.vayla.fi/inspirepalvelu/avoin/wfs?request=getFeature&typeName=avoin:passenger_platform&outputFormat=json
 */
type PlatformData = GeoJSON.FeatureCollection<
  GeoJSON.LineString,
  {
    oid: string;
    type: string;
    temporalstarttime: string;
    state: string;
    platform_type: 'Välilaituri' | 'Reunalaituri';
    total_length: number;
    maintenance_length: number;
    total_width: null | number;
    commissioning_date: string;
    name: string;
    owner: string;
    estimated_commissioning_date: null;
    estimated_decommissioning_date: null;
    /**
     * Comma separated oids of the platform parts
     */
    platform_part: string;
    maintenance_oversight_district: string;
    maintenance_district: string;
    operating_centre_district: string;
    accounting_route_number: string;
    locationtrack: string;
    routenumber: string;
    kmm: string;
    km: string;
    m: string;
  }
>;

/**
 * Response type for GET https://avoinapi.vaylapilvi.fi/vaylatiedot/ows?service=wfs&request=getFeature&typeName=ratatiedot:platform_part&outputFormat=json
 */
type PlatformPartData = GeoJSON.FeatureCollection<
  GeoJSON.LineString,
  {
    internal_id: number;
    oid: string;
    type: string;
    temporalstarttime: string;
    state: string;
    platform_id: string;
    platform_number: string;
    platform_side: 'Vasen' | 'Oikea';
    platform_height: string;
    platform_edge: string;
    platform_surface: string;
    danger_area_surface: string;
    danger_area_width: null | number;
    estimated_commissioning_date: string | null;
    estimated_decommissioning_date: string | null;
    operating_centre_district: string;
    accounting_route_number: string;
    maintenance_oversight_district: string;
    maintenance_district: string;
    locationtrack: string;
    routenumber: string;
    kmm: string;
    km: string;
    m: string;
  }
>;

const vaylaInspireApiBaseUrl =
  'https://julkinen.vayla.fi/inspirepalvelu/avoin/wfs';
const vaylaApiBaseUrl = ' https://avoinapi.vaylapilvi.fi/vaylatiedot/ows';

async function fetchAndSaveData() {
  console.log('Fetching and saving data');

  const platformsResponse = await fetch(
    `${vaylaInspireApiBaseUrl}?request=getFeature&typeName=avoin:passenger_platform&outputFormat=json`
  );
  const platforms = (await platformsResponse.json()) as PlatformData;

  const platformPartsResponse = await fetch(
    `${vaylaApiBaseUrl}?service=wfs&request=getFeature&typeName=ratatiedot:platform_part&outputFormat=json`
  );
  const platformParts =
    (await platformPartsResponse.json()) as PlatformPartData;

  const stationPlatformInfoByStationPlatformId = Object.values(
    platformParts.features
  ).reduce(
    (a, v) => ({
      ...a,
      [v.properties.platform_id.toUpperCase().trim()]: {
        platform_side: v.properties.platform_side,
        oid: v.properties.oid,
      },
    }),
    {} as Record<
      string,
      { platform_side: string; oid: string; platformType?: string }
    >
  );

  // Update correct platform type on each platform part based on platforms and their platform_part array
  platforms.features.forEach((p) => {
    if (p.properties.platform_part == null) return;
    const relatedPlatformParts = p.properties.platform_part.split(',');
    relatedPlatformParts.forEach((platformPartOid) => {
      const entry = Object.entries(stationPlatformInfoByStationPlatformId).find(
        (o) => o[1].oid === platformPartOid
      );
      if (entry) {
        entry[1].platformType = p.properties.platform_type;
      }
    });
  });

  // Finnish Transport Infrastucture Agency data contains some errors for platform sides
  // Correct these errors by overriding the data using a corrections file data
  let stationPlatformInfoByStationPlatformIdCorrectionsRawData =
    fs.readFileSync(
      'tools/station-platform-info-by-station-platform-id-corrections.json',
      {
        encoding: 'utf-8',
      }
    );
  let stationPlatformInfoByStationPlatformIdCorrections = JSON.parse(
    stationPlatformInfoByStationPlatformIdCorrectionsRawData
  ) as Record<
    string,
    {
      platform_side: string;
      oid: string;
      platformType?: string | undefined;
    }
  >;
  Object.entries(stationPlatformInfoByStationPlatformIdCorrections).forEach(
    ([platformId, platformData]) => {
      stationPlatformInfoByStationPlatformId[platformId] = platformData;
    }
  );

  const convertPlatformSideToCleanFormat = (platformSide: string) => {
    switch (platformSide) {
      case 'Oikea':
        return 'right';
      case 'Vasen':
        return 'left';
      case 'Ei tiedossa':
        return 'unknown';
      default:
        return platformSide;
    }
  };

  const convertPlatformTypeToCleanFormat = (
    platformType: string | undefined
  ) => {
    switch (platformType) {
      case 'Reunalaituri':
        // https://en.wikipedia.org/wiki/Side_platform
        return 'side';
      case 'Välilaituri':
        // https://en.wikipedia.org/wiki/Island_platform
        return 'island';
      default:
        return platformType;
    }
  };

  // Convert to final simplified format
  const stationPlatformByStationPlatformId = Object.entries(
    stationPlatformInfoByStationPlatformId
  ).reduce((entries, [platformId, platformData]) => {
    entries[platformId.replace('LAITURI', '').trim()] = {
      platformSide: convertPlatformSideToCleanFormat(
        platformData.platform_side
      ),
      platformType: convertPlatformTypeToCleanFormat(platformData.platformType),
    };
    return entries;
  }, {} as Record<string, { platformSide: string; platformType: string | undefined }>);

  fs.writeFile(
    'src/utils/generated/station-platform-by-station-platform-id.json',
    JSON.stringify(stationPlatformByStationPlatformId, undefined, 2),
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log('File written succesfully');
    }
  );
}

fetchAndSaveData();
