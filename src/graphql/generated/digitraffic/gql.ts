/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query RunningTrains {\n  currentlyRunningTrains(\n    where: {and: [{trainType: {trainCategory: {or: [{name: {equals: \"Commuter\"}}, {name: {equals: \"Long-distance\"}}]}}}, {operator: {shortCode: {equals: \"vr\"}}}]}\n  ) {\n    trainNumber\n    commuterLineid\n    departureDate\n    version\n    operator {\n      uicCode\n    }\n    trainType {\n      name\n      trainCategory {\n        name\n      }\n    }\n    trainLocations(orderBy: {timestamp: DESCENDING}, take: 2) {\n      speed\n      timestamp\n      location\n    }\n    timeTableRows(where: {commercialStop: {equals: true}}) {\n      ...TrainTimeTableRow\n    }\n  }\n}": types.RunningTrainsDocument,
    "query Station {\n  stations(where: {passengerTraffic: {equals: true}}) {\n    ...StationSummary\n  }\n}": types.StationDocument,
    "fragment StationSummary on Station {\n  name\n  shortCode\n}": types.StationSummaryFragmentDoc,
    "query Train($trainNumber: Int!, $departureDate: Date!) {\n  train(trainNumber: $trainNumber, departureDate: $departureDate) {\n    ...TrainDetails\n  }\n}": types.TrainDocument,
    "fragment TrainByStation on Train {\n  commuterLineid\n  trainNumber\n  departureDate\n  version\n  operator {\n    uicCode\n  }\n  trainType {\n    name\n    trainCategory {\n      name\n    }\n  }\n  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {\n    ...TrainTimeTableRow\n  }\n  trainType {\n    name\n  }\n}": types.TrainByStationFragmentDoc,
    "fragment TrainDetails on Train {\n  trainNumber\n  departureDate\n  version\n  runningCurrently\n  operator {\n    name\n  }\n  commuterLineid\n  trainType {\n    name\n    trainCategory {\n      name\n    }\n  }\n  operator {\n    shortCode\n    uicCode\n  }\n  compositions {\n    journeySections {\n      startTimeTableRow {\n        scheduledTime\n        liveEstimateTime\n        actualTime\n        station {\n          name\n        }\n      }\n      endTimeTableRow {\n        scheduledTime\n        liveEstimateTime\n        actualTime\n        station {\n          name\n        }\n      }\n      maximumSpeed\n      totalLength\n      locomotives {\n        vehicleNumber\n        powerTypeAbbreviation\n        locomotiveType\n        location\n      }\n      wagons {\n        vehicleNumber\n        salesNumber\n        wagonType\n        location\n        length\n        playground\n        pet\n        catering\n        video\n        luggage\n        smoking\n        disabled\n      }\n    }\n  }\n  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {\n    ...TrainTimeTableRow\n  }\n}\n\nfragment TrainTimeTableGroup on TimeTableGroup {\n  arrival {\n    ...TrainTimeTableRow\n  }\n  departure {\n    ...TrainTimeTableRow\n  }\n  trainDirection\n  stationPlatformSide\n}\n\nfragment TrainTimeTableRow on TimeTableRow {\n  trainStopping\n  scheduledTime\n  liveEstimateTime\n  actualTime\n  differenceInMinutes\n  unknownDelay\n  cancelled\n  causes {\n    categoryCode {\n      code\n      name\n    }\n    detailedCategoryCode {\n      name\n      code\n    }\n    thirdCategoryCode {\n      name\n      code\n    }\n  }\n  type\n  station {\n    name\n    shortCode\n  }\n  commercialTrack\n}": types.TrainDetailsFragmentDoc,
    "query TrainsByRoute($departureStation: String!, $arrivalStation: String!, $departureDateGreaterThan: Date!, $departureDateLessThan: Date!) {\n  trainsByVersionGreaterThan(\n    version: \"1\"\n    where: {and: [{and: [{departureDate: {greaterThan: $departureDateGreaterThan}}, {departureDate: {lessThan: $departureDateLessThan}}]}, {timeTableRows: {contains: {and: [{station: {shortCode: {equals: $departureStation}}}, {station: {shortCode: {equals: $arrivalStation}}}]}}}]}\n  ) {\n    ...TrainByStation\n  }\n}": types.TrainsByRouteDocument,
    "query TrainsByStation($station: String!, $departingTrains: Int!, $departedTrains: Int!, $arrivingTrains: Int!, $arrivedTrains: Int!) {\n  trainsByStationAndQuantity(\n    station: $station\n    departingTrains: $departingTrains\n    departedTrains: $departedTrains\n    arrivingTrains: $arrivingTrains\n    arrivedTrains: $arrivedTrains\n    where: {trainType: {trainCategory: {or: [{name: {equals: \"Commuter\"}}, {name: {equals: \"Long-distance\"}}]}}}\n  ) {\n    ...TrainByStation\n  }\n}": types.TrainsByStationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RunningTrains {\n  currentlyRunningTrains(\n    where: {and: [{trainType: {trainCategory: {or: [{name: {equals: \"Commuter\"}}, {name: {equals: \"Long-distance\"}}]}}}, {operator: {shortCode: {equals: \"vr\"}}}]}\n  ) {\n    trainNumber\n    commuterLineid\n    departureDate\n    version\n    operator {\n      uicCode\n    }\n    trainType {\n      name\n      trainCategory {\n        name\n      }\n    }\n    trainLocations(orderBy: {timestamp: DESCENDING}, take: 2) {\n      speed\n      timestamp\n      location\n    }\n    timeTableRows(where: {commercialStop: {equals: true}}) {\n      ...TrainTimeTableRow\n    }\n  }\n}"): (typeof documents)["query RunningTrains {\n  currentlyRunningTrains(\n    where: {and: [{trainType: {trainCategory: {or: [{name: {equals: \"Commuter\"}}, {name: {equals: \"Long-distance\"}}]}}}, {operator: {shortCode: {equals: \"vr\"}}}]}\n  ) {\n    trainNumber\n    commuterLineid\n    departureDate\n    version\n    operator {\n      uicCode\n    }\n    trainType {\n      name\n      trainCategory {\n        name\n      }\n    }\n    trainLocations(orderBy: {timestamp: DESCENDING}, take: 2) {\n      speed\n      timestamp\n      location\n    }\n    timeTableRows(where: {commercialStop: {equals: true}}) {\n      ...TrainTimeTableRow\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Station {\n  stations(where: {passengerTraffic: {equals: true}}) {\n    ...StationSummary\n  }\n}"): (typeof documents)["query Station {\n  stations(where: {passengerTraffic: {equals: true}}) {\n    ...StationSummary\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment StationSummary on Station {\n  name\n  shortCode\n}"): (typeof documents)["fragment StationSummary on Station {\n  name\n  shortCode\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Train($trainNumber: Int!, $departureDate: Date!) {\n  train(trainNumber: $trainNumber, departureDate: $departureDate) {\n    ...TrainDetails\n  }\n}"): (typeof documents)["query Train($trainNumber: Int!, $departureDate: Date!) {\n  train(trainNumber: $trainNumber, departureDate: $departureDate) {\n    ...TrainDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment TrainByStation on Train {\n  commuterLineid\n  trainNumber\n  departureDate\n  version\n  operator {\n    uicCode\n  }\n  trainType {\n    name\n    trainCategory {\n      name\n    }\n  }\n  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {\n    ...TrainTimeTableRow\n  }\n  trainType {\n    name\n  }\n}"): (typeof documents)["fragment TrainByStation on Train {\n  commuterLineid\n  trainNumber\n  departureDate\n  version\n  operator {\n    uicCode\n  }\n  trainType {\n    name\n    trainCategory {\n      name\n    }\n  }\n  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {\n    ...TrainTimeTableRow\n  }\n  trainType {\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment TrainDetails on Train {\n  trainNumber\n  departureDate\n  version\n  runningCurrently\n  operator {\n    name\n  }\n  commuterLineid\n  trainType {\n    name\n    trainCategory {\n      name\n    }\n  }\n  operator {\n    shortCode\n    uicCode\n  }\n  compositions {\n    journeySections {\n      startTimeTableRow {\n        scheduledTime\n        liveEstimateTime\n        actualTime\n        station {\n          name\n        }\n      }\n      endTimeTableRow {\n        scheduledTime\n        liveEstimateTime\n        actualTime\n        station {\n          name\n        }\n      }\n      maximumSpeed\n      totalLength\n      locomotives {\n        vehicleNumber\n        powerTypeAbbreviation\n        locomotiveType\n        location\n      }\n      wagons {\n        vehicleNumber\n        salesNumber\n        wagonType\n        location\n        length\n        playground\n        pet\n        catering\n        video\n        luggage\n        smoking\n        disabled\n      }\n    }\n  }\n  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {\n    ...TrainTimeTableRow\n  }\n}\n\nfragment TrainTimeTableGroup on TimeTableGroup {\n  arrival {\n    ...TrainTimeTableRow\n  }\n  departure {\n    ...TrainTimeTableRow\n  }\n  trainDirection\n  stationPlatformSide\n}\n\nfragment TrainTimeTableRow on TimeTableRow {\n  trainStopping\n  scheduledTime\n  liveEstimateTime\n  actualTime\n  differenceInMinutes\n  unknownDelay\n  cancelled\n  causes {\n    categoryCode {\n      code\n      name\n    }\n    detailedCategoryCode {\n      name\n      code\n    }\n    thirdCategoryCode {\n      name\n      code\n    }\n  }\n  type\n  station {\n    name\n    shortCode\n  }\n  commercialTrack\n}"): (typeof documents)["fragment TrainDetails on Train {\n  trainNumber\n  departureDate\n  version\n  runningCurrently\n  operator {\n    name\n  }\n  commuterLineid\n  trainType {\n    name\n    trainCategory {\n      name\n    }\n  }\n  operator {\n    shortCode\n    uicCode\n  }\n  compositions {\n    journeySections {\n      startTimeTableRow {\n        scheduledTime\n        liveEstimateTime\n        actualTime\n        station {\n          name\n        }\n      }\n      endTimeTableRow {\n        scheduledTime\n        liveEstimateTime\n        actualTime\n        station {\n          name\n        }\n      }\n      maximumSpeed\n      totalLength\n      locomotives {\n        vehicleNumber\n        powerTypeAbbreviation\n        locomotiveType\n        location\n      }\n      wagons {\n        vehicleNumber\n        salesNumber\n        wagonType\n        location\n        length\n        playground\n        pet\n        catering\n        video\n        luggage\n        smoking\n        disabled\n      }\n    }\n  }\n  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {\n    ...TrainTimeTableRow\n  }\n}\n\nfragment TrainTimeTableGroup on TimeTableGroup {\n  arrival {\n    ...TrainTimeTableRow\n  }\n  departure {\n    ...TrainTimeTableRow\n  }\n  trainDirection\n  stationPlatformSide\n}\n\nfragment TrainTimeTableRow on TimeTableRow {\n  trainStopping\n  scheduledTime\n  liveEstimateTime\n  actualTime\n  differenceInMinutes\n  unknownDelay\n  cancelled\n  causes {\n    categoryCode {\n      code\n      name\n    }\n    detailedCategoryCode {\n      name\n      code\n    }\n    thirdCategoryCode {\n      name\n      code\n    }\n  }\n  type\n  station {\n    name\n    shortCode\n  }\n  commercialTrack\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TrainsByRoute($departureStation: String!, $arrivalStation: String!, $departureDateGreaterThan: Date!, $departureDateLessThan: Date!) {\n  trainsByVersionGreaterThan(\n    version: \"1\"\n    where: {and: [{and: [{departureDate: {greaterThan: $departureDateGreaterThan}}, {departureDate: {lessThan: $departureDateLessThan}}]}, {timeTableRows: {contains: {and: [{station: {shortCode: {equals: $departureStation}}}, {station: {shortCode: {equals: $arrivalStation}}}]}}}]}\n  ) {\n    ...TrainByStation\n  }\n}"): (typeof documents)["query TrainsByRoute($departureStation: String!, $arrivalStation: String!, $departureDateGreaterThan: Date!, $departureDateLessThan: Date!) {\n  trainsByVersionGreaterThan(\n    version: \"1\"\n    where: {and: [{and: [{departureDate: {greaterThan: $departureDateGreaterThan}}, {departureDate: {lessThan: $departureDateLessThan}}]}, {timeTableRows: {contains: {and: [{station: {shortCode: {equals: $departureStation}}}, {station: {shortCode: {equals: $arrivalStation}}}]}}}]}\n  ) {\n    ...TrainByStation\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TrainsByStation($station: String!, $departingTrains: Int!, $departedTrains: Int!, $arrivingTrains: Int!, $arrivedTrains: Int!) {\n  trainsByStationAndQuantity(\n    station: $station\n    departingTrains: $departingTrains\n    departedTrains: $departedTrains\n    arrivingTrains: $arrivingTrains\n    arrivedTrains: $arrivedTrains\n    where: {trainType: {trainCategory: {or: [{name: {equals: \"Commuter\"}}, {name: {equals: \"Long-distance\"}}]}}}\n  ) {\n    ...TrainByStation\n  }\n}"): (typeof documents)["query TrainsByStation($station: String!, $departingTrains: Int!, $departedTrains: Int!, $arrivingTrains: Int!, $arrivedTrains: Int!) {\n  trainsByStationAndQuantity(\n    station: $station\n    departingTrains: $departingTrains\n    departedTrains: $departedTrains\n    arrivingTrains: $arrivingTrains\n    arrivedTrains: $arrivedTrains\n    where: {trainType: {trainCategory: {or: [{name: {equals: \"Commuter\"}}, {name: {equals: \"Long-distance\"}}]}}}\n  ) {\n    ...TrainByStation\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;