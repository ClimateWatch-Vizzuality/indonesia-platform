import { createSelector } from 'reselect';
import { TOP_10_EMITTERS, TOP_10_EMITTERS_OPTION } from 'constants/constants';

export const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;
export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;
export const getTargetEmissionsData = ({ GHGTargetEmissions }) =>
  GHGTargetEmissions && GHGTargetEmissions.data || null;
export const getQuery = ({ location }) => location && location.query || null;

export const getDefaultTop10EmittersOption = createSelector(
  getMetadata,
  meta => {
    if (!meta) return null;
    const value = TOP_10_EMITTERS_OPTION.value.map(p => {
      const location = meta.location.find(l => l.iso_code3 === p);
      return location && location.value;
    }).join();
    return { label: TOP_10_EMITTERS, value };
  }
);

export const getTop10EmitterSplittedOptions = createSelector(
  getMetadata,
  meta => {
    if (!meta) return null;
    return TOP_10_EMITTERS_OPTION.value.map(p => {
      const emitterOption = meta.location.find(l => l.iso_code3 === p);
      return { label: emitterOption.label, value: String(emitterOption.value) };
    });
  }
);
