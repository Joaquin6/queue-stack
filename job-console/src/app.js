import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import moment from 'moment';
import routes from './routes';
import { addCorrelationIdHeader, addConfigToRequest, bunyan } from './middleware';

import config from '../config';

export const DEFAULT_ERROR_MESSAGE = 'There was a problem with your request. Please try again later';

const app = express();
app.disable('x-powered-by');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.locals.moment = moment;
app.locals.config = config;

app.set('etag', false);
app.set('trust proxy', config.trustProxy);

if (config.isProduction) {
  app.use(helmet.hsts({
    maxAge: 63042000,
    preload: true,
    setIf(req) {
      return req.secure || req.headers['x-forwarded-proto'] === 'https';
    },
  }));
}

app.use(helmet.noCache());

app.use(bunyan);

app.use(express.static(path.join(__dirname, '../static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(addConfigToRequest(config));
app.use(addCorrelationIdHeader);

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  req.log.error(err || 'undefined error');

  if (res.headersSent) {
    return next(err);
  }

  const status = (err && err.status) || 500;
  let message = (err && err.message) || DEFAULT_ERROR_MESSAGE;

  if (err instanceof SyntaxError && err.status === 400 && err.type === 'entity.parse.failed') {
    message = 'The API request JSON is malformed';
  }

  return res.status(status).format({
    html: () => res.render('error', {
      error: { message, status },
      user: req.user || null,
    }),
    json: () => res.json({ message, status }),
  });
});

export default app;
