import bunyan from 'express-bunyan-logger';

import config from '../../config';

export default bunyan({
  includesFn: (req) => ({
    correlationId: req.correlationId,
  }),
  excludes: [
    'body',
    'req',
    'res',
  ],
  obfuscate: [
    'req-headers.authorization',
    'req-headers.cookie',
    'res-headers.set-cookie',
  ],
  streams: [{
    level: config.env !== 'test' ? 'info' : 'fatal',
    stream: process.stdout,
  }],
});
