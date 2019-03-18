const HttpError = require('standard-http-error');

const ignoreNullExitCode = (status) => {
  const { exitCode, ...entry } = status;
  if (exitCode == null) {
    return entry;
  }
  return status;
};

module.exports = async function getStatuses(req) {
  const db = req.app.get('db');

  const { orderBy } = req;
  const { jobId } = req.params;

  try {
    const query = await db.select().from('statuses').orderBy('createdDate');

    return query.map(ignoreNullExitCode, { concurrency: 10 });
  } catch (e) {
    if (e instanceof HttpError) {
      return res.status(e.code).json({
        message: e.message,
        name: e.name,
      });
    }

    req.log.error('An unknown database error has occurred', e);

    const error = new HttpError(500, 'An unknown error has occurred. Please try again later', {
      name: 'InternalFailure',
      originalError: e,
    });

    throw error;
  }
};

module.exports.ignoreNullExitCode = ignoreNullExitCode;
