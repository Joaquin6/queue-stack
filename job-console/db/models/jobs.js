const JOB_STATES = ['initializing', 'processing', 'success', 'failed', 'aborted', 'timeout'];
const JOB_STATES_MAP = JOB_STATES.reduce((agg, state) => ({
  ...agg,
  [state.toUpperCase()]: state,
}), {});

const JOBS_COLUMNS_NO_TIMERS = [
  'id',
  'url',
  'name',
  'createdDate',
  'updatedDate',
  'rawhtml',
];
const JOBS_COLUMNS_ALL = '*';

const isTerminalState = (state) => state === JOB_STATES_MAP.SUCCESS
  || state === JOB_STATES_MAP.FAILED
  || state === JOB_STATES_MAP.ABORTED
  || state === JOB_STATES_MAP.TIMEOUT;

const jobs = [
  {
    id: 'c7fb1b1f-b9e0-4fde-8539-123fb6bc5fe0',
    url: 'http://test1.com',
    name: 'job-name-1',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    rawhtml: '<html><head></head><body><p>some raw markup 1</p></body></html>'
  },
  {
    id: '098923d7-551d-44a6-83d0-e0c020755a80',
    url: 'http://test2.com',
    name: 'job-name-2',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    rawhtml: '<html><head></head><body><p>some raw markup 2</p></body></html>'
  },
  {
    id: 'ba45b5cc-c373-4945-b1d2-ef226e90322e',
    url: 'http://test3.com',
    name: 'job-name-3',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    rawhtml: '<html><head></head><body><p>some raw markup 3</p></body></html>'
  },
];

module.exports = {
  JOBS_COLUMNS_NO_TIMERS,
  JOBS_COLUMNS_ALL,
  JOB_STATES,
  JOB_STATES_MAP,
  jobs,
  isTerminalState,
};
