import { Router } from 'express';
import jobs from './jobs';

const v1 = new Router();

v1.use('/jobs', jobs);

export default v1;
