import HttpError from 'standard-http-error';

const { message } = new HttpError(500);

module.exports = async function getJobs(req, res) {
  const db = req.app.get('db');
  try {
    const jobs = await db.select().from('jobs').orderBy('createdDate', 'desc');
    return res.json(jobs);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ message });
  }
};
