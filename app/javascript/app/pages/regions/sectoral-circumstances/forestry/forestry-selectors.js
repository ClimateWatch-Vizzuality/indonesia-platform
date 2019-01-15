import { getTranslate } from 'selectors/translation-selectors';
import { getProvince } from 'selectors/provinces-selectors';
import { createSelector, createStructuredSelector } from 'reselect';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { getThemeConfig, getTooltipConfig } from 'utils/graphs';
import flatten from 'lodash/flatten';

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

    const allYears = flatten(
      data
        .map(d => d.values)
        .map(arr => arr.map(o => o.year))
    );
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

const getIndicatorName = createSelector(getIndicatorMeta, indicatorMeta => {
  if (!indicatorMeta) return null;

  return indicatorMeta.name;
});

const getChartConfig = createSelector(
  [ getYColumnOptions, getUnit, getTranslate, getIndicatorName ],
  (yColumnOptions, unit, t, indicatorName) => {
    if (!yColumnOptions || !unit || !t || !indicatorName) return null;

    const axes = {
      xBottom: { name: t('common.years-label'), unit: t('common.years-label') },
      yLeft: {
        name: indicatorName,
        unit: upperFirst(unit),
        label: indicatorName
      }
    };

    const tooltip = getTooltipConfig(yColumnOptions);

    return {
      axes,
      tooltip,
      animation: false,
      theme: getThemeConfig(yColumnOptions, null, CHART_COLORS),
      columns: {
        x: [ { label: t('common.years-label'), value: 'x' } ],
        y: yColumnOptions
      }
    };
  }
);

const getChartData = createStructuredSelector({
  data: getDataForChart,
  config: getChartConfig,
  dataOptions: getYColumnOptions,
  dataSelected: getYColumnOptions
});

export const getForestryData = createStructuredSelector({
  t: getTranslate,
  indicatorName: getIndicatorName,
  chartData: getChartData
});
