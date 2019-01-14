import { getTranslate } from 'selectors/translation-selectors';
import { getProvince } from 'selectors/provinces-selectors';
import { createSelector, createStructuredSelector } from 'reselect';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { getThemeConfig, getTooltipConfig } from 'utils/graphs';

const FORESTRY_CODE = 'forest_cover_loss';

const CHART_COLORS = [ '#FC7E4B', '#00B4D2' ];

const getIndicators = ({ indicators }) => indicators && indicators.data;

const getForestryIndicators = createSelector(getIndicators, indicators => {
  if (!indicators) return null;

  return indicators.values &&
    indicators.values.filter(ind => ind.indicator_code === FORESTRY_CODE);
});

const getForestryIndicatorsPerProvince = createSelector(
  [ getForestryIndicators, getProvince ],
  (forestryIndicators, provinceIso) => {
    if (!forestryIndicators || !provinceIso) return null;

    return forestryIndicators.filter(
      ind => ind.location_iso_code3 === provinceIso
    );
  }
);

const getUniqueYears = createSelector(
  getForestryIndicatorsPerProvince,
  data => {
    if (!data) return null;

    const allYears = data
      .map(d => d.values)
      .map(arr => arr.map(o => o.year))
      .flatten();
    return [ ...new Set(allYears) ];
  }
);

const getDataForChart = createSelector(
  [ getUniqueYears, getForestryIndicatorsPerProvince ],
  (years, forestryData) => {
    if (!years || !forestryData) return null;

    const data = years.map(year => {
      const yValues = {};
      forestryData.forEach(({ values, category }) => {
        const valueForYear = values.find(o => o.year === year);
        const yKey = `y${upperFirst(camelCase(category))}`;
        yValues[yKey] = valueForYear && valueForYear.value;
      });
      return { x: year, ...yValues };
    });

    return data;
  }
);

const getYColumnOptions = createSelector(
  getForestryIndicatorsPerProvince,
  indicators => {
    if (!indicators) return null;

    return indicators.map(({ category }) => ({
      label: upperFirst(category),
      value: `y${upperFirst(camelCase(category))}`
    }));
  }
);

const getIndicatorMeta = createSelector(getIndicators, indicators => {
  if (!indicators) return null;

  return indicators.indicators &&
    indicators.indicators.find(ind => ind.code === FORESTRY_CODE);
});

const getUnit = createSelector(getIndicatorMeta, indicatorMeta => {
  if (!indicatorMeta) return null;

  return indicatorMeta.unit;
});

const getChartConfig = createSelector([ getYColumnOptions, getUnit ], (
  yColumnOptions,
  unit
) =>
  {
    if (!yColumnOptions || !unit) return null;

    // TODO - GET THE UNIT FROM API
    const axes = {
      xBottom: { name: 'Years', unit: 'Years' },
      yLeft: { name: 'Tree loss', unit: upperFirst(unit), label: 'Tree loss' }
    };

    const tooltip = getTooltipConfig(yColumnOptions);

    return {
      axes,
      tooltip,
      animation: false,
      theme: getThemeConfig(yColumnOptions, null, CHART_COLORS),
      columns: { x: [ { label: 'years', value: 'x' } ], y: yColumnOptions }
    };
  });

const getChartData = createStructuredSelector({
  data: getDataForChart,
  config: getChartConfig,
  // loading: getDataLoading,
  dataOptions: getYColumnOptions,
  dataSelected: getYColumnOptions
});

export const getForestryData = createStructuredSelector({
  t: getTranslate,
  provinceIso: getProvince,
  forestryData: getForestryIndicatorsPerProvince,
  years: getUniqueYears,
  data: getDataForChart,
  // parsedData: getParsedData
  chartData: getChartData
});
