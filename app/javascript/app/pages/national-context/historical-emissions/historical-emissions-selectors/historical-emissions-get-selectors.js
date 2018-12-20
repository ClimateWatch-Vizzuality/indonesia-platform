import { createSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';

// TODO: Remember to change this defaults once we get the province data
const TOP_10_EMITTERS_VALUE = [
  'ID.AC',
  'ID.BA',
  'ID.BB',
  'ID.BT',
  'ID.BE',
  'ID.GO',
  'ID.JA',
  'ID.MA',
  'ID.KU',
  'ID.JB'
];

export const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;
export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;
export const getTargetEmissionsData = ({ GHGTargetEmissions }) =>
  GHGTargetEmissions && GHGTargetEmissions.data || null;
export const getQuery = ({ location }) => location && location.query || null;

export const getTop10EmittersOptionLabel = createSelector(
  getTranslate,
  t => t('pages.national-context.historical-emissions.provinces.top-10')
);

export const getDefaultTop10EmittersOption = createSelector(
  [ getMetadata, getTop10EmittersOptionLabel ],
  (meta, top10Label) => {
    if (!meta) return null;
    const value = TOP_10_EMITTERS_VALUE.map(p => {
      const location = meta.location.find(l => l.iso_code3 === p);
      return location && location.value;
    }).join();
    return { label: top10Label, value, override: true };
  }
);

export const getTop10EmitterSplittedOptions = createSelector(
  getMetadata,
  meta => {
    if (!meta) return null;
    return TOP_10_EMITTERS_VALUE.map(p => {
      const emitterOption = meta.location.find(l => l.iso_code3 === p);
      return { label: emitterOption.label, value: String(emitterOption.value) };
    });
  }
);
