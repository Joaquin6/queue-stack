import Promise from 'bluebird';

export default async function queueJobs(req, kmlJobs) {
  const queue = req.app.get('queue');

  await Promise.mapSeries(kmlJobs, kmlJob => queue.add(kmlJob, {
    delay: Math.floor(Math.random() * 60000) + 10000,
  }));
}
