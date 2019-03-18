const header = 'x-correlation-id';

export default function addCorrelationIdHeader(req, res, next) {
  // eslint-disable-next-line security/detect-object-injection
  const correlationId = req.headers[header];

  if (correlationId) {
    req.correlationId = correlationId;
    res.set(header, correlationId);
  }
  return next();
}
