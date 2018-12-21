import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { getProvince } from 'selectors/provinces-selectors';

const DEFAULT_SECTION = 'regions-ghg-emissions';

const getProvinces = ({ provinces }) => provinces && provinces.data || null;
const getLocation = ({ location }) => location && location;

const getSection = createSelector(getLocation, location => {
  if (!location) return null;

  return get(location, 'payload.region')
    ? get(location, 'payload.section')
    : '';
});

const getParsedProvinces = createSelector([ getProvinces, getSection ], (
  provinces,
  section
) =>
  {
    if (!provinces || isEmpty(provinces)) return [];

    const provinceSection = section || DEFAULT_SECTION;

    return provinces.map(province => ({
      value: province.iso_code3,
      label: province.wri_standard_name,
      path: `/regions/${province.iso_code3}/${provinceSection}`
    }));
  });

export const getProvincesData = createStructuredSelector({
  provinces: getParsedProvinces,
  activeProvince: getProvince
});
