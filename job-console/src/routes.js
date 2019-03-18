import { Router } from 'express';
import { addUserToRequest } from './middleware';
import status from './status';
import v1 from './api/v1';
import ui from './ui';

const routes = Router();
routes.use('/status', status);
routes.use('/', ui);
routes.use('/v1', v1);

export default routes;
