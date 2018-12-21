import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const getProvinces = ({ provinces }) => provinces && provinces.data || null;

const getParsedProvinces = createSelector(getProvinces, provinces => {
  if (!provinces || isEmpty(provinces)) return [];

  return provinces.map(province => ({
    value: province.iso_code3,
    label: province.wri_standard_name,
    path: `/regions/${province.iso_code3}`
  }));
});

export const getProvincesData = createStructuredSelector({
  provinces: getParsedProvinces
});
