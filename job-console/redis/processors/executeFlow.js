import request from 'requestretry';
import HttpError from 'standard-http-error';

import { conductorUrl } from '../../config';

export default async function executeFlow({
  siteId,
  flightId,
  inputPath,
  stateMachineId,
  correlationId,
  geoFenceId,
  geoFenceFilePath,
}) {
  const bodyData = {
    siteId,
    flightId,
    stateMachineId,
    inputDirectory: inputPath,
  };

  if (geoFenceId) {
    bodyData.geoFenceId = geoFenceId;
  }

  if (geoFenceFilePath) {
    bodyData.geoFenceFilePath = geoFenceFilePath;
  }

  return new Promise((resolve, reject) => request({
    baseUrl: conductorUrl,
    json: true,
    method: 'POST',
    uri: '/v1/flows',
    headers: correlationId ? { 'x-correlation-id': correlationId } : {},
    body: bodyData,
  }, (err, res, body) => {
    if (err) {
      return reject(err);
    }

    if (res.statusCode >= 300) {
      return reject(new HttpError(res.statusCode, body.message, { body }));
    }

    return resolve(body);
  }));
}
