import { createStructuredSelector } from 'reselect';
import { getQuery } from './historical-emissions-get-selectors';
import {
  getSelectedOptions,
  getFilterOptions,
  getTop10EmittersOption
} from './historical-emissions-filter-selectors';
import { getEmissionParams } from './historical-emissions-fetch-selectors';
import {
  getModelSelected,
  getChartData
} from './historical-emissions-data-selectors';

export const getGHGEmissions = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  fieldToBreakBy: getModelSelected,
  filterOptions: getFilterOptions,
  query: getQuery,
  emissionParams: getEmissionParams,
  chartData: getChartData,
  top10EmmitersOption: getTop10EmittersOption
});
