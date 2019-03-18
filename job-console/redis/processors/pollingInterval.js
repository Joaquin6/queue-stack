import pollConductorFlow from './pollConductorFlow';

export default async function pollingInterval({
  correlationId,
  intervalTimer,
  flowId,
  log,
  done,
}) {
  try {
    await pollConductorFlow({
      correlationId,
      flowId,
      intervalTimer,
      done,
    });
  } catch (err) {
    log.error({ err, flowId, msg: 'Unable to poll for Conductor flow status' });
  }
}
