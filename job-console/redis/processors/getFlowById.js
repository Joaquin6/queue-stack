import request from 'requestretry';
import HttpError from 'standard-http-error';
import { conductorUrl } from '../../config';

export default async function getFlowById({
  correlationId,
  flowId,
}) {
  return new Promise((resolve, reject) => request({
    baseUrl: conductorUrl,
    json: true,
    method: 'GET',
    uri: `/v1/flows/${flowId}`,
    headers: correlationId ? { 'x-correlation-id': correlationId } : {},
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
