import Moment from 'moment';

import getStatuses from '../api/v1/jobs/controllers/getStatuses';

/**
 * Moment's humanize function rounds the given value.
 * For example, given 2.8 hours, should've resulted in `2 hours and an hour`.
 * This function removes the 2 hours, from the instance, leaving only 0.8 hours, and doesn't
 * use Moment's humanize function to avoid rounding.
 *
 * Additionally, note that this should be used to humanize values greater than 1 second,
 * as the resulting String will be empty for durations <= 1000 milliseconds.
 *
 * @param {!Number} [eventDuration]
 * @param {String} [unit]
 *
 * @example
 * // 45 minutes
 * humanizeDuration(45, 'minutes')
 *
 * @example
 * // 3 days and 3 hours and 14 minutes
 * humanizeDuration(4514, 'minutes')
 *
 * @example
 * // 85 years and 10 months and 1 days and 2 hours and 27 minutes
 * humanizeDuration(45145587, 'minutes')
 *
 * @returns {String} Returns the human readable duration of the event
 */
export function humanizeDuration(eventDuration, unit) {
  const units = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
  const eventMDuration = unit ? Moment.duration(eventDuration, unit)
    : Moment.duration(eventDuration);
  const lowestPrec = unit || 'seconds';

  let durationString = '';

  // eslint-disable-next-line no-plusplus
  for (let y = 0; y < units.length; y++) {
    const precision = units[y];
    const pluralPrecision = precision.endsWith('s') ? precision : `${precision}s`;
    const singularPrecision = precision.endsWith('s') ? precision.slice(0, -1) : precision;
    const duration = eventMDuration[pluralPrecision]();

    if (duration > 0) {
      const humanized = `${duration} ${duration === 1 ? singularPrecision : pluralPrecision}`;
      durationString += !durationString.length ? humanized
        : `${pluralPrecision === lowestPrec ? ' and' : ','} ${humanized}`;
      if (pluralPrecision === lowestPrec) {
        break;
      }
      eventMDuration.subtract(duration, pluralPrecision);
    }
  }

  return durationString;
}

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
  const { config, query, params: { jobId } } = req;

  let job;
  let flow;
  let statuses;
  let stateMachine = {
    name: 'N/A',
  };

  try {
    ([job] = await db.select().from('jobs').where({ jobId }));
    statuses = filterUniqueStatuses(await getStatuses(req));
  } catch (e) {
    return next(e);
  }

  const status = statuses[0];

  if (status) {
    if (status.createdDate) {
      job.updatedOn = status.createdDate;
    }
    if (status.taskState) {
      job.currentStatus = status.taskState;
    }

    let diff;
    const { taskState } = status;
    const terminalStates = ['success', 'failed', 'timeout', 'aborted'];
    // Only worry about terminal states here. Everything else has its duration/diff
    // based on the current time.
    if (terminalStates.includes(taskState)) {
      diff = Moment(status.createdDate).diff(Moment(job.createdOn));
    } else {
      diff = Moment().diff(Moment(job.createdOn));
    }

    // Treat humanizeDuration as "expensive" and avoid invoking it for small
    // values we can handle ourselves.
    if (diff <= 1000) {
      job.duration = '1 second';
    } else {
      job.duration = humanizeDuration(diff);
    }
  }

  return res.render('jobDetails', {
    job,
    statuses,
    config,
    query,
  });
};
