import { createSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';

export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;
export const getTargetEmissionsData = ({ GHGTargetEmissions }) =>
  GHGTargetEmissions && GHGTargetEmissions.data || null;
export const getQuery = ({ location }) => location && location.query || null;

export const getFieldQuery = field => createSelector([ getQuery ], query => {
  if (!query || !query[field]) return null;
  return String(query[field]);
});
const getSelectedSource = createSelector(
  [ getFieldQuery('source') ],
  sourceQuery => sourceQuery || 'SIGN_SMART'
);

const _getMetadata = ({ metadata }) => metadata;

export const getMetadata = createSelector([ _getMetadata, getSelectedSource ], (
  metadata,
  source
) =>
  {
    if (!metadata || !source) return null;
    const meta = source === 'CAIT' ? 'ghgcw' : 'ghgindo';
    return metadata[meta];
  });

export const getMetadataData = createSelector(
  getMetadata,
  meta => meta && meta.data
);

export const getTop10EmittersOptionLabel = createSelector(
  getTranslate,
  t => t('pages.national-context.historical-emissions.region.top-10')
);
