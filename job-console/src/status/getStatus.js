import os from 'os';
import uuid from 'uuid/v4';

import { name } from '../../package.json';

const runId = uuid();

export default function getStatus(_, res) {
  const { pid } = process;
  const { rss, heapUsed, heapTotal } = process.memoryUsage();

  const heapUsage = ((heapUsed / heapTotal) * 100);
  const memoryUsage = 100 - ((os.freemem() / os.totalmem()) * 100);

  res.json({
    heapTotal,
    heapUsage,
    memoryUsage,
    name,
    pid,
    rss,
    runId,
    hostname: os.hostname(),
    load: os.loadavg(),
    uptime: os.uptime(),
  }).end();
}
