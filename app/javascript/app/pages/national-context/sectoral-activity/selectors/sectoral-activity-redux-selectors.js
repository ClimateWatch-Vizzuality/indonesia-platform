export const getEmissionActivities = ({ emissionActivities }) =>
  emissionActivities && emissionActivities.data;

export const getAdaptation = ({ adaptation }) => adaptation && adaptation.data;

export const getQuery = ({ location }) => location && location.query || null;
