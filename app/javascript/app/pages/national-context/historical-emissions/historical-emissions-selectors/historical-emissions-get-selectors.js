import { createSelector } from 'reselect';
import { TOP_10_EMMITERS, TOP_10_EMMITERS_OPTION } from 'constants/constants';

const { COUNTRY_ISO } = process.env;

export const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;
export const getWBData = ({ WorldBank }) => WorldBank.data[COUNTRY_ISO] || null;
export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;
export const getTargetEmissionsData = ({ GHGTargetEmissions }) =>
  GHGTargetEmissions && GHGTargetEmissions.data || null;
export const getQuery = ({ location }) => location && location.query || null;

export const getDefaultTop10EmittersOption = createSelector(
  getMetadata,
  meta => {
    if (!meta) return null;
    const value = TOP_10_EMMITERS_OPTION.value.map(p => {
      const location = meta.location.find(l => l.label === p);
      return location && location.value;
    }).join();
    return { label: TOP_10_EMMITERS, value };
  }
);
