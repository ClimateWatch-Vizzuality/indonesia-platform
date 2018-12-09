import {
  PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION,
  ADAPTATION_CODE
} from './sectoral-activity-constants';

export const shouldBeGroupedByActivities = selectedIndicator =>
  selectedIndicator &&
    selectedIndicator.label !==
      PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION.label;

export const isPrimarySourceOfEmissionSelected = selectedIndicator =>
  selectedIndicator &&
    selectedIndicator.label ===
      PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION.label;

export const isAdaptationSelected = selectedIndicator =>
  selectedIndicator && selectedIndicator.value === ADAPTATION_CODE;
