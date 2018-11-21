const { COUNTRY_ISO } = process.env;

export const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;
export const getWBData = ({ WorldBank }) => WorldBank.data[COUNTRY_ISO] || null;
export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;
export const getTargetEmissionsData = ({ GHGTargetEmissions }) =>
  GHGTargetEmissions && GHGTargetEmissions.data || null;
export const getQuery = ({ location }) => location && location.query || null;
