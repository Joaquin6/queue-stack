import { parse } from 'path';

import toGeoJson from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';
import { readFile } from 'fs-extra';

export default function createGeoFenceService() {
  const service = {};

  // Extract a collection of polygon coordinates from the given kml file
  service.extractPolygonCoordinates = async geoFenceFilePath => {
    const { name } = parse(geoFenceFilePath);
    const xmlDom = new DOMParser().parseFromString(await readFile(geoFenceFilePath, 'utf8'));

    return toGeoJson.kml(xmlDom).features
      .filter(feature => feature.geometry.type === 'Polygon')
      .map(polyFeature => ({
        geoFenceFilePath,
        kmlFileName: name,
        geoFenceId: polyFeature.properties.name,
      }));
  };

  return service;
}
