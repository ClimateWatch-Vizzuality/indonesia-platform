import { createStructuredSelector } from 'reselect';
import { getTranslatedContent } from 'selectors/translation-selectors';
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

const requestedTranslations = [
  { slug: 'historical-emissions', key: 'title', label: 'title' },
  { slug: 'historical-emissions', key: 'description', label: 'description' }
];

export const getGHGEmissions = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  fieldToBreakBy: getModelSelected,
  metricSelected: getMetricSelected,
  filterOptions: getFilterOptions,
  query: getQuery,
  emissionParams: getEmissionParams,
  chartData: getChartData,
  top10EmmitersOption: getTop10EmittersOption,
  translations: getTranslatedContent(requestedTranslations)
});
