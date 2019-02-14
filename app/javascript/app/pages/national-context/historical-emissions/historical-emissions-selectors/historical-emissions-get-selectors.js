import { createSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';

export const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;
export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;
export const getTargetEmissionsData = ({ GHGTargetEmissions }) =>
  GHGTargetEmissions && GHGTargetEmissions.data || null;
export const getQuery = ({ location }) => location && location.query || null;

export const getTop10EmittersOptionLabel = createSelector(
  getTranslate,
  t => t('pages.national-context.historical-emissions.region.top-10')
);
