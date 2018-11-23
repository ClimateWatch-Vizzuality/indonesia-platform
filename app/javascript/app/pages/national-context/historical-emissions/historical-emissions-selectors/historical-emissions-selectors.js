import { createStructuredSelector } from 'reselect';
import { getQuery } from './historical-emissions-get-selectors';
import {
  getSelectedOptions,
  getFilterOptions,
  getTop10EmittersOption,
  getModelSelected,
  getMetricSelected
} from './historical-emissions-filter-selectors';
import { getEmissionParams } from './historical-emissions-fetch-selectors';
import { getChartData } from './historical-emissions-data-selectors';

export const getGHGEmissions = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  fieldToBreakBy: getModelSelected,
  metricSelected: getMetricSelected,
  filterOptions: getFilterOptions,
  query: getQuery,
  emissionParams: getEmissionParams,
  chartData: getChartData,
  top10EmmitersOption: getTop10EmittersOption
});
