import { createStructuredSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';
import { getQuery } from './historical-emissions-get-selectors';
import {
  getSelectedOptions,
  getFilterOptions,
  getAllSelectedOption,
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
  allSelectedOption: getAllSelectedOption,
  t: getTranslate
});
