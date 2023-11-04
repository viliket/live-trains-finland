/* eslint-disable camelcase */
// Adapted from https://github.com/HSLdevcom/jore4-ui/blob/main/ui/src/types/hsl-map-style.d.ts
// This is a custom typing file, because the origin does not provide typings.
// Based on https://github.com/HSLdevcom/hsl-map-style
declare module 'hsl-map-style' {
  type Option = {
    enabled: boolean;
  };
  type QueryParam = {
    /**
     *  Url pattern where the parameter should be added.
     */
    url: string;
    name: string;
    value: string;
  };
  type Options = {
    sourcesUrl?: string; // <-- You can override the default ('https://cdn.digitransit.fi/') sources URL.
    queryParams?: QueryParam[];
    components?: {
      // Set each layer you want to include to true

      // Styles
      base?: Option; // Enabled by default
      municipal_borders?: Option;
      routes?: Option;
      text?: Option; // Enabled by default
      subway_entrance?: Option;
      poi?: Option;
      park_and_ride?: Option;
      ticket_sales?: Option;
      stops?: Option;
      citybikes?: Option;
      ticket_zones?: Option;
      ticket_zone_labels?: Option;

      // Themes
      text_sv?: Option;
      text_fisv?: Option;
      text_en?: Option;
      regular_routes?: Option;
      near_bus_routes?: option;
      routes_with_departures_only?: Option; // Enabled by default. Doesn't do anything until routes is enabled.
      regular_stops?: Option;
      near_bus_stops?: Option;
      print?: Option;
      greyscale?: Option;
      simplified?: Option;
      '3d'?: Option;
      driver_info?: Option;
    };

    // optional property to filter routes
    // Example syntax for routeFilter
    // ["1500", "2550"] // Shows both routes 1500 and 2550 (both directions)
    // [{ id: "1500" }] // Shows the route 1500 (both directions)
    // [{ id: "2550", direction: "2" }] // Shows the direction 2 of the route 2550
    // [{ idParsed: "20" }] // Shows the route 1020 (friendly name 20). Note! Parsed id shows all variants, also temporary routes!
    routeFilter?: unknown[];
    // optional property to change the date of routes and stops. ISODate format.
    joreDate?: string;
  };

  /**
   * Generates styles for map. Options parameter is optional, but can be used to hide or show different
   * map styles/elements. For example { components: { poi: { enabled: true } } } would show point of interest
   * icons on map. The result can be passed to MapLibre's 'mapStyle' paremeter as it is.
   */
  export function generateStyle(options?: Options): mapboxgl.Style;
}
