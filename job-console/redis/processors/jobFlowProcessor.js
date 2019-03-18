import db from '../../db';
import log from '../bunyan';
import { pollingIntervalMs } from '../../config';
import pollingInterval from './pollingInterval';
import executeFlow from './executeFlow';

export default async (job, done) => {
  const {
    name,
    siteId,
    flightId,
    projectId,
    inputPath,
    description,
    correlationId,
    stateMachineId,
    email: createdBy,
  } = job.data;

  const flow = await executeFlow(job.data);

  await db.insert({
    createdBy,
    description,
    flightId,
    inputPath,
    name,
    projectId,
    siteId,
    stateMachineId,
    jobId: flow.flowId,
  }).into('jobs');

  const intervalTimer = setInterval(() => pollingInterval({
    correlationId,
    flowId: flow.flowId,
    intervalTimer,
    log,
    done,
  }), pollingIntervalMs);
};
