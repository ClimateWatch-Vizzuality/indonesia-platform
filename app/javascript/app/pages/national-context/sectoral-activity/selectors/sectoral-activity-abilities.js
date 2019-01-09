import {
  PRIMARY_SOURCE_OF_EMISSION_INDICATOR,
  ADAPTATION_CODE
} from './sectoral-activity-constants';

export const shouldBeGroupedByActivities = selectedIndicator =>
  selectedIndicator &&
    selectedIndicator.value !== PRIMARY_SOURCE_OF_EMISSION_INDICATOR;

export const isPrimarySourceOfEmissionSelected = selectedIndicator =>
  selectedIndicator &&
    selectedIndicator.value === PRIMARY_SOURCE_OF_EMISSION_INDICATOR;

export const isAdaptationSelected = selectedIndicator =>
  selectedIndicator && selectedIndicator.value === ADAPTATION_CODE;
