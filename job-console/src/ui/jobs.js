import getStatuses from '../api/v1/jobs/controllers/getStatuses';

/**
 * Filter out unique statuses
 * @param {Array} statuses array of all status to be filtered out
 */
export function filterUniqueStatuses(statuses) {
  let lastStatus;

  return statuses.filter(status => {
    if (!lastStatus) {
      lastStatus = status;
      return true;
    }

    if (lastStatus.taskState === status.taskState
      && lastStatus.task === status.task
      && lastStatus.details === status.details) {
      lastStatus = status;
      return false;
    }

    lastStatus = status;
    return true;
  });
}

export default async (req, res, next) => {
  const db = req.app.get('db');
  const { config } = req;
  let jobs;
  let result;

  try {
    jobs = await db.select().from('jobs').orderBy('createdDate', 'desc');
    const statuses = filterUniqueStatuses(await getStatuses(req));

    jobs.forEach((job) => {
      result = statuses.find(statuses => statuses.jobId === job.id);
      if (result && result.state) {
        job.status = result.state;
      }
    });

    // eslint-disable-next-line no-console
    console.log('JOBS-------------:', jobs);

    return res.render('index', { data: jobs });
  } catch (e) {
    return next(e);
  }
};
