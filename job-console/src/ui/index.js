import { Router } from 'express';
import createJob from './createJob';
import jobDetails from './jobDetails';
import jobs from './jobs';

import { uuidValidator } from '../middleware';

const routes = new Router();
routes.param('jobId', uuidValidator);
routes.get('/', jobs);
routes.get('/jobs/:jobId', jobDetails);
routes.get('/new', createJob);

export default routes;
