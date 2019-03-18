const faker = require('faker');
const TASK_STATES = ['initializing', 'processing', 'success', 'failed', 'aborted', 'timeout'];
const TASK_STATES_MAP = TASK_STATES.reduce((agg, state) => ({
  ...agg,
  [state.toUpperCase()]: state,
}), {});

const STATUSES_COLUMNS = [
  'id',
  'jobId',
  'state',
  'createdDate',
  'details',
  'exitCode',
];

const isTerminalState = (state) => state === TASK_STATES_MAP.SUCCESS
  || state === TASK_STATES_MAP.FAILED
  || state === TASK_STATES_MAP.ABORTED
  || state === TASK_STATES_MAP.TIMEOUT;

const statuses = [
  {
    id: faker.random.uuid(),
    jobId: 'c7fb1b1f-b9e0-4fde-8539-123fb6bc5fe0',
    state: TASK_STATES_MAP.PROCESSING,
    createdDate: new Date().toISOString(),
    details: 'Working...',
  },
  {
    id: faker.random.uuid(),
    jobId: 'c7fb1b1f-b9e0-4fde-8539-123fb6bc5fe0',
    state: TASK_STATES_MAP.PROCESSING,
    createdDate: new Date().toISOString(),
    details: 'Almost done...',
  },
  {
    id: faker.random.uuid(),
    jobId: 'c7fb1b1f-b9e0-4fde-8539-123fb6bc5fe0',
    state: TASK_STATES_MAP.PROCESSING,
    createdDate: new Date().toISOString(),
    details: 'Almost, ALMOST done...',
  },

  {
    id: faker.random.uuid(),
    jobId: '098923d7-551d-44a6-83d0-e0c020755a80',
    state: TASK_STATES_MAP.PROCESSING,
    createdDate: new Date().toISOString(),
    details: 'Extracting 1 of 1 images.',
  },
  {
    id: faker.random.uuid(),
    jobId: '098923d7-551d-44a6-83d0-e0c020755a80',
    state: TASK_STATES_MAP.PROCESSING,
    createdDate: new Date().toISOString(),
    details: 'Applying spit shine to image(s)...',
  },
  {
    id: faker.random.uuid(),
    jobId: '098923d7-551d-44a6-83d0-e0c020755a80',
    state: TASK_STATES_MAP.SUCCESS,
    createdDate: new Date().toISOString(),
    details: 'Image transmogrification complete.',
  },

  {
    id: faker.random.uuid(),
    jobId: 'ba45b5cc-c373-4945-b1d2-ef226e90322e',
    state: TASK_STATES_MAP.PROCESSING,
    createdDate: new Date().toISOString(),
    details: 'Attempting to do work, please hold...',
  },
  {
    id: faker.random.uuid(),
    jobId: 'ba45b5cc-c373-4945-b1d2-ef226e90322e',
    state: TASK_STATES_MAP.PROCESSING,
    createdDate: new Date().toISOString(),
    details: 'Uh, bad things a-happening!',
  },
  {
    id: faker.random.uuid(),
    jobId: 'ba45b5cc-c373-4945-b1d2-ef226e90322e',
    state: TASK_STATES_MAP.FAILED,
    createdDate: new Date().toISOString(),
    details: 'Unable to do work, calling in sick.',
    exitCode: 123,
  },
];

module.exports = {
  STATUSES_COLUMNS,
  TASK_STATES,
  TASK_STATES_MAP,
  isTerminalState,
  statuses,
};
