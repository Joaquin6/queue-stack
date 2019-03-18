import fs from 'fs-extra';
import path from 'path';
import Promise from 'bluebird';
import HttpError from 'standard-http-error';

import queueJobs from './queueJobs';

export default async function createJob(req, res, next) {
  const db = req.app.get('db');
  const { body, log } = req;
  const { url, name } = body;

  try {
    const [job] = await db.insert({ url, name }).into('jobs').returning('*');

    console.log('JOB -----------', job);

    const { id: jobId, createdDate } = job;
    const message = `Job Console: Job created; execution started at ${createdDate.toISOString()}`;

    log.info(message, {
      jobId,
      task: 'Job Console',
    });

    await db.insert({
      jobId,
      createdDate,
      details: message,
      state: 'initializing',
    }).into('statuses');

    res.redirect(`/jobs/${jobId}`);

    await queueJobs(req, job);
  } catch (e) {
    if (e instanceof HttpError) {
      return res.status(e.code).json({
        message: e.message,
        name: e.name,
      });
    }

    log.error('An unknown error has occurred', e);

    const error = new HttpError(500, 'An unknown error has occurred. Please try again later', {
      name: 'InternalFailure',
      originalError: e,
    });

    return next(error);
  }
}
