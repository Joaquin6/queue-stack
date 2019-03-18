import HttpError from 'standard-http-error';

const { message } = new HttpError(500);

module.exports = async function getJob(req, res, next) {
  const db = req.app.get('db');
  const { jobId } = req.params;
  try {
    const [locatedJob] = await db.select().from('jobs').where({ id: jobId });
    if (!locatedJob) {
      return next(new HttpError(404, `No existing job with id "${jobId}"`));
    }
    return res.json(locatedJob);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ message });
  }
};
