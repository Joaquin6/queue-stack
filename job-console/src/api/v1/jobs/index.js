import { Router } from 'express';

import validator from './validator';
import createJob from './createJob';
import getJob from './getJob';
import getJobs from './getJobs';

const jobs = new Router();

jobs.route('/')
  .get(getJobs)
  .post(validator.post, createJob);

jobs.route('/:jobId')
  .get(validator.get, getJob);

export default jobs;
