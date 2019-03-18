import getFlowById from './getFlowById';

export default async function pollConductorFlow({
  correlationId,
  flowId,
  intervalTimer,
  done,
}) {
  const result = await getFlowById({
    correlationId,
    flowId,
  });

  if (result.flowState === 'processing' || result.flowState === 'initializing') {
    return;
  }

  if (result.flowState === 'failed' || result.flowState === 'timeout') {
    done(new Error('Job Failed'));
  } else {
    clearInterval(intervalTimer);

    done(null, result);
  }
}
